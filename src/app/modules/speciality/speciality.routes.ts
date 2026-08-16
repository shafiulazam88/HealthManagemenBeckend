import { NextFunction, Request, Response, Router } from "express";
import { SpecialityController } from "./specialty.controller";

import { checkAuth } from "../../middleware/checkAutth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.post('/',checkAuth(Role.ADMIN,Role.SUPER_ADMIN),SpecialityController.createSpeciality);
router.get('/', SpecialityController.GetAllSpeciality);

router.delete('/:id',checkAuth(Role.ADMIN,Role.SUPER_ADMIN), SpecialityController.DeleteSpeciality);
router.put('/:id',checkAuth(Role.ADMIN,Role.SUPER_ADMIN), SpecialityController.UpdateSpeciality);

export const specialityRoutes = router;
