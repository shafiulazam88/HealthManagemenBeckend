import { Gender, UserStatus } from "../../../generated/prisma/enums";

export interface updateAdmin {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    status?: UserStatus;
    gender?: Gender;
    image?: string;
}