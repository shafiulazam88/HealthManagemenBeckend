
import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "./user.controller";
import z from "zod";
import { Gender } from "../../../generated/prisma/enums";
import validateRequest from "../../middleware/validateRequest";
import createDoctorZodSchema from "./user.validation";

// export interface IDoctor {
//    password: string;
//    doctor :{
//     name: string;
//     email: string;
//     profilePhoto?: string;
//     contactNumber?: string;
//     address?: string;
   
//     registrationNumber: string;
//     experience?: number;
//     gender: Gender;
//     appointmentFee: number;
//     qualification: string;
//     currentWorkingPlace: string;
//     designation: string;
    
//    }
//    specialities: string[];
// }



const router = Router();



router.post("/create-doctor", validateRequest(createDoctorZodSchema),
   
    
        UserController.createDoctor
);


export const UserRoute= router;