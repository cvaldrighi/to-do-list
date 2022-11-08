import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as TagService from "./tag.service";

export const tagRouter = express.Router();

//GET: list of tags
tagRouter.get("/", async (request: Request, response: Response) => {
    try {
        const tags = await TagService.listTags();
        return response.status(200).json(tags);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

//GET: single tag
tagRouter.get("/:id", async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const tag = await TagService.getTag(id);
        if (tag) {
            return response.status(200).json(tag);
        }

        return response.status(404).json("Tag could not be found");
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

//POST: create tags
tagRouter.post("/", body("title").isString(), body("color").isString(), body("listId").isInt(), async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        const tag = request.body;
        const newTag = await TagService.createTag(tag);
        return response.status(201).json(newTag);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

//PUT: update tags
tagRouter.put("/:id", body("title").isString(), body("color").isString(), async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    const id: number = parseInt(request.params.id, 10);
    try {
        const tag = request.body;
        const updateTag = await TagService.updateTag(tag, id);
        return response.status(200).json(updateTag);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

//DELETE: delete tags
tagRouter.delete("/:id", async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        await TagService.deleteTag(id);
        return response.status(204).json("Tags has been successfully deleted")
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
})