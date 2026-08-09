import { NextFunction, Request, Response } from "express";
import { envVariable } from "../../config/env";
import { start } from "node:repl";
import status from "http-status";
import z from "zod";

interface IErrorSource {
    path: string;
    message: string;
}

export const globalErrorHandler = ( err:any ,_req:Request , res:Response , _next:NextFunction)=>{
    if(envVariable.NODE_ENV === "development"){
        console.log("Error from global error handler",err);
    }
     
    let statusCode:number = status.INTERNAL_SERVER_ERROR;

    let message: string = "Internal server error";

    //error of zod validation
    const errorSource : IErrorSource[] = []
    if(err instanceof z.ZodError){
        statusCode = status.BAD_REQUEST;
        message = "Validation error";
        const sourceError= err.issues.map((issue) => ({
            path: issue.path.join(".") || "Unknown",
            message: issue.message
        }));
        errorSource.push(...sourceError);

    }

    res.status(statusCode).json({
        success: false,
        message: message,
        errorSources: errorSource,
        error: err.message,
        
    });
   
}