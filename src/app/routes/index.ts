import { Router } from "express";
import { specialityRoutes } from "../modules/speciality/speciality.routes";

const router= Router();

router.use("/specialities" , specialityRoutes)

export const IndexRoutes = router;