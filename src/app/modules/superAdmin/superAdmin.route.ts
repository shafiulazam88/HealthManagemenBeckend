import { Router } from "express";
import { superAdminController } from "./superAdmin.controller";
import { checkAuth } from "../../middleware/checkAutth";
import { updateSuperAdminZodvalidation } from "./superAdmin.validation";
import validateRequest from "../../middleware/validateRequest";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.get("/", checkAuth(Role.SUPER_ADMIN), superAdminController.getAllSuperAdmins);
router.get("/:id", checkAuth(Role.SUPER_ADMIN), superAdminController.getSuperAdminById);

router.patch("/:id", checkAuth(Role.SUPER_ADMIN),validateRequest(updateSuperAdminZodvalidation),superAdminController.updateSuperAdmin);
router.delete("/:id",checkAuth(Role.SUPER_ADMIN) ,superAdminController.deleteSuperAdmin);

export const superAdminRouter = router;