import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { tokenUtils } from "../../utils/token";


const registerPatient= catchAsync(async (req:Request, res:Response) => {
    const payload = req.body;
    
    const result = await AuthService.registerPatient(payload);
    const{accessToken , refreshToken , token , ...rest}=result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token as string) ;
    res.status(201).json({
        success: true,
        message: "Patient registered successfully",
        data:  {
            accessToken,
            refreshToken,
            token,
            ...rest
        }
    });

    
})

const loginUser = catchAsync(async (req:Request, res:Response) => {
    const payload = req.body;
    
    const result = await AuthService.loginUser(payload);
    const{accessToken , refreshToken , token , ...rest}=result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);

    res.status(201).json({
        success: true,
        message: "User logged in successfully",
        data: {
            accessToken,
            refreshToken,
            token,
            ...rest
        }
    });

    
})

export const AuthController = {
    registerPatient,
    loginUser
}
