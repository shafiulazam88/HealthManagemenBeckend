import express, { Application} from "express";


import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/global_error_handler";
import { notFound } from "./app/middleware/not_found";
import cookieParser from "cookie-parser";
const app:Application= express();
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
