import { Role } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { IupdateSuperAdmin } from "./superAdmin.interface"

//get all super admins
const getAllSuperAdmins = async() => {
    // Implementation
     const superAdmins= await prisma.user.findMany({
        where: {
            isDeleted:false,
            role: Role.SUPER_ADMIN
        },
        select: {
            id:true,
            email:true,
            emailVerified:true,
            name:true,
            status:true,
            needPasswordChange:true,
            role:true,
            image:true,
            createdAt:true,
            updatedAt:true
        }
     })
     return superAdmins
}

//get super admin by id
const getSuperAdminById = async(id: string) => {
    // Implementation
    try {
        const result = await prisma.$transaction( async(tx)=>{
            const superAdminExist = await tx.user.findUnique({
                where:{
                    id,
                    isDeleted:false,
                    role:Role.SUPER_ADMIN
                },
                select:{
                    id:true,
                    email:true,
                    emailVerified:true,
                    name:true,
                    status:true,
                    needPasswordChange:true,
                    role:true,
                    image:true,
                    createdAt:true,
                    updatedAt:true
                }
            })
            if(!superAdminExist){
                throw new Error("Super admin not found")
            }
            return superAdminExist
        })

        return result
        
    } catch (error) {
        console.log("Error while getting super admin by id:", error)
        throw error
    }
    
}

//update SuperAdmin
const updateSuperAdmin = async(id: string, payload: IupdateSuperAdmin) => {
    // Implementation
    try {
        const result = await prisma.$transaction( async(tx)=>{
            const superAdminExist = await tx.user.findUnique({
                where:{
                    id,
                    isDeleted:false,
                    role:Role.SUPER_ADMIN
                }
            })
            if(!superAdminExist){
                throw new Error("Super admin not found")
            }
            const updatedSuperAdmin = await tx.user.update({
                where:{
                    id
                },
                data:{
                    ...payload
                },
                select:{
                    id:true,
                    email:true,
                    emailVerified:true,
                    name:true,
                    status:true,
                    needPasswordChange:true,
                    role:true,
                    image:true,
                    updatedAt:true
                }
            })
            return updatedSuperAdmin
        })

        return result
        
    } catch (error) {
        console.log("Error while updating super admin:", error)
        throw error
    }
}

//soft delete

const deleteSuperAdmin = async(id: string) => {
    // Implementation
    try {
        // start transaction
        //transaction in prisma means multiple queries will be executed in a single transaction
        //if one failed all will be rolled back
        const result = await prisma.$transaction( async(tx)=>{
            // check if super admin exists
            const superAdminExist = await tx.user.findUnique({
                where:{
                    id,
                    isDeleted:false,
                    role:Role.SUPER_ADMIN
                }
            })
            if(!superAdminExist){
                throw new Error("Super admin not found")
            }
            const deletedSuperAdmin = await tx.user.update({
                where:{
                    id
                },
                data:{
                    isDeleted:true
                },
                select:{
                    id:true,
                    email:true,
                    emailVerified:true,
                    name:true,
                    status:true,
                    needPasswordChange:true,
                    role:true,
                    image:true,
                    updatedAt:true
                }
            })
            return deletedSuperAdmin
        })

        return result
        
    } catch (error) {
        console.log("Error while deleting super admin:", error)
        throw error
    }
}

export const superAdminService = {
    getAllSuperAdmins,
    getSuperAdminById,
    updateSuperAdmin,
    deleteSuperAdmin
}