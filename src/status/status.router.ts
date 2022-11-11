import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as StatusService from "./status.service";

export const statusRouter = express.Router();

//GET: list of status
statusRouter.get("/", async (request: Request, response: Response) => {
    try {
        const status = await StatusService.listStatus();
        return response.status(200).json(status);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

//GET: status by listId
statusRouter.get("/list/:id", async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const status = await StatusService.getStatusByListId(id);
        return response.status(200).json(status);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

//GET: single status
statusRouter.get("/:id", async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const status = await StatusService.getStatus(id);
        if (status) {
            return response.status(200).json(status);
        }

        return response.status(404).json("Status could not be found");
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

//POST: create status
statusRouter.post("/", body("title").isString(), body("listId").isInt(), async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        const status = request.body;
        const newStatus = await StatusService.createStatus(status);
        return response.status(201).json(newStatus);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

//PUT: update status
statusRouter.put("/:id", body("title").isString(), async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    const id: number = parseInt(request.params.id, 10);
    try {
        const status = request.body;
        const updateStatus = await StatusService.updateStatus(status, id);
        return response.status(200).json(updateStatus);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

//DELETE: delete status
statusRouter.delete("/:id", async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        await StatusService.deleteStatus(id);
        return response.status(204).json("Status has been successfully deleted")
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
})