import { Prisma } from "@prisma/client";
import { getStatusByListId } from "../status/status.service";
import { listTags, TagWrite } from "../tag/tag.service";
import { createTask } from "../task/task.service";
import { db } from "../utils/db.server";

export type Arr = any[];

export const createTagFromUpload = async (tags: Arr, listId: number): Promise<Prisma.BatchPayload> => {
    let data = [];

    async function createManyTags(data: Prisma.TagCreateManyInput[]): Promise<Prisma.BatchPayload> {
        return await db.tag.createMany({ data, skipDuplicates: true })
    }

    tags.forEach(async e => {

        const t: TagWrite = {
            title: e,
            listId,
            color: "#a44eeb"
        }
        data.push(t);

    })

    const results = await createManyTags(data);
    return results;
}

export const createTaskFromUpload = async (tasks: Arr, listId: number) => {

    let statusByList = await getStatusByListId(listId);
    let statusId = statusByList[0].id;
    let existentTags = await listTags();

    tasks.forEach(async e => {

        e.tags.forEach((el: any) => {
            existentTags.forEach(eT => {
                if (el == eT.title) {
                    e.tags = [eT.id];
                }
            })

        })

        const t = {
            title: e.title,
            listId: listId,
            statusId: statusId,
            tagId: e.tags
        }


        await createTask(t);
    })

}







