import { NextFunction, Request, Response, Router } from "express";
import { SpecialityController } from "./specialty.controller";

import { checkAuth } from "../../middleware/checkAutth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../../config/multer.config";
import validateRequest from "../../middleware/validateRequest";
import { SpecialityValidation } from "./speciality.validation";

const router = Router();
router.post('/',//checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
multerUpload.single('file'),
validateRequest(SpecialityValidation.createSpecialityZodSchema),
SpecialityController.createSpeciality);
router.get('/', SpecialityController.GetAllSpeciality);

router.delete('/:id',checkAuth(Role.ADMIN,Role.SUPER_ADMIN), SpecialityController.DeleteSpeciality);
router.put('/:id',checkAuth(Role.ADMIN,Role.SUPER_ADMIN), SpecialityController.UpdateSpeciality);

export const specialityRoutes = router;
