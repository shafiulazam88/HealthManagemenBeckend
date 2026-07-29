import { Router } from "express";
import { specialityRoutes } from "../modules/speciality/speciality.routes";
import { AuthRoutes } from "../modules/auth/auth.router";
import { UserRoute } from "../modules/user/user.route";
import { doctorRoute } from "../modules/doctor/doctor.router";

const router= Router();
router.use("/auth",AuthRoutes) 
router.use("/specialities" , specialityRoutes)


router.use("/users" , UserRoute)

router.use("/doctors", doctorRoute)

export const IndexRoutes = router;