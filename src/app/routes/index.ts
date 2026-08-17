import { Router } from "express";
import { specialityRoutes } from "../modules/speciality/speciality.routes";
import { AuthRoutes } from "../modules/auth/auth.router";
import { UserRoute } from "../modules/user/user.route";
import { doctorRoute } from "../modules/doctor/doctor.router";
import { adminRouter } from "../modules/admin/admin.route";
import { superAdminRouter } from "../modules/superAdmin/superAdmin.route";

const router= Router();
router.use("/auth",AuthRoutes) 
router.use("/specialities" , specialityRoutes)


router.use("/users" , UserRoute)

router.use("/doctors", doctorRoute)
router.use("/admins", adminRouter)

router.use("/super-admins", superAdminRouter)

export const IndexRoutes = router;