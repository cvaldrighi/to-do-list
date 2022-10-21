import { db } from "../utils/db.server";
import { List } from '../list/list.service';

export type TaskRead = {
    id: number;
    title: string;
    isDone: boolean;
    list: List;
    //listId: number;
}

type TaskWrite = {
    title: string;
    isDone: boolean;
    listId: number;
}

export const listTasks = async (): Promise<TaskRead[]> => {
    return db.task.findMany({
        select: {
            id: true,
            title: true,
            isDone: true,
            list: {
                select: {
                    id: true,
                    title: true
                },
            },
            //listId: true
        },
    });
};

export const getTask = async (id: number): Promise<TaskRead | null> => {
    return db.task.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            title: true,
            isDone: true,
            list: {
                select: {
                    id: true,
                    title: true
                },
            },
        },
    });
};

export const createTask = async (task: TaskWrite): Promise<TaskRead> => {
    const { title, isDone, listId } = task;
    return db.task.create({
        data: {
            title,
            isDone,
            listId,
        },
        select: {
            id: true,
            title: true,
            isDone: true,
            list: {
                select: {
                    id: true,
                    title: true
                },
            },
        },
    })
}


export const updateTask = async (task: TaskWrite, id: number): Promise<TaskRead> => {
    const { title, isDone, listId } = task;
    return db.task.update({
        where: {
            id
        },
        data: {
            title,
            isDone,
            listId
        },
        select: {
            id: true,
            title: true,
            isDone: true,
            list: {
                select: {
                    id: true,
                    title: true
                },
            },
        },
    })
}
export const deleteTask = async (id: number): Promise<void> => {
    await db.task.delete({
        where: {
            id
        },
    })
}