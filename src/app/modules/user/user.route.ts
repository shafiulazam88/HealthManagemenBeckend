
import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "./user.controller";

import validateRequest from "../../middleware/validateRequest";
import createDoctorZodSchema, { createAdminZodSchema } from "./user.validation";
import { checkAuth } from "../../middleware/checkAutth";
import { Role } from "../../../generated/prisma/enums";

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



router.post("/create-doctor", checkAuth(Role.SUPER_ADMIN, Role.ADMIN),validateRequest(createDoctorZodSchema),
   
    
        UserController.createDoctor
);
router.post("/create-admin",checkAuth(Role.SUPER_ADMIN), validateRequest(createAdminZodSchema),
   
    
        UserController.createAdmin
);

router.post("/create-super-admin",checkAuth(Role.SUPER_ADMIN),
validateRequest(createAdminZodSchema),
UserController.createSuperAdmin)


export const UserRoute= router;