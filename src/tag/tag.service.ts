import { db } from "../utils/db.server";
import { List } from '../list/list.service';
// import { TaskRead } from '../task/task.service';

export type TagRead = {
    id: number;
    title: string;
    color: string;
    list: List;
    // tasks: TaskRead;
}

type TagWrite = {
    title: string;
    color: string;
    listId: number;
}

export const listTags = async (): Promise<TagRead[]> => {
    return db.tag.findMany({
        select: {
            id: true,
            title: true,
            color: true,
            list: {
                select: {
                    id: true,
                    title: true
                },
            },
            tasks: true
        },
    });
};

export const getTag = async (id: number): Promise<TagRead | null> => {
    return db.tag.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            title: true,
            color: true,
            list: {
                select: {
                    id: true,
                    title: true
                },
            },
        },
    });
};

export const createTag = async (tag: TagWrite): Promise<TagRead> => {
    const { title, color, listId } = tag;
    return db.tag.create({
        data: {
            title,
            color,
            listId,
        },
        select: {
            id: true,
            title: true,
            color: true,
            list: {
                select: {
                    id: true,
                    title: true
                },
            },
        },
    })
}

export const updateTag = async (tag: TagWrite, id: number): Promise<TagRead> => {
    const { title, color, listId } = tag;
    return db.tag.update({
        where: {
            id
        },
        data: {
            title,
            color,
            listId
        },
        select: {
            id: true,
            title: true,
            color: true,
            list: {
                select: {
                    id: true,
                    title: true
                },
            },
        },
    })
}


export const deleteTag = async (id: number): Promise<void> => {
    await db.tag.delete({
        where: {
            id
        },
    })
}