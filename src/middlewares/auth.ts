import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

export function AuthMiddleware(req: Request | any, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "Token not provided" });
    }

    const [, token] = authorization.split(" ");

    try {
        jwt.verify(token, process.env.TOKEN_SECRET || "");
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token invalid" });
    }
}