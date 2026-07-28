import { Router } from "express";
import { specialityRoutes } from "../modules/speciality/speciality.routes";
import { AuthRoutes } from "../modules/auth/auth.router";

const router= Router();
router.use("/auth",AuthRoutes) 
router.use("/specialities" , specialityRoutes)


export const IndexRoutes = router;