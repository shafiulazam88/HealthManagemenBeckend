import express, { Application, Request , Response} from "express";
import { prisma } from "./app/lib/prisma";

import { IndexRoutes } from "./app/routes";
const app:Application= express();
//enable url-encoding
app.use(express.urlencoded({extended:true}))
//middleware to parse json
app.use(express.json());

app.use("/api/v1" , IndexRoutes)

app.get('/',async(req:Request , res:Response)=>{
    const speciality = await prisma.specialty.create(
        {
            data:{
                title:"cardiology"
            }
        }
    )
    res.status(201).json(
        {
            success:true,
            message: "api is working",
            data: speciality
        }
    )
});

export default app;
