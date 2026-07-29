import { Router } from "express";
import { specialityRoutes } from "../modules/speciality/speciality.routes";
import { AuthRoutes } from "../modules/auth/auth.router";
import { UserRoute } from "../modules/user/user.route";

const router= Router();
router.use("/auth",AuthRoutes) 
router.use("/specialities" , specialityRoutes)

router.use("/doctors" , UserRoute)

export const IndexRoutes = router;