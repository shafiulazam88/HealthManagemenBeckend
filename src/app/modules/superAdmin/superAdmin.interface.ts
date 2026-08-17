import { Gender, UserStatus } from "../../../generated/prisma/enums";

export interface IupdateSuperAdmin {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    status?: UserStatus;
    gender?: Gender;
    image?: string;
}