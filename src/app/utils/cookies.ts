import {  CookieOptions, Request, Response } from "express";

//cookie set by  response , cookie will come in key value pair
const setCookie=(res:Response , key: string , value:string , options: CookieOptions)=>{
    // console.log("cookies expires in",options.maxAge)
    res.cookie(key, value , options)


}

// get cookie will come in request , all we need the key to get the cookie

const getCookie =(req: Request , key:string)=>{
  return req.cookies[key];
}

//clear cookie

const clearCookie =(res: Response , key:string , options:CookieOptions)=>{
  res.clearCookie(key, options);
}

export const cookieUtils = {
    setCookie,
    getCookie,
    clearCookie
}
