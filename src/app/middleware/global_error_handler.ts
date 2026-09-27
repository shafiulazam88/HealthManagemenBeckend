import { NextFunction, Request, Response } from "express";
import { envVariable } from "../../config/env";
import { start } from "node:repl";
import status from "http-status";
import z from "zod";
import { deleteFromCloudinary } from "../../config/cloudinary.config";

interface IErrorSource {
    path: string;
    message: string;
}

export const globalErrorHandler = async (err: any, req: Request, res: Response, _next: NextFunction) => {
    if(envVariable.NODE_ENV === "development"){
        console.log("Error from global error handler",err);
    }
     //todo  delete the file from cloudinary if it is uploaded and error occurs
     //delete multiple files from cloudinary if multiple files are uploaded
     //todo AppError class to handle errors and send proper response to client

     if(req.file){
         await deleteFromCloudinary(req.file.path);
     }
     if(req.files && Array.isArray(req.files) && req.files.length > 0){
        for(const file of req.files){
            await deleteFromCloudinary(file.path);
        }
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