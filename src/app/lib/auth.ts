import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";
import { envVariable } from "../../config/env";
 
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
    baseURL:envVariable.BETTER_AUTH_URL,
    secret:envVariable.BETTER_AUTH_SECRET,
    trustedOrigins: [envVariable.FRONTEND_URL],
    
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword:{
        enabled:true,
        requireEmailVerification:true,
    },
    socialProviders:{
        google:{
            enabled:true,
            clientId:envVariable.GOOGLE_CLIENT_ID,
            clientSecret:envVariable.GOOGLE_CLIENT_SECRET,
            // redirectURI:`${envVariable.BETTER_AUTH_URL}/api/v1/auth/callback/google`,
            //additional filed to profile
            mapProfileToUser:()=> {
                return {
                // name: profile.name,
                // email: profile.email,
                // profilePhoto: profile.picture,
                // emailVerified: profile.email_verified || true, //

                // Your custom Prisma schema fields:
                role: Role.PATIENT,
                status: UserStatus.ACTIVE,
                needPasswordChange: false,
                emailVerified:true,
                isDeleted: false,
                deletedAt: null
                }

            },
        }
    },
    emailVerification:{
        sendOnSignUp:true,  
        sendOnSignIn:true,
        autoSignInAfterVerification:true

    },
    user:{
       
        additionalFields:{
            role:{
                type: "string",
                required:true,
                defaultValue:Role.PATIENT

            },
            status:{
                type: "string",
                required:true,
                defaultValue: UserStatus.ACTIVE
            },
            needPasswordChange:{
                type:"boolean",
                required:true,
                defaultValue:false
            },
            isDeleted:{
                type:"boolean",
                required:true,
                defaultValue:false
            },
            deletedAt:{
                type:"date",
                required:false,
                defaultValue:null
            }



        }
    },
    plugins:[
        bearer(),
        emailOTP(
            {
                overrideDefaultEmailVerification:true,
                async sendVerificationOTP({
                 email, otp, type
                }){
                    if(type=="email-verification"){
                        const user = await prisma.user.findUnique({
                            where:{
                                email
                            }
                        })

                        if(user && !user.emailVerified){
                            // Send email verification
                            await sendEmail({
                                to: email,
                                subject: "Verify your email" ,
                                templateName: "OTP",
                                templateData: {
                                    name: user.name,
                                     otp ,
                                 }
                            });
                        }
                    }
                    else if(type=="forget-password"){
                        const user = await prisma.user.findUnique({
                            where:{
                                email
                            }
                        })
                        if(user){
                            sendEmail({
                            to: email,
                            subject: "Reset your password" ,
                            templateName: "OTP",
                            templateData: {
                                name: user.name,
                                otp ,
                            }
                          })
                        }
                        
                    }
                },
                expiresIn: 2 * 60, // 2 minutes in seconds
                otpLength: 6,
            }
        )
        
    ],
    session:{
        expiresIn:60*60*24,
        updateAge:60*60*24,
        cookieCache:{
            enabled:true,
            maxAge: 60*60*24
        }
    },
    // trustedOrigins:[process.env.BETTER_AUTH_URL || "http://localhost:5000"],
    // advanced:{
    //     // defaultCookieAttributes:{
    //     //     sameSite:"none",
    //     //     secure:true,
    //     //     httpOnly:true,
    //     // }
    //     disableCSRFCheck: true,

    // },
    advanced:{
        useSecureCookies:false,
        cookies:{
            state:{
                attributes:{
                    sameSite:"none",
                    secure:true,
                    httpOnly:true,
                    path:"/",
                }
            },
            session:{
                attributes:{
                    sameSite:"none",
                    secure:true,
                    httpOnly:true,
                    path:"/",
                }
            }
        }
    }
});
