import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

const createDoctorZodSchema = z.object(
    {
        password: z.string("Password is required").min(6,"Password must be at least 6 characters"),
        doctor: z.object({
            name: z.string("Name is required").min(5,"Name must be at least 5 characters").max(50,"Name must be at most 50 characters"),
            email: z.email("Invalid email format"), 
            contactNumber: z.string("Contact number is required").min(11,"Contact number must be at least 11 characters").max(14,"Contact number must be at most 14 characters").optional(),
            profilePhoto: z.string("Profile photo is required").optional(),
            address : z.string("Address is required").min(2,"Address must be at least 5 characters").max(100,"Address must be at most 100 characters").optional(),
            registrationNumber: z.string("Registration number is required"),
            experience: z.number("Experience is required").optional(),
            gender: z.enum([Gender.MALE, Gender.FEMALE], "Gender is required"),
            appointmentFee: z.number("Appointment fee is required").nonnegative("Appointment fee must be a positive number"),
            qualification: z.string("Qualification is required").min(2,"Qualification must be at least 2 characters").max(100,"Qualification must be at most 100 characters"),
            currentWorkingPlace: z.string("Current working place is required").min(2,"Current working place must be at least 5 characters").max(100,"Current working place must be at most 100 characters"),
            designation: z.string("Designation is required").min(2,"Designation must be at least 5 characters").max(50,"Designation must be at most 50 characters"),

        }),
        specialities: z.array(z.uuid("Speciality is required")).min(1,"At least one speciality is required"),
       


    }
)
export default createDoctorZodSchema;