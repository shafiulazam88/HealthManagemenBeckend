
import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { UpdateDoctor } from "./doctor.interface";

const getAllDoctors = async () => {
    const doctors = await prisma.doctor.findMany(
        {
            where:{
                isDeleted:false
            },
            include:{
                user:true,
                specialities:{
                    select:{
                        speciality:{
                            select:{
                                id:true,
                                title:true
                            }
                        }
                    }
                }
            }
        }
    );
    return doctors;
}

const getDoctorById = async(id:string) => {
    const doctor = await prisma.doctor.findUnique({
        where:{id, isDeleted:false},
        include:{
            user:true,
            specialities:{
                select:{
                    speciality:{
                        select:{
                            id :true,
                            title:true
                        }
                    }
                }
            }
        }
    });
    return doctor;
    
}

//update doctor

const updateDoctorById = async(id:string,payload:UpdateDoctor) => {
    //first verify specialities

    if(payload.specialities){
        //check if all specialities exist
        const verifiedSpeciality = await prisma.speciality.findMany(
            {
                where:{
                    id: {
                        in: payload.specialities
                    }
                }
            }
        );
        if(verifiedSpeciality.length !== payload.specialities.length){
            throw new Error("one or more specialities not found");
        }
        
       
    }
   
   try {
       

      const result = await prisma.$transaction(async (tx) => 
        {
         //verify id
        const existingDoctor = await tx.doctor.findUnique({
            where:{id, isDeleted:false}
        });
        if(!existingDoctor){
            throw new Error("doctor not found");
        }
        //now update speciality if available
        if(payload.specialities){
            //first delete all existing specialities
            await tx.doctorSpeciality.deleteMany({
                where:{
                    doctorId:id
                }
            });
            //then add new specialities
            await tx.doctorSpeciality.createMany({
                data:payload.specialities.map((specialityId)=>({
                    doctorId:id,
                    specialityId
                }))
            });
            
        }

        
         //now update doctor
         // return data of update doctor
        const update_doctor= await tx.doctor.update({
            where:{
                id: id,
                isDeleted:false
            },
            data:{
                ...payload.doctor
            },
            select:{
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
                user: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                            status: true,
                            emailVerified: true,
                            image: true,
                            createdAt: true,
                            updatedAt: true,
                            isDeleted: true,
                            deletedAt: true
                        }
                    },
                    specialities:{
                        select:{
                            speciality:{
                                select:{
                                    title:true,
                                    id:true
                                }
                            }
                        }
                    }


            }

        })
        return update_doctor;
        
      },
      // there is a transaction timeout and max wait time for the transaction
       {
        maxWait: 5000, // 5 seconds to wait for an open DB connection slot (Default is 2s)
        timeout: 10000, // 10 seconds execution limit for the whole block (Default is 5s)
      }

    );

      return result;
    
   } 
   catch (error) {
    console.log("update transaction error",error);
     throw error;
    
   }

}

// soft delete doctor

const deleteDoctor = async(id:string)=>{
    //mark as deleted 
    // keep the doctors corresponding data
    //is doctor exist
    const existingDoctor = await prisma.doctor.findUnique({
        where:{
            id:id
        }
    })
    if(!existingDoctor){
        throw new Error("Doctor not found");
    }
    //is doctor already deleted
    if(existingDoctor.isDeleted){
        throw new Error("Doctor already deleted");
    }
   try{
    const result = await prisma.$transaction(async (tx) => {
        //update user for user status and isDeleted
        //update doctor for isDeleted


          await tx.user.update({
            where:{
                id:existingDoctor.userId
            },
            data:{
                isDeleted:true,
                deletedAt:new Date(),
                status: UserStatus.DELETED
            }
        })
        const doctor = await tx.doctor.update(
        {
            where:{
                id:id
            },
            data:{
                isDeleted:true,
                deletedAt:new Date(),
                
            },
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
                   isDeleted: true,
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
        }
       )
       return doctor;
    })
    
    return result;
   }
   catch(error)
   {
    console.log("transaction error :", error );
    throw error;
   }
}


export const doctorService = {
    getAllDoctors,
    getDoctorById,
    updateDoctorById,
    deleteDoctor
}
