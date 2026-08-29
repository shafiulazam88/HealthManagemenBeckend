import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { tokenUtils } from "../../utils/token";
import status from "http-status";


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

const getMe = catchAsync(async (req:Request, res:Response) => {
    const user = req.user;
    
    const result = await AuthService.getMe(user);
    res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: result
    });
})

const getNewToken = catchAsync(async (req:Request, res:Response) => {
    const refreshToken = req.cookies.refreshToken;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    if(!refreshToken){
        throw new Error(status.UNAUTHORIZED.toString(), { cause: "Unauthorized" });
    }
    
    const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken);
    const{accessToken: newAccessToken , refreshToken : newRefreshToken , sessionToken : token , ...rest}=result;

    tokenUtils.setAccessTokenCookie(res, newAccessToken);
    tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    
    res.status(200).json({
        success: true,
        message: "New token generated successfully",
        data: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            token,
            ...rest
        }
    });
})

export const AuthController = {
    registerPatient,
    loginUser,
    getMe,
    getNewToken
}
