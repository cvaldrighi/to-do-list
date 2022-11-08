import { db } from "../utils/db.server";
import { List } from '../list/list.service';
import { StatusRead } from '../status/status.service';
import { getTag, TagRead } from '../tag/tag.service';
import { TaskTags } from "@prisma/client";

export type TaskRead = {
    id: number;
    title: string;
    list: List;
    status: StatusRead;
    // tag: TagRead;
}

type TaskWrite = {
    title: string;
    listId: number;
    statusId: number;
    // tag: TagRead;
    tagId: number;
}


export const listTasks = async (): Promise<TaskRead[]> => {
    return db.task.findMany({
        select: {
            id: true,
            title: true,
            list: {
                select: {
                    id: true,
                    title: true
                },
            },
            status: {
                select: {
                    id: true,
                    title: true,
                    list: true
                }
            },
            tags: true
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
            list: {
                select: {
                    id: true,
                    title: true
                },
            },
            status: {
                select: {
                    id: true,
                    title: true,
                    list: true
                }
            },
            tags: true
        },
    });
};

export const createTask = async (task: TaskWrite): Promise<TaskRead> => {
    const { title, listId, statusId, tagId } = task;
    let id = tagId;
    return db.task.create({
        data: {
            title,
            listId,
            statusId,
            tags: {
                create: {
                    tag: {
                        connect: {
                            id
                        }
                    }
                }
            }
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
            status: {
                select: {
                    id: true,
                    title: true,
                    list: true
                }
            },
            tags: true
        },
    })
}

export const updateTask = async (task: TaskWrite, id: number): Promise<TaskRead> => {
    const { title, listId, statusId } = task;
    return db.task.update({
        where: {
            id
        },
        data: {
            title,
            listId,
            statusId
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
            status: {
                select: {
                    id: true,
                    title: true,
                    list: true
                }
            },
            tags: true
        },
    })
}

export const updateTaskStatus = async (task: TaskWrite, id: number): Promise<TaskRead> => {
    const { statusId } = task;
    return db.task.update({
        where: {
            id
        },
        data: {
            statusId
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
            status: {
                select: {
                    id: true,
                    title: true,
                    list: true
                }
            },
            tags: true
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