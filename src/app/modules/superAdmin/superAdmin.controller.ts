import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { superAdminService } from "./superAdmin.service";
import status from "http-status";

const getAllSuperAdmins= catchAsync(async (req:Request, res:Response) => {
    const result = await superAdminService.getAllSuperAdmins();
    
    res.status(status.OK).json({
        success: true,
        message: "All super admins retrieved successfully",
        data: result
    });
})  

const getSuperAdminById = catchAsync(async (req:Request, res:Response) => {
    const id = req.params.id as string;
    const result = await superAdminService.getSuperAdminById(id);
    if(!result){
        res.status(status.NOT_FOUND).json({
            success: false,
            message: "Super admin not found",
            data: null
        });
        return;
    }
    res.status(status.OK).json({
        success: true,
        message: "Super admin retrieved successfully",
        data: result
    });
})  


const updateSuperAdmin = catchAsync(async (req:Request, res:Response) => {
    const id = req.params.id as string;
    const payload = req.body;
    const result = await superAdminService.updateSuperAdmin(id, payload);
    if(!result){
        res.status(status.NOT_FOUND).json({
            success: false,
            message: "Super admin not found",
            data: null
        });
        return;
    }
    res.status(status.OK).json({
        success: true,
        message: "Super admin updated successfully",
        data: result
    });
})

const deleteSuperAdmin = catchAsync(async (req:Request, res:Response) => {
    const id = req.params.id as string;
    const result = await superAdminService.deleteSuperAdmin(id);
    if(!result){
        res.status(status.NOT_FOUND).json({
            success: false,
            message: "Super admin not found",
            data: null
        });
        return;
    }
    res.status(status.OK).json({
        success: true,
        message: "Super admin deleted successfully",
        data: result
    });
})
export const superAdminController = {
    getAllSuperAdmins,
    getSuperAdminById,
    updateSuperAdmin,
    deleteSuperAdmin
}