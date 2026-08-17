import { Gender } from "../../../generated/prisma/enums";

export interface IDoctor {
   password: string;
   doctor :{
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
   
    registrationNumber: string;
    experience?: number;
    gender: Gender;
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    
   }
   specialities: string[];
}

export interface IAdmin {
    
   name: string;
   email: string;
   password: string;
   profilePhoto?: string;
   contactNumber?: string;
   address?: string;
}
export interface ISuperAdmin {
    
   name: string;
   email: string;
   password: string;
   profilePhoto?: string;
   contactNumber?: string;
   address?: string;
}