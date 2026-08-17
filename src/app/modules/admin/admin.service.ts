import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

import { updateAdmin } from "./admin.interface";
import { role } from "better-auth/plugins";
import { Role } from "../../../generated/prisma/enums";

//get all admins
const getAllAdmins = async() => {
    try{
    
    const admins = await prisma.user.findMany({
        where:{
            isDeleted:false,
            role:"ADMIN"
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
    return admins;
    
    }
    catch(error){
        console.log("Error while fetching admins:", error);
        throw error;
    }
}

// get admin by id
const getAdminById = async(id:string) => {
    try{
    const result = prisma.$transaction(async (tx) => {
    const admin = await tx.user.findUnique({
        where:{
            id,
            isDeleted:false,
            role:Role.ADMIN
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
    return admin;
    })
    return result;
    
    }
    catch(error){
        console.log("Error while fetching admin:", error);
        throw error;
    }
}

// update admin
const updateAdmin = async(id:string, payload:updateAdmin) => {
    try{
    
    const result = prisma.$transaction(async (tx) => {
     const adminExist= await tx.user.findUnique({
        where:{
            id,
            isDeleted:false,
            role:Role.ADMIN
        }
     })
     if(!adminExist){
        throw new Error("Admin not found");
     }
    const admin = await tx.user.update({
        where:{
            id,
            isDeleted:false,
            role:Role.ADMIN
        },
        data:{
            ...payload
        },
        select:{
             id: true,
             name: true,
             email: true,
             role: true,
             status: true,
             image: true,
             gender:true,
             phone:true,
             address:true,
             updatedAt: true
        }

    })
    return admin;
    
    })
    return result;
    }
    catch(error){
        console.log("Error while updating admin:", error);
        throw error;
    }
}


//soft delete admin
const DeleteAdmin = async(id:string) => {
    try{
    
    const result = prisma.$transaction(async (tx) => {
        //check id exist or not
        const adminExist = await tx.user.findUnique({
            where:{
                id,
                isDeleted:false,
                role:Role.ADMIN
            }
        })

        if(!adminExist){
            throw new Error("Admin not found");
        }
    const admin = await tx.user.update({
        where:{
            id,
            isDeleted:false,
            role:Role.ADMIN
        },
        data:{
            isDeleted:true
        }
    })
    return admin;
    })
    return result;

    }
    catch(error){
        console.log("Error while deleting admin:", error);
        throw error;
    }
}


export const AdminService = {
    getAllAdmins,
    getAdminById,
    updateAdmin,
    DeleteAdmin
}