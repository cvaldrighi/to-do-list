import { Prisma } from "@prisma/client";
import _ from "lodash";
import { getStatusByListId } from "../status/status.service";
import { createManyTags, findTagsByListId } from '../tag/tag.service';
import { createTask } from "../task/task.service";

export type Arr = any[];

export const createTagFromUpload = async (tags: Arr, listId: number): Promise<Prisma.BatchPayload> => {
    let data = [];

    tags.forEach(async el => {

        const tag = {
            title: el,
            listId,
            color: "#a44eeb"
        }

        data.push(tag);
    })

    const results = await createManyTags(data);
    return results;
}

export const createTaskFromUpload = async (tasks: Arr, listId: number) => {

    let existentTags = _.keyBy(await findTagsByListId(listId), "title");
    let statusByList = await getStatusByListId(listId);
    let statusId = statusByList[0].id;

    tasks.forEach(async el => {

        //change tag title for id
        for (let i = 0; i < el.tags.length; i++) {
            el.tags[i] = existentTags[el.tags[i]].id;
        }

        const task = {
            title: el.title,
            listId: listId,
            statusId: statusId,
            tagId: el.tags
        }

        await createTask(task);
    })
}








