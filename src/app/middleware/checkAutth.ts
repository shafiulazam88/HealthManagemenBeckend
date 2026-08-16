import { Request, Response, NextFunction } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { cookieUtils } from "../utils/cookies";
import { prisma } from "../lib/prisma";
import status from "http-status";
import { jwtUtils } from "../utils/jwt";
import { envVariable } from "../../config/env";


export const checkAuth = (...authRoles: Role[]) => async (req: Request, res: Response, next: NextFunction) => {
    try{
        // sessiontoken verification
        // get the better auth session and better aut session is in database
        const sessionToken = cookieUtils.getCookie(req, "better-auth.session_token");
        if(!sessionToken){
            return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
        }
        // session exists or not in data base
        //for better auth token
        if(sessionToken){
            const sessionExists = await prisma.session.findFirst({
                where:{
                    token: sessionToken,
                    expiresAt: {
                        gt: new Date()
                    }
                },
                include: {
                    user: true
                }
            })
            if(!sessionExists){
                //todo app error
                return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized" });
            }
            // for better auth session
            if(sessionExists && sessionExists.user){
                const user = sessionExists.user;
                const now = new Date();
                const expireAt = new Date(sessionExists.expiresAt);
                const createdAt = new Date(sessionExists.createdAt);
                // Calculate session lifetime in milliseconds
                const sessionLifetime = expireAt.getTime() - createdAt.getTime();
                // Calculate time remaining in milliseconds
                const timeRemaining = expireAt.getTime() - now.getTime();
                // Calculate percentage session remaining
                const parcentRemaining = (timeRemaining / sessionLifetime) * 100;
                
                if(parcentRemaining < 20){
                    // Refresh session
                    //it will be in frontend to refresh session
                    res.setHeader('X-Session-Refresh', 'true');
                    res.setHeader('X-Session-Expires-At', expireAt.toISOString());
                    res.setHeader('X-Session-Remaining', timeRemaining.toString());
                    console.log("session expiring soon")
                }
                // if user blocked or deleted
                if(user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED){
                    //todo app error
                    return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized user is blocked or deleted" });
                }
                if(user.isDeleted === true)
                {
                    //todo app error : throw appError
                    return res.status(status.UNAUTHORIZED).json({ message: "Unauthorized user is deleted" });
                }
                  // check if role included in better auth session

                if(authRoles.length > 0 && !authRoles.includes(user.role)){
                    //todo app error : throw appError
                    return res.status(status.FORBIDDEN).json({ message: "Forbidden access" });
                }
            }
           

        }
         // for jwt  access token verification
        const accessToken = cookieUtils.getCookie(req,'accessToken')
         if(accessToken){
                // get  access token
                // if access  token then verify it using jwt
                // check verify success
                // if verifed then check role 
                // if role not match then throw error
                // if role match then continue
                const accessToken = cookieUtils.getCookie(req,'accessToken');
                if(!accessToken)
                {
                    // todo app error
                    throw new Error(status.UNAUTHORIZED + ' ' + 'Unauthorized access! no access token provided' )
                }
                //verify the token 
                const verifyToken = jwtUtils.verifyToken(accessToken, envVariable.ACCESS_TOKEN_SECRET)

                if(!verifyToken.success)
                {
                    //todo app error 
                    throw new Error(status.UNAUTHORIZED + ' ' + 'Unauthorized access! invalid access token' )
                }
                //check the role  to access the route

               if(authRoles.length > 0 && !authRoles.includes(verifyToken.data!.role)){
                    //todo app error 
                    throw new Error(status.FORBIDDEN + ' ' + 'Forbidden access! you can not access this route' )
                }
            
        }
         next();
               
        
    }catch(error:any){
        next(error);
    }
    
}