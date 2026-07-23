import {  Request,  Response } from "express";
import { SpecialityService } from "./speciality.service";
import catchAsync from "../../shared/catchAsync";

interface IResponseData<T>{
    httpStatuscode: number;
    success: boolean;
    message:string;
    data?:T;

}
const sendResponse =<T>(res:Response , responseData : IResponseData<T>)=>{
    const {httpStatuscode , success , message , data}= responseData;
    res.status(httpStatuscode).json(
        {
            success,
            message,
            data
        }
    );

}

const createSpeciality = catchAsync(async(req: Request,res:Response  )=>{
   
        const payload = req.body;
        const result = await SpecialityService.createSpeciality(payload);

    res.status(201).json(
        {
            success:true,
            message: "speciality created",
            data:result
        }
      );
   
   
}
)

 
const GetAllSpeciality= catchAsync(async(req:Request , res:Response)=>{
    
        const specialities = await SpecialityService.getAllSpecialities();
            res.status(201).json(
          {
            success:true,
            message: "specialities",
            data:specialities
          }
         );
  }
)

const DeleteSpeciality = catchAsync(async(req:Request , res:Response)=>{
     
        const{id} = req.params;
        const DeleteSpeciality = await SpecialityService.DeleteSpeciality(id as string);
            res.status(201).json(
            {
            success:true,
            message: "deleted",
            data:DeleteSpeciality
            }
           ); 

 }
)
const UpdateSpeciality=catchAsync( async(req:Request , res:Response)=>{
   
        const{id} = req.params;
        const updateData = req.body;
        const UpdateSpeciality = await SpecialityService.UpdateSpeciality(id as string, updateData);
            res.status(201).json(
            {
            success:true,
            message: "updated",
            data:UpdateSpeciality
            }
           ); 
 }
)

export const SpecialityController={
    createSpeciality,
    GetAllSpeciality,
    DeleteSpeciality,
    UpdateSpeciality,
}