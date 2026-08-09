
import { Router } from "express";
import { doctorController } from "./doctor.controller";
import validateRequest from "../../middleware/validateRequest";
import doctorUpdateValidation from "./doctor.validation";


const router = Router();
router.get('/' , doctorController.getAllDoctors);
router.get('/:id' , doctorController.getDoctorById);
//update partial update
router.patch('/:id' ,validateRequest(doctorUpdateValidation), doctorController.updateDoctorById);

router.delete('/:id' , doctorController.deleteDoctor);

export const doctorRoute = router;

