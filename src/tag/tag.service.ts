import { db } from "../utils/db.server";
import { List } from '../list/list.service';
import { Prisma } from "@prisma/client";

export type TagRead = {
    id: number;
    title: string;
    color: string;
    list: List;
}

export type TagGeneric = {
    id: number;
    title: string;
}

export type TagWrite = {
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


export const findTagsByListId = async (listId: number): Promise<TagGeneric[]> => {
    return db.tag.findMany({
        where: {
            listId,
        },
        select: {
            id: true,
            title: true,
        },
    });
};


export const findTag = async (title: string, listId: number): Promise<TagRead | null> => {
    return db.tag.findFirst({
        where: {
            title,
            listId
        },
        select: {
            id: true,
            title: true,
            color: true,
            list: true
        }
    })
}

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

export const createManyTags = async (data: Prisma.TagCreateManyInput[]): Promise<Prisma.BatchPayload> => {
    return await db.tag.createMany({ data })
} 