import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from 'express-validator';
import * as ListService from "./list.service";

export const listRouter = express.Router();

//GET: List of All Lists
listRouter.get("/", async (request: Request, response: Response) => {
    try {
        const lists = await ListService.listLists();
        return response.status(200).json(lists);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

//GET: Single List By ID
listRouter.get("/:id", async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const list = await ListService.getList(id)
        if (list) {
            return response.status(200).json(list);
        }
        return response.status(404).json("List not found");
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

//POST: Create List
listRouter.post("/", body("title").isString(), async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        const list = request.body;
        const newList = await ListService.createList(list);
        return response.status(201).json(newList);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

//PUT: Update List
listRouter.put("/:id", body("title").isString(), async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    const id: number = parseInt(request.params.id, 10);
    try {
        const list = request.body;
        const updateList = await ListService.updateList(list, id);
        return response.status(200).json(updateList);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

//DELETE: Delete List
listRouter.delete("/:id", async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        await ListService.deleteList(id);
        return response.status(204).json("Deleted");
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
})
