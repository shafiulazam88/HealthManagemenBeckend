
import { Router } from "express";
import { doctorController } from "./doctor.controller";
import validateRequest from "../../middleware/validateRequest";
import doctorUpdateValidation from "./doctor.validation";
import { checkAuth } from "../../middleware/checkAutth";
import { Role } from "../../../generated/prisma/enums";



const router = Router();
router.get('/' ,checkAuth(Role.ADMIN , Role.SUPER_ADMIN), doctorController.getAllDoctors);
router.get('/:id' ,checkAuth(Role.ADMIN , Role.SUPER_ADMIN), doctorController.getDoctorById);
//update partial update
router.patch('/:id' ,checkAuth(Role.ADMIN , Role.SUPER_ADMIN),validateRequest(doctorUpdateValidation), doctorController.updateDoctorById);

router.delete('/:id' ,checkAuth(Role.ADMIN , Role.SUPER_ADMIN), doctorController.deleteDoctor);

export const doctorRoute = router;

