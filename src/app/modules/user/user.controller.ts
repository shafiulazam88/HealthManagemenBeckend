import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";

import httpStatus from "http-status";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const payload= req.body;
    const result = await UserService.createDoctor(payload);
    res.status(httpStatus.OK).json({
        success: true,
        message: "Doctor created successfully",
        data: result
    });
});

export const UserController = {
    createDoctor
};
