
import  z from "zod";
import { Gender, UserStatus } from "../../../generated/prisma/enums";

//zod validation of super admin update

export const updateSuperAdminZodvalidation = z.object({
    body: z.object({

    name: z.string().min(3,"Name must be at least 3 characters long").max(50,"Name must be at most 50 characters long").optional(),
    email: z.email("Invalid email format").optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED]).optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE]).optional(),
    image: z.string().optional()
    })
})