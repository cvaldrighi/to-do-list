import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as UserService from "./user.service";

export const userRouter = express.Router();

//register
userRouter.post("/",
    body("username").isString(),
    body("password").isString(),
    async (req: Request, res: Response) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = req.body;
            const newUser = await UserService.register(user);
            return res.status(201).json(newUser);
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }
)

//login
userRouter.post("/login",
    body("username").isString(),
    body("password").isString(),
    async (req: Request, res: Response) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = req.body;
            const login = await UserService.login(user);
            return res.status(200).json(login);
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }
)