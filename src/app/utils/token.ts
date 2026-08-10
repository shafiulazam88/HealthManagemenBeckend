import {  JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envVariable } from "../../config/env";
import { cookieUtils } from "./cookies";
import { Response } from "express";

//creating access token
const getAccessToken=(payload: JwtPayload)=>{
    const accessToken = jwtUtils.createToken(payload, envVariable.ACCESS_TOKEN_SECRET, {expiresIn: envVariable.ACCESS_TOKEN_EXPIRES_IN} as SignOptions)
    return accessToken;


}

const getRefreshToken=(payload: JwtPayload)=>{
    const refreshToken = jwtUtils.createToken(payload, envVariable.REFRESH_TOKEN_SECRET, {expiresIn: envVariable.REFRESH_TOKEN_EXPIRES_IN} as SignOptions)
    return refreshToken;
}



const setAccessTokenCookie = (res: Response, token: string) => {
    
    cookieUtils.setCookie(
        res , 'accessToken' , token ,{
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path:'/',
            maxAge: 86400000 // 1 day

        }
    )
}

const setRefreshTokenCookie = (res: Response, token: string) => {
    
    cookieUtils.setCookie(
        res , 'refreshToken' , token ,{
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path:'/',
            maxAge: 604800000 // 7 days
        }
    )
}

const setBetterAuthSessionCookie = (res: Response, token: string) => {
   
    cookieUtils.setCookie(
        res , 'better-auth.session_token' , token ,{
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path:'/',
            maxAge: 86400000 // 1 day

        }
    )
}

export const tokenUtils = {
    getAccessToken,
    getRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie  ,
    setBetterAuthSessionCookie
}
