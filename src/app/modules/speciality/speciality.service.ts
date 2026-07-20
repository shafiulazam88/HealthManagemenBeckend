import { Specialty } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpeciality = async(payload: Specialty):Promise<Specialty> =>{
    const speciality  = await prisma.specialty.create(
        {
            data:payload
        }
    )
    return speciality;
}
//many specialities thats why spciality array
const getAllSpecialities = async():Promise<Specialty[]>=>{
    const specialities= await prisma.specialty.findMany();
    return specialities;

}
const DeleteSpeciality=async(id:string):Promise<Specialty>=>{
    const speciality = await prisma.specialty.delete(
        {
            where:{id}
        }
    )
    return speciality;

}
const UpdateSpeciality = async(id:string , payload:Specialty):Promise<Specialty>=>{
    const updateSpeciality = await prisma.specialty.update(
        {
            where:{id},
            data:payload,
        }
    );
    return updateSpeciality;

}
export const SpecialityService={
    createSpeciality,
    getAllSpecialities,
    DeleteSpeciality,
    UpdateSpeciality,
}