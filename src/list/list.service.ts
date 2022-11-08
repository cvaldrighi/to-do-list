import { db } from "../utils/db.server";

export type List = {
    id: number;
    title: string;
}

export const listLists = async (): Promise<List[]> => {
    return db.list.findMany({
        select: {
            id: true,
            title: true,
            Status: true,
            Tag: true,
            Task: true
        }
    })
}

export const getList = async (id: number): Promise<List | null> => {
    return db.list.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            title: true,
            Status: true,
            Tag: true,
            Task: true
        }
    })
}

export const createList = async (list: Omit<List, "id">): Promise<List> => {
    const { title } = list;
    return db.list.create({
        data: {
            title
        },
        select: {
            id: true,
            title: true
        }
    })
}

export const updateList = async (list: Omit<List, "id">, id: number): Promise<List> => {
    const { title } = list;
    return db.list.update({
        where: {
            id
        },
        data: {
            title
        },
        select: {
            id: true,
            title: true,
            Status: true,
            Tag: true,
            Task: true
        }
    })
}

export const deleteList = async (id: number): Promise<void> => {
    await db.list.delete({
        where: {
            id
        },
    })
}