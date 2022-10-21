import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as TaskService from "./task.service";

export const taskRouter = express.Router();

// GET: list of tasks
taskRouter.get("/", async (request: Request, response: Response) => {
    try {
        const tasks = await TaskService.listTasks();
        return response.status(200).json(tasks);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }

});

//GET: single task
taskRouter.get("/:id", async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        const task = await TaskService.getTask(id);
        if (task) {
            return response.status(200).json(task);
        }

        return response.status(404).json("Task could not be found");
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

//POST: create task
//Params: title, isDone, listId
taskRouter.post("/", body("title").isString(), body("isDone").isBoolean(), body("listId").isInt(), async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    try {
        const task = request.body;
        const newTask = await TaskService.createTask(task);
        return response.status(201).json(newTask);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

//PUT: update task
//Params: isDone
taskRouter.put("/:id", body("isDone").isBoolean(), async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }
    const id: number = parseInt(request.params.id, 10);
    try {
        const task = request.body;
        const updateTask = await TaskService.updateTask(task, id);
        return response.status(200).json(updateTask);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

//DELETE: delete task
taskRouter.delete("/:id", async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        await TaskService.deleteTask(id);
        return response.status(204).json("Task has been successfully deleted")
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
})