import { IRequestUser } from "./userRequest.interface";

// package type declaration is writing  
declare global {
    namespace Express {
        interface Request {
            user:IRequestUser
        }
    }
}
