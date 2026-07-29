import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { doctorService } from "./doctor.service";

const getAllDoctors = catchAsync(async (req : Request, res: Response) => {
    const result = await  doctorService.getAllDoctors();

    res.status(httpStatus.OK).json({
        success: true,
        message: "Doctor fetched successfully",
        data: result
    });

    
})
const getDoctorById = catchAsync(async (req : Request, res: Response) => {
    const id = req.params.id as string;
    const result = await  doctorService.getDoctorById(id);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Doctor fetched successfully",
        data: result
    });
})
const updateDoctorById = catchAsync(async (req : Request, res: Response) => {
    const id = req.params.id as string;
    const result = await  doctorService.updateDoctorById(id, req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Doctor updated successfully",
        data: result
    });
})

export const doctorController = {
    getAllDoctors,
    getDoctorById,
    updateDoctorById
}
