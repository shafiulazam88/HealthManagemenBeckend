import {  JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envVariable } from "../../config/env";

const getAccessToken=(payload: JwtPayload)=>{
    const accessToken = jwtUtils.createToken(payload, envVariable.ACCESS_TOKEN_SECRET, {expiresIn: envVariable.ACCESS_TOKEN_EXPIRES_IN} as SignOptions)
    return accessToken;


}
const getRefreshToken=(payload: JwtPayload)=>{
    const refreshToken = jwtUtils.createToken(payload, envVariable.REFRESH_TOKEN_SECRET, {expiresIn: envVariable.REFRESH_TOKEN_EXPIRES_IN} as SignOptions)
    return refreshToken;
}


export const tokenUtils = {
    getAccessToken,
    getRefreshToken
}
