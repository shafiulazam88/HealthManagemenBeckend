import jwt,{ JwtPayload, SignOptions } from "jsonwebtoken"

//token creation for RBAC
const createToken= (payload: JwtPayload, secret:string, {expiresIn}:SignOptions) => {
   
    
    const token = jwt.sign(payload, secret, {expiresIn} as SignOptions)
    return token;
}
// Verify token for RBAC
const verifyToken=(token:string, secret:string)=>{
    try {
        const decoded= jwt.verify(token, secret) as JwtPayload;
        return decoded;
    } catch (error:any) {
        return{
            success:false,
            message:error.message,
            error:error
            
        }
    }
    
}


const decodeToken=(token:string)=>{
    return jwt.decode(token) as JwtPayload;
}

export const jwtUtils = {
    createToken,
    verifyToken,
    decodeToken
}