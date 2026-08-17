

import { Role, Speciality } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { IAdmin, IDoctor, ISuperAdmin } from "./user.interface";

// const createDoctor = async(payload:IDoctor) => {
//     const specialities : Speciality[]= [];

//     for(const specialityId of payload.specialities) {
//        const speciality = await prisma.speciality.findUnique({
//            where: {
//                id: specialityId
//            }
//        });
//        if(!speciality) {
//            throw new Error("Speciality not found");
//        }
//        specialities.push(speciality);
//     }

//     const userExists = await prisma.user.findUnique({
//         where: {
//             email: payload.doctor.email
//         }
//     });

//     if(userExists) {
//         throw new Error("User already exists");
//     }
    
//     const userData =  await auth.api.signUpEmail({
//         body: {
//             email: payload.doctor.email,
//             password: payload.password,
//             role: Role.DOCTOR,
//             name: payload.doctor.name,
//             //when admin create doctor, need to change password
//             needPasswordChange: true
//         }
//     });

//     try {
//         const result= await prisma.$transaction(async(tx) => {
//             //amra doctor e password rakhbo na, only user table e password rakhbo ja better auth korbe
            
//             const doctor = await tx.doctor.create({
//                 data: {
//                     userId: userData.user.id,
//                     ...payload.doctor,
                    
//                 }
//             });
            
//             const doctorSpecialityData = specialities.map(
//                 (speciality) => {
//                     return {
//                         doctorId: doctor.id,
//                         specialityId: speciality.id
//                     }
//                 }
//             )
//              await tx.doctorSpeciality.createMany({
//                 data: doctorSpecialityData
//             })
//             //create doctor only returns  doctor table
//             //so we need to get doctor data with specialities and users
//            const doctorData = await tx.doctor.findUnique({
//                where: {
//                    id: doctor.id
//                },
//                select: {
//                    id: true,
//                    userId: true,
//                    name: true,
//                    email: true,
//                    contactNumber: true,
//                    profilePhoto: true,
//                    experience: true,
//                    qualification: true,
//                    registrationNumber: true,
//                    gender: true,
//                    appointmentFee: true,
//                    address: true,
//                    currentWorkingPlace: true,
//                    designation: true,
//                    createdAt: true,
//                    updatedAt: true,
//                    user:{
//                     select:{
//                         id: true,
//                         email: true,
//                         role: true,
//                         status:true,
//                         emailVerified:true,
//                         image:true,
//                         createdAt:true,
//                         updatedAt:true,
//                         isDeleted:true,
//                         deletedAt:true
//                     }
//                    },
//                    specialities:{
//                     select:{
//                         speciality:{
//                             select:{
//                                 title: true,
//                                 id: true

//                             }

//                         }
//                     }
//                    }

                  
                   
//                }
//            })
//            return doctorData;
//         })
//         return result;

        
//     } catch (error) {
//         console.log("transaction error :", error );
//         await prisma.user.delete(
//             {
//                 where: {
//                     id: userData.user.id
//                 }
//             }
//         )
//         throw error;
        
//     }

    
// }

// export const UserService = {
//     createDoctor
// }

//optimized code remove n+1 query

const createDoctor = async (payload: IDoctor) => {
    const verifySpeciality = await prisma.speciality.findMany(
        {
            where: {
                id: {
                    in: payload.specialities
                }
            }
        }
    )
    if(verifySpeciality.length !== payload.specialities.length){
        throw new Error("Invalid speciality id");
    }
    //now signup
    console.time("better-auth");
    // create user in better-auth
    // better auth checks user exists or not
    // if user exists, it will throw error
    const userData = await auth.api.signUpEmail({
        body : {
            email: payload.doctor.email,
            password: payload.password,
            role: Role.DOCTOR,
            name: payload.doctor.name,
            //when admin create doctor, need to change password
            needPasswordChange: true
        }
    })
    

    // now prisma transaction doctor create

    try {
        return await prisma.$transaction(async (tx) => {

            const doctor = await tx.doctor.create({
                data: {
                    userId: userData.user.id,
                    ...payload.doctor,
                    specialities : {
                        create: payload.specialities.map(
                            (specialityId) => ({
                                specialityId
                            }) 
                        )
                    }
                },
                // Use select  to completely eliminate the extra findUnique query of n+1 
                 select: {
                   id: true,
                   userId: true,
                   name: true,
                   email: true,
                   contactNumber: true,
                   profilePhoto: true,
                   experience: true,
                   qualification: true,
                   registrationNumber: true,
                   gender: true,
                   appointmentFee: true,
                   address: true,
                   currentWorkingPlace: true,
                   designation: true,
                   createdAt: true,
                   updatedAt: true,
                   user:{
                    select:{
                        id: true,
                        email: true,
                        role: true,
                        status:true,
                        emailVerified:true,
                        image:true,
                        createdAt:true,
                        updatedAt:true,
                        isDeleted:true,
                        deletedAt:true
                    }
                   },
                   specialities:{
                    select:{
                        speciality:{
                            select:{
                                title: true,
                                id: true

                            }

                        }
                    }
                  } 
                }

            })
            
            return doctor;
        })

        
    } catch (error) {
         console.log("transaction error :", error );
        await prisma.user.delete(
            {
                where: {
                    id: userData.user.id
                }
            }
        )
        
        throw error;
        
    }
    
}

export const createAdmin= async(payload: IAdmin)=>{
     
    

    try {
        //signup in better auth
        // better auth handles duplicate users
        // we dont need to handle duplicate users here
    const admin = await auth.api.signUpEmail({
        body: {
            email: payload.email,
            password: payload.password,
            role: Role.ADMIN,
            name: payload.name,
            needPasswordChange: true
        }
     })

     return admin;

        
    } catch (error) {
        console.log("create admin error :", error );

        throw error;
    }


}

const createSuperAdmin = async (payload:ISuperAdmin) => {

    try {
        const superAdmin = await auth.api.signUpEmail({
            body: {
                email: payload.email,
                password: payload.password,
                role: Role.SUPER_ADMIN,
                name: payload.name,
                needPasswordChange: true
            }
        })
        
        return superAdmin;
    } catch (error) {
        console.log("create super admin error :", error );
        throw error;
    }
    
}


export const UserService = {
    createDoctor,
    createAdmin,
    createSuperAdmin
}