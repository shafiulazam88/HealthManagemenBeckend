import z from "zod";
import { Gender, UserStatus } from "../../../generated/prisma/enums";

//  name?: string;
//     email?: string;
//     phone?: string;
//     address?: string;
//     status?: UserStatus;
//     gender?: Gender;
//     image?: string;

export const updateAdminZodvalidation = z.object({
    body: z.object({
        name: z.string().min(3, "Name must be at least 3 characters long").max(50, "Name must be at most 50 characters long").optional(),
        email: z.email("Invalid email format").optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        status: z.enum([UserStatus.ACTIVE, UserStatus.DELETED , UserStatus.BLOCKED]).optional(),
        image: z.string().optional(),
        gender: z.enum([Gender.MALE, Gender.FEMALE]).optional(),
    })
});

