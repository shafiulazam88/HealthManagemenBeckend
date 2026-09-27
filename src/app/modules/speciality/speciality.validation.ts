import { z } from "zod";

const createSpecialityZodSchema = z.object({
    title: z.string("title is required").min(1, "title is required"),
    description: z.string("description is required").optional(),
});

 export const SpecialityValidation = {
    createSpecialityZodSchema
 };