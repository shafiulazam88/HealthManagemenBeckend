import catchAsync from "../../shared/catchAsync";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { tokenUtils } from "../../utils/token";
import status from "http-status";
import { envVariable } from "../../../config/env";
import { auth } from "../../lib/auth";

const registerPatient= catchAsync(async (req:Request, res:Response) => {
    const payload = req.body;
    
    const result = await AuthService.registerPatient(payload);
    const{accessToken , refreshToken , token , ...rest}=result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token as string) ;
    res.status(status.CREATED).json({
        success: true,
        message: "Patient registered successfully",
        data:  {
            accessToken,
            refreshToken,
            token,
            ...rest
        }
    });

    
})

const loginUser = catchAsync(async (req:Request, res:Response) => {
    const payload = req.body;
    
    const result = await AuthService.loginUser(payload);
    const{accessToken , refreshToken , token , ...rest}=result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);

    res.status(status.OK).json({
        success: true,
        message: "User logged in successfully",
        data: {
            accessToken,
            refreshToken,
            token,
            ...rest
        }
    });

    
})

const getMe = catchAsync(async (req:Request, res:Response) => {
    const user = req.user;
    
    const result = await AuthService.getMe(user);
    res.status(status.OK).json({
        success: true,
        message: "User retrieved successfully",
        data: result
    });
})

const getNewToken = catchAsync(async (req:Request, res:Response) => {
    const refreshToken = req.cookies.refreshToken;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    if(!refreshToken){
        throw new Error(status.UNAUTHORIZED.toString(), { cause: "Unauthorized" });
    }
    
    const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken);
    const{accessToken: newAccessToken , refreshToken : newRefreshToken , sessionToken : token , ...rest}=result;

    tokenUtils.setAccessTokenCookie(res, newAccessToken);
    tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    
    res.status(status.OK).json({
        success: true,
        message: "New token generated successfully",
        data: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            token,
            ...rest
        }
    });
})

const changePassword = catchAsync(async (req:Request, res:Response) => {
    const payload = req.body;
    
    const betterAuthSession = req.cookies["better-auth.session_token"];
    if(!betterAuthSession){
        throw new Error(status.UNAUTHORIZED.toString(), { cause: "Unauthorized" });
    }
    const result = await AuthService.changePassword(payload, betterAuthSession);
    const{accessToken, refreshToken, token}= result;
    tokenUtils.setAccessTokenCookie(res,accessToken)
    tokenUtils.setRefreshTokenCookie(res, refreshToken)
    tokenUtils.setBetterAuthSessionCookie(res, token as string)
    res.status(status.OK).json({
        success: true,
        message: "Password changed successfully",
        data: result
    });
});

// const verifyEmail = catchAsync(
//     async(req:Request , res:Response)=>{
//         const{email, otp } = req.body;
//         await AuthService.verifyEmail(email, otp);
//         res.status(status.OK).json({
//             success: true,
//             message: "Email verified successfully"
//         });

//     }
// )



const verifyEmail= catchAsync(async (req:Request, res:Response) => {
    const{email, otp } = req.body;
    await AuthService.verifyEmail(email, otp);
    res.status(status.OK).json({
        success: true,
        message: "Email verified successfully"
    });
});

const forgetPassword = catchAsync(async (req:Request, res:Response) => {
    const{email} = req.body;
    await AuthService.forgetPassword(email);
    res.status(status.OK).json({
        success: true,
        message: "Password reset email sent successfully"
    });
});

const resetPassword = catchAsync(async (req:Request, res:Response) => {
    const{email, otp, newPassword} = req.body;
    await AuthService.resetPassword(email, otp, newPassword);
    res.status(status.OK).json({
        success: true,
        message: "Password reset successfully"
    });
});

//api/v1/auth/login/google?redirect=/profile
const loginWithGoogle = catchAsync(async (req:Request, res:Response) => {
    const redirectPath = req.query.redirect||"/dashboard";
    const encodedRedirectPath = encodeURIComponent(redirectPath as string)

    // Store redirect path in a cookie for later retrieval
    

    const callbackUrl =`${envVariable.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;

    res.render("googleRedirect",{
        callbackUrl:callbackUrl,
        betterAuthUrl: envVariable.BETTER_AUTH_URL
        
    })

});

const googleLoginSuccess = catchAsync(async (req:Request, res:Response) => {
    

    // Read redirect path from cookie, fallback to query param, then default
    const redirectPath =  req.query.redirect as string || "/dashboard";
    

    const sessionToken= req.cookies["better-auth.session_token"];
    

    if(!sessionToken){
       
        return res.redirect(`${envVariable.FRONTEND_URL}/login?error=oauth_failed`)
    }

    
    const session = await auth.api.getSession({
        headers:{
            "Cookie":`better-auth.session_token=${sessionToken}`
        }
    })

  

    if(!session || !session.user){
        console.log("No user in session, redirecting to login with error");
        return res.redirect(`${envVariable.FRONTEND_URL}/login?error=no_user_found`)
    }

   
    const result  = await AuthService.googleLoginSuccess(session);

    const{accessToken , refreshToken} = result;
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setAccessTokenCookie(res, accessToken);

  

    //check redirect path valid or not
    const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//")

    const finalRedirectPath = isValidRedirectPath? redirectPath:"/dashboard"

   
    res.redirect(`${envVariable.FRONTEND_URL}${finalRedirectPath}`)
});


const handleOAuthError = catchAsync(async (req:Request, res:Response) => {
    const error = req.query.error as string || "oauth_failed";
    const errorDescription = req.query.error_description as string || "";
    console.error("OAuth Error:", error, errorDescription);
    res.redirect(`${envVariable.FRONTEND_URL}/login?error=${error}&description=${encodeURIComponent(errorDescription)}`)
});




export const AuthController = {
    registerPatient,
    loginUser,
    getMe,
    getNewToken,
    changePassword,
    verifyEmail,
    forgetPassword,
    resetPassword,
    loginWithGoogle,
    googleLoginSuccess,
    handleOAuthError,
}
