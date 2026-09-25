export interface RegisterPatientInput {
    name: string;
    email: string;
    password: string;
}
export interface loginUserInput {
    email: string;
    password: string;
}

export interface IChangePassword {
    currentPassword: string;
    newPassword: string;
}