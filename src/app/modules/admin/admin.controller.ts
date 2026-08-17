import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import  { AdminService } from "./admin.service";
import status from "http-status";

const getAllAdmins = catchAsync(async(req:Request , res:Response)=>{
    const result = await AdminService.getAllAdmins();

    res.status(status.OK).json({
        success:true,
        message:"All admins retrieved successfully",
        data:result
    });

})

const getAdminById = catchAsync(async(req:Request , res:Response)=>{
    const id = req.params.id as string;
    const result = await AdminService.getAdminById(id);
    if(!result){
        res.status(status.NOT_FOUND).json({
            success:false,
            message:"Admin not found",
            data:null
        });
        return;
    }
    res.status(status.OK).json({
        success:true,
        message:"Admin retrieved successfully",
        data:result
    });
})

const updateAdmin = catchAsync(async(req:Request , res:Response)=>{
    const id = req.params.id as string;
    const payload = req.body;
    const result = await AdminService.updateAdmin(id, payload);
    if(!result){
        res.status(status.NOT_FOUND).json({
            success:false,
            message:"Admin not found",
            data:null
        });
        return;
    }
    res.status(status.OK).json({
        success:true,
        message:"Admin updated successfully",
        data:result
    });
})

const deleteAdmin = catchAsync(async(req:Request , res:Response)=>{
    const id = req.params.id as string;
    const result = await AdminService.DeleteAdmin(id);
    if(!result){
        res.status(status.NOT_FOUND).json({
            success:false,
            message:"Admin not found",
            data:null
        });
        return;
    }
    res.status(status.OK).json({
        success:true,
        message:"Admin deleted successfully",
        data:result
    });
})


export default {
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin
}