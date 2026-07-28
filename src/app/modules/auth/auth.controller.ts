import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";


const registerPatient= catchAsync(async (req:Request, res:Response) => {
    const payload = req.body;
    
    const result = await AuthService.registerPatient(payload);
    res.status(201).json({
        success: true,
        message: "Patient registered successfully",
        data: result
    });

    
})

const loginUser = catchAsync(async (req:Request, res:Response) => {
    const payload = req.body;
    
    const result = await AuthService.loginUser(payload);
    res.status(201).json({
        success: true,
        message: "User logged in successfully",
        data: result
    });

    
})

export const AuthController = {
    registerPatient,
    loginUser
}
