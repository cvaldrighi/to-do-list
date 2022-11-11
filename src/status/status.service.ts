import { db } from "../utils/db.server";
import { List } from '../list/list.service';

export type StatusRead = {
    id: number;
    title: string;
    list: List;
}

export type StatusWrite = {
    title: string;
    listId: number;
}

export const listStatus = async (): Promise<StatusRead[]> => {
    return db.status.findMany({
        select: {
            id: true,
            title: true,
            list: {
                select: {
                    id: true,
                    title: true
                },
            },
            Task: true
        }
    })
}

export const getStatusByListId = async (id: number): Promise<StatusRead[] | null> => {
    return db.status.findMany({
        where: {
            list: {
                id,
            },
        },
        select: {
            id: true,
            title: true,
            list: {
                select: {
                    id: true,
                    title: true
                },
            },
            Task: true
        },
    })
};

export const getStatus = async (id: number): Promise<StatusRead | null> => {
    return db.status.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            title: true,
            list: true,
            Task: true
        }
    })
}

export const createStatus = async (status: Omit<StatusWrite, "id">): Promise<StatusRead> => {
    const { title, listId } = status;
    return db.status.create({
        data: {
            title,
            listId,
        },
        select: {
            id: true,
            title: true,
            list: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
}

export const updateStatus = async (status: Omit<StatusWrite, "id">, id: number): Promise<StatusRead> => {
    const { title } = status;
    return db.status.update({
        where: {
            id
        },
        data: {
            title
        },
        select: {
            id: true,
            title: true,
            list: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
}

export const deleteStatus = async (id: number): Promise<void> => {
    await db.status.delete({
        where: {
            id
        },
    })
}