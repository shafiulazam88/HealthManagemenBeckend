import { Router } from "express";
import { SpecialityController } from "./specialty.controller";

const router = Router();
router.post('/',SpecialityController.createSpeciality);
router.get('/',SpecialityController.GetAllSpeciality);

router.delete('/:id', SpecialityController.DeleteSpeciality);
router.put('/:id', SpecialityController.UpdateSpeciality);

export const specialityRoutes = router;
