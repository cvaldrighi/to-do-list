import express from "express";
import multer from "multer";
import readline from "readline";

import type { Request, Response } from "express";
import { Readable } from "stream";
import { TagWrite, getTag, listTags } from '../tag/tag.service';
import { TaskWrite } from '../task/task.service';
import { db } from "../utils/db.server";
import { getStatusByListId } from '../status/status.service';
import { KeyObject } from "crypto";


export const fileUploadRouter = express.Router();
const multerConfig = multer();

fileUploadRouter.post('/', multerConfig.single('file'), async (req: Request, res: Response) => {

    //receiving file
    const listId = parseInt(req.body.listId);
    const { file } = req;
    const { buffer } = file;

    //reading file
    const readableFile = new Readable();
    readableFile.push(buffer);
    readableFile.push(null);

    const dataLine = readline.createInterface({
        input: readableFile
    })

    //handle data
    for await (let line of dataLine) {

        let splited = line.split(",");
        let task = splited[0].split(',');
        let tag = splited.slice(1);

        for (let i = 0; i < tag.length; i++) {

            if (tag[i] == "") {

                tag.splice(i, 1);
            }

        }

        tag.forEach(async e => {
            const t: TagWrite = {
                title: e,
                listId: listId,
                color: "#a44eeb"
            }

            const tagAlreadyExists = await db.tag.findFirst({
                where: {
                    title: t.title,
                    listId: t.listId
                }
            })

            console.log(tagAlreadyExists);

            if (!tagAlreadyExists) {
                const newTag = await db.tag.create({
                    data: {
                        title: t.title,
                        color: t.color,
                        listId: t.listId
                    }
                })
                // console.log(newTag);
            }
        })

        task.forEach(async e => {

            //@@@TO DO
            // TAGS SUBINDO DUPLICADAS

            const statusByList = await getStatusByListId(listId);
            const statusId = statusByList[0].id;
            let tagId: number[] = [];

            const existentTags = await listTags();

            existentTags.forEach(eT => {
                tag.forEach(t => {
                    if (eT.title == t) {
                        tagId.push(eT.id);
                    }
                })
            })

            const t: TaskWrite = {
                title: e,
                listId: listId,
                statusId: statusId,
                tagId: tagId
            }

            console.log(t);

            let id = tagId;

            const newTask = await db.task.create({
                data: {
                    title: t.title,
                    listId: t.listId,
                    statusId: t.statusId,
                    tags: {
                        create: id.map((id) => ({
                            tag: {
                                connect: {
                                    id
                                }
                            }
                        }))
                    }
                }
            })

        })

    }

    return res.send();

})




