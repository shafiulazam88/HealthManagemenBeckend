import { Gender, UserStatus } from "../../../generated/prisma/enums";

export interface IupdateSuperAdmin {
    name?: string;
    email?: string;
    contactNumber?: string;
    address?: string;
    status?: UserStatus;
    gender?: Gender;
    profilePhoto?: string;
}