// model Doctor {
//     id String @id @default(uuid())
//     name String
//     email String @unique
//     profilePhoto String?
//     contactNumber String?
//     address String?
//     isDeleted Boolean @default(false)
//     deletedAt DateTime?

import { Gender } from "../../../generated/prisma/enums";

    
//     registrationNumber String? @unique
//     experience Int @default(0)
//     gender Gender 
//     appointmentFee Float
//     qualification String
//     currentWorkingPlace String
//     designation String
//     averageRating Float @default(0.0)

//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt

//     // Relations
//     userId String @unique
//     user User @relation(fields: [userId], references: [id])

//     // Indexes
//     @@index([email] , name: "idx_doctor_userId")
//     @@index([registrationNumber] , name: "idx_doctor_registrationNumber")
//     @@index([isDeleted] , name: "idx_doctor_isDeleted")


//     @@map("doctor")

    
//     specialities DoctorSpeciality[]
// }




export interface UpdateDoctor {
    doctor: {
     name?: string;
    email?: string;
    
    experience?: number;
    
    isAvailable?: boolean;
    
    gender?: Gender;
    appointmentFee?: number;
    qualification?: string;
    currentWorkingPlace?: string;
    designation?: string;
    
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    registrationNumber?: string;
   };
   specialities?: string[];
}
