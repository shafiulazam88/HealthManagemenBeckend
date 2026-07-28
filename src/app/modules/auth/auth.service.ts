
import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

interface RegisterPatientInput {
    name: string;
    email: string;
    password: string;
}
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

    return{
        ...data,
        patient
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
interface loginUserInput {
    email: string;
    password: string;
}

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
    return data;
}




export const AuthService ={
    registerPatient,
    loginUser
}
