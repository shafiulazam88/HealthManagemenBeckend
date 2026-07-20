import { Request, Response } from "express";
import { SpecialityService } from "./speciality.service";

const createSpeciality = async(req: Request,res:Response  )=>{
    try{
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
    catch(error : any){
        console.log(error)
        res.status(500).json({
            success:false,
            message:'failed to create speciality',
            error: error instanceof Error ? error.message : 'unknown error'
        })
    }
}
const GetAllSpeciality=async(req:Request , res:Response)=>{
    try{
        const specialities = await SpecialityService.getAllSpecialities();
            res.status(201).json(
          {
            success:true,
            message: "specialities",
            data:specialities
          }
    );


    }
    catch(error : any){
        console.log(error)
        res.status(500).json({
            success:false,
            message:'failed to get specialities',
            error: error instanceof Error ? error.message : 'unknown error'
        })
    }

}

const DeleteSpeciality = async(req:Request , res:Response)=>{
     try{
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
    catch(error : any){
        console.log(error)
        res.status(500).json({
            success:false,
            message:'failed to delete speciality',
            error: error instanceof Error ? error.message : 'unknown error'
        })
    }

}
const UpdateSpeciality= async(req:Request , res:Response)=>{
    try{
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
    catch(error : any){
        console.log(error)
        res.status(500).json({
            success:false,
            message:'failed to update speciality',
            error: error instanceof Error ? error.message : 'unknown error'
        })
    }

}

export const SpecialityController={
    createSpeciality,
    GetAllSpeciality,
    DeleteSpeciality,
    UpdateSpeciality,
}