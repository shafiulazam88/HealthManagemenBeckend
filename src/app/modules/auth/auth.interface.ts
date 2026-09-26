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

export interface ISession {
   
        session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined;
            userAgent?: string | null | undefined;
        };
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined;
            role: string;
            status: string;
            needPasswordChange: boolean;
            isDeleted: boolean;
            deletedAt?: Date | null | undefined;
            
        };

}