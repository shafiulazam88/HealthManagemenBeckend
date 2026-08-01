
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const validateRequest =(zodObject: z.ZodObject)=>{
    return(req:Request , res:Response , next:NextFunction)=>{
        const pasrsedResult = zodObject.safeParse(req.body);
        if(!pasrsedResult.success){
            next(pasrsedResult.error);
        }
        // sanitize the request body
        req.body = pasrsedResult.data;
        next();
    }
}

export default validateRequest;
