import express, { Application} from "express";
import cors from "cors";

import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/global_error_handler";
import { notFound } from "./app/middleware/not_found";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "node:path";
import { resolve } from "node:dns";
import { envVariable } from "./config/env";


const app:Application= express();

// CORS configuration
app.use(cors({
    origin: envVariable.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(),`src/app/templates`));

// Better Auth handler with custom path
app.use("/api/v1/auth", toNodeHandler(auth));

//enable url-encoding
app.use(express.urlencoded({extended:true}))
//middleware to parse json
app.use(express.json());
//middleware to parse cookies
app.use(cookieParser());

app.use("/api/v1" , IndexRoutes)


app.use(globalErrorHandler);
app.use(notFound);


// app.get('/',async(req:Request , res:Response)=>{
//     const speciality = await prisma.specialty.create(
//         {
//             data:{
//                 title:"cardiology"
//             }
//         }
//     )
//     res.status(201).json(
//         {
//             success:true,
//             message: "api is working",
//             data: speciality
//         }
//     )
// });

export default app;
