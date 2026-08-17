
import { Router } from "express";
import adminController from "./admin.controller";
import validateRequest from "../../middleware/validateRequest";
import { updateAdminZodvalidation } from "./admin.validation";
import { checkAuth } from "../../middleware/checkAutth";

import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.get("/",checkAuth(Role.SUPER_ADMIN),adminController.getAllAdmins);
router.get("/:id", checkAuth(Role.SUPER_ADMIN), adminController.getAdminById);
router.patch("/:id",checkAuth(Role.SUPER_ADMIN),validateRequest(updateAdminZodvalidation), adminController.updateAdmin);
router.delete("/:id", checkAuth(Role.SUPER_ADMIN), adminController.deleteAdmin);

export const adminRouter = router;