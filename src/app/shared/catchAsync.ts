import { RequestHandler, Request , Response , NextFunction } from "express";
const catchAsync =  (fn:RequestHandler )=>
 {
    return async(req:Request , res:Response ,next : NextFunction)=>{
        try{
            await fn(req,res, next);
        }
        catch(error : any){
        console.log(error)
        res.status(500).json({
            success:false,
            message:'failed to fetch',
            error: error instanceof Error ? error.message : 'unknown error'
        })
      }

    }
 }
export default catchAsync;