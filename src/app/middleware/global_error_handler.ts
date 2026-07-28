import { NextFunction, Request, Response } from "express";
import { envVariable } from "../../config/env";
import { start } from "node:repl";
import status from "http-status";

export const globalErrorHandler = ( err:any ,_req:Request , res:Response , _next:NextFunction)=>{
    if(envVariable.NODE_ENV === "development"){
        console.log("Error from global error handler",err);
    }

    const statusCode:number = status.INTERNAL_SERVER_ERROR;

    const message: string = "Internal server error";
    res.status(statusCode).json({
        success: false,
        message: message,
        error: err.message
    });
   
}