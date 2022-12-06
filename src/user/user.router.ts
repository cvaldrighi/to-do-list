import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as UserService from "./user.service";


export const userRouter = express.Router();

userRouter.post("/", body("username").isString(), body("password").isString(), async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        const user = request.body;
        const newUser = await UserService.register(user);
        return response.status(201).json(newUser);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
})

userRouter.post("/login", body("username").isString(), body("password").isString(), async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        const user = request.body;
        const login = await UserService.login(user);
        return response.status(200).json(login);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
})