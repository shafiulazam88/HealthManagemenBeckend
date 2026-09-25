
import status from "http-status";
import { envVariable } from "../../../config/env";
import { UserStatus } from "../../../generated/prisma/enums";
import { IRequestUser } from "../../interface.ts/userRequest.interface";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { tokenUtils } from "../../utils/token";
import { JwtPayload } from "jsonwebtoken";
import  {IChangePassword, loginUserInput, RegisterPatientInput}  from "./auth.interface";
import { revokeOtherSessions } from "better-auth/api";


const registerPatient= async(payload:RegisterPatientInput)=>{
    const {name , email , password} = payload;
    const data = await auth.api.signUpEmail(
        {
            body:{
                name ,
                email ,
                password
                //default values
                // role: Role.PATIENT
            }
        }
    )

    if(!data.user){
        throw new Error("failed to register patient");
    }
    // //if user patient then create patient 
    //todo
    try {
    const patient =await prisma.$transaction((tx)=>{
        const patientTx = tx.patient.create({
            data: {
                userId: data.user.id,
                name: payload.name,
                email: payload.email,
                // contactNumber: payload.contactNumber,
                // address: data.user.address
            }
        })
        return patientTx;
    })
      // getting the access token
    const accessToken = tokenUtils.getAccessToken(
        {
            userId: data.user.id,
            email: data.user.email,
            role: data.user.role,
            name: data.user.name,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified  
        }
    )
    const refreshToken = tokenUtils.getRefreshToken(
        {
            userId: data.user.id,
            email: data.user.email,
            role: data.user.role,
            name: data.user.name,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified  
        }
    )

    return{
        ...data,
        patient,
        accessToken,
        refreshToken
    }
} catch (error) {
    console.log("transaction error", error)
    //if user created I but patien not created we will delete the user for safe check
    await prisma.user.delete({
        where: {
            id: data.user.id
        }
    })
    throw error;
}
}
//login 



const loginUser = async(payload:loginUserInput)=>{
    const {email , password} = payload;
    const data = await auth.api.signInEmail(
        {
            body:{
                email ,
                password
            }
        }
    )
    if(data.user.status == UserStatus.BLOCKED){
        throw new Error("User is blocked");
    }
    if(data.user.isDeleted || data.user.status === UserStatus.DELETED){
        throw new Error("User is deleted");
    }
     
    // getting the access token
    const accessToken = tokenUtils.getAccessToken(
        {
            userId: data.user.id,
            email: data.user.email,
            role: data.user.role,
            name: data.user.name,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified  
        }
    )
    const refreshToken = tokenUtils.getRefreshToken(
        {
            userId: data.user.id,
            email: data.user.email,
            role: data.user.role,
            name: data.user.name,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified  
        }
    )

    return{
        ...data,
        accessToken,
        refreshToken
    };
}

const getMe = async(user:IRequestUser)=>{
    //first check the user is exist or not
    const userData = await prisma.user.findUnique({
        where:{
            id: user.userId
        },
        include : {
            patient : {
                include : {
                    appointments : true,
                    reviews : true,
                    prescriptions : true,
                    MedicalReports : true,
                    patientHealthData : true,
                }
            },
            doctor : {
                include : {
                    specialities : true,
                    appointments : true,
                    reviews : true,
                    prescriptions : true,
                }
            },
            
        }
    })
    if(!userData){
        throw new Error("User not found");
    }
    return userData;
}

//generate after expiration of aceess token using refresh token
const getNewToken = async(refreshToken:string ,sessionToken:string )=>{
    //session token stores in db so we cant refresh or generate it
    //so we need to increase the expiration time of the session token

    //check the session token is valid or not
    const isSesssionTokenExists = await prisma.session.findUnique({
        where:{
            token: sessionToken,
        },
        include:{
            user:true,
        }
    })

    if(!isSesssionTokenExists){
        //todo app error

        throw new Error(status.UNAUTHORIZED.toString(),{cause: "Session token not found"});
    }


    // check token verified or not
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken,envVariable.REFRESH_TOKEN_SECRET);

   
    if(!verifiedRefreshToken.success && verifiedRefreshToken.error){
        //todo app error
        throw new Error(status.UNAUTHORIZED.toString(),{cause: "Invalid refresh token"});
    }
     const data = verifiedRefreshToken.data as JwtPayload;
    //  console.log(data);
    const newAccessToken = tokenUtils.getAccessToken
    (
        {
            userId: data.userId,
            email: data.email,
            role: data.role,
            name: data.name,
            status: data.status,
            isDeleted: data.isDeleted,
            emailVerified: data.emailVerified  

        }
    )

    //if refresh token get expired then how can we generate access token 
    // thats why we need to generate new refresh token
    const newRefreshToken = tokenUtils.getRefreshToken
    (
        {
            userId: data.userId,
            email: data.email,
            role: data.role,
            name: data.name,
            status: data.status,
            isDeleted: data.isDeleted,
            emailVerified: data.emailVerified  
        }
    )

    const updatedSession = await prisma.session.update({
        where:{
            token: sessionToken,
        },
        data:{
            token: sessionToken,
            expiresAt: new Date(Date.now()+ 86400000), // 1 day increased
            updatedAt: new Date()
        }
    })
    // we need just token so destructure
    const{token}= updatedSession;

    return{
       accessToken: newAccessToken,
       refreshToken: newRefreshToken,
       sessionToken: token
    }
}

const changePassword= async(payload:IChangePassword , sessionToken:string)=>{

    const session = await auth.api.getSession(
        {
            headers: new Headers({
                Authorization: `Bearer ${sessionToken}`
            })
        }
    )

    if(!session){
        //todo appError
        throw new Error(status.UNAUTHORIZED.toString(),{cause: "Invalid session"});
    }
    const{ currentPassword, newPassword} = payload;

    const result = await auth.api.changePassword ({
        body:{
           
            currentPassword,
            newPassword,
            revokeOtherSessions:true
        },
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`
        })
    })

    if(session.user.needPasswordChange){
        await prisma.user.update(
            {
                where:{
                    id: session.user.id
                },
                data:{
                    needPasswordChange:false
                }
            }
        )
    }

    const accessToken = tokenUtils.getAccessToken (
        {
           userId: session.user.id,
           email: session.user.email,
            role: session.user.role,
            name: session.user.name,
            status: session.user.status,
            isDeleted: session.user.isDeleted,
            emailVerified: session.user.emailVerified 

        }
    )
    const refreshToken = tokenUtils.getRefreshToken (
        {
           userId: session.user.id,
           email: session.user.email,
            role: session.user.role,
            name: session.user.name,
            status: session.user.status,
            isDeleted: session.user.isDeleted,
            emailVerified: session.user.emailVerified 

        }
    )
    


    return { ...result,
        accessToken,
        refreshToken,
        // token:sessionToken
    };
    

}

const verifyEmail = async(email:string , otp:string)=>{
            const result  = await auth.api.verifyEmailOTP(
                {
                    body:{
                        email,
                        otp
                    }
                }
            )
            if(result.status && !result.user.emailVerified)
            {
                await prisma.user.update({
                    where:{
                        email
                    },
                    data:{
                        emailVerified:true
                    }
                })
            }
};


//forget password
const forgetPassword = async(email:string)=>{
    const user = await prisma.user.findUnique({
        where:{
            email
        }
    })
    if(!user){
        throw new Error("User not found");
    }
    if(!user.emailVerified){
        throw new Error("Email not verified");
    }
    if(user.isDeleted){
        throw new Error("User is deleted");
    }
    if(user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED){
        throw new Error("User is blocked or deleted");
    }

    await auth.api.requestPasswordResetEmailOTP(
        {
            body:{
                email
            }
        }
    )
    
};

//reset password
const resetPassword = async(email:string, otp:string, newPassword:string)=>{
    const user = await prisma.user.findUnique({
        where:{
            email
        }
    })
    if(!user){
        throw new Error("User not found");
    }
    if(!user.emailVerified){
        throw new Error("Email not verified");
    }
    if(user.isDeleted){
        throw new Error("User is deleted");
    }
    if(user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED){
        throw new Error("User is blocked or deleted");
    }
    await auth.api.resetPasswordEmailOTP(
        {
            body:{
                email,
                otp,
                password: newPassword
            }
        }
    )

    //delete the sessions of the user
    await prisma.session.deleteMany({
        where:{
            userId: user.id
        }
    })
    
}
export const AuthService ={
    registerPatient,
    loginUser,
    getMe ,
    getNewToken,
    changePassword,
    verifyEmail,
    forgetPassword,
    resetPassword
}
