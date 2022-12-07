import express from "express";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { RefreshTokenService } from './refreshToken.service';

export const refreshTokenRouter = express.Router();

refreshTokenRouter.post("/", async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { refreshToken } = req.body;
        const refreshTokenService = new RefreshTokenService();
        const token = await refreshTokenService.execute(refreshToken);

        return res.status(200).json(token);
    } catch (error: any) {
        res.json(error.message);
    }
})