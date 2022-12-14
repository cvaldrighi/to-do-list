import { Prisma } from "@prisma/client";
import { getStatusByListId } from "../status/status.service";
import { createManyTags, listTags } from '../tag/tag.service';
import { createTask } from "../task/task.service";

export type Arr = any[];

export const createTagFromUpload = async (tags: Arr, listId: number): Promise<Prisma.BatchPayload> => {
    let data = [];

    tags.forEach(async e => {

        const t = {
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

    let existentTags = await listTags();
    let statusByList = await getStatusByListId(listId);
    let statusId = statusByList[0].id;

    tasks.forEach(async e => {

        //change tag title for id
        for (let i = 0; i < e.tags.length; i++) {
            existentTags.forEach(eT => {
                if (e.tags[i] == eT.title) {
                    e.tags[i] = eT.id;
                }
            })
        }

        const t = {
            title: e.title,
            listId: listId,
            statusId: statusId,
            tagId: e.tags
        }

        await createTask(t);
    })

}








