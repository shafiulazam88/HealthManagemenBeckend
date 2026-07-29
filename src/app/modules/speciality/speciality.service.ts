import { Speciality } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpeciality = async(payload: Speciality):Promise<Speciality> =>{
    const speciality  = await prisma.speciality.create(
        {
            data:payload
        }
    )
    return speciality;
}
//many specialities thats why spciality array
const getAllSpecialities = async():Promise<Speciality[]>=>{
    const specialities= await prisma.speciality.findMany();
    return specialities;

}
const DeleteSpeciality=async(id:string):Promise<Speciality>=>{
    const speciality = await prisma.speciality.delete(
        {
            where:{id}
        }
    )
    return speciality;

}
const UpdateSpeciality = async(id:string , payload:Speciality):Promise<Speciality>=>{
    const updateSpeciality = await prisma.speciality.update(
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