import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

// export interface UpdateDoctor {
//     doctor: {
//      name?: string;
//     email?: string;
    
//     experience?: number;
    
//     isAvailable?: boolean;
    
//     gender?: Gender;
//     appointmentFee?: number;
//     qualification?: string;
//     currentWorkingPlace?: string;
//     designation?: string;
    
//     profilePhoto?: string;
//     contactNumber?: string;
//     address?: string;
//     registrationNumber?: string;
//    };
//    specialities?: string[];
// }

//todo 
export const doctorUpdateValidation = z.object({
    doctor: z.object({
        name: z.string().min(3, "name must be at least 3 characters").optional(),
        email: z.email("Invalid email").optional(),
        gender: z.enum([Gender.MALE, Gender.FEMALE], { error: 'Invalid gender' }).optional(),
        contactNumber: z.string().optional(),
        
        experience: z.number().nonnegative("Experience must be non-negative").optional(),
        qualification: z.string().optional(),
        appointmentFee: z.number().nonnegative("Appointment fee must be non-negative").optional(),
        address: z.string().min(3, "Address must be at least 3 characters").max(100, "Address must be at most 100 characters").optional(),
        profilePhoto: z.string().optional(),
        registrationNumber: z.string().optional(),
        currentWorkingPlace: z.string().optional(),
        designation: z.string().optional(),
        isAvailable: z.boolean().optional(),

        }),
    specialities: z.array(z.uuid()).optional(),
})

export default doctorUpdateValidation;