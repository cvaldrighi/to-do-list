import { db } from "../utils/db.server";

type Task = {
    id: number;
    title: string;
    isDone: boolean
}

export const listTasks = async (): Promise<Task[]> => {
    return db.task.findMany({
        select: {
            id: true,
            title: true,
            isDone: true
        }
    });
}

export const getTask = async (id: number): Promise<Task | null> => {
    return db.task.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            title: true,
            isDone: true
        }
    })
}

export const createTask = async (task: Omit<Task, "id">): Promise<Task> => {
    const { title, isDone } = task;
    return db.task.create({
        data: {
            title,
            isDone
        },
        select: {
            id: true,
            title: true,
            isDone: true
        }
    })
}

export const updateTask = async (task: Omit<Task, "id">, id: number): Promise<Task> => {
    const { title, isDone } = task;
    return db.task.update({
        where: {
            id
        },
        data: {
            title,
            isDone
        },
        select: {
            id: true,
            title: true,
            isDone: true
        }
    })
}

export const deleteTask = async (id: number): Promise<void> => {
    await db.task.delete({
        where: {
            id
        },
    })
}