import express from "express";
import multer from "multer";
import readline from "readline";

import type { Request, Response } from "express";
import { Readable } from "stream";
import * as fileUploadService from "./fileUpload.service"
import _ from "lodash";
import { findTag } from '../tag/tag.service';

export const fileUploadRouter = express.Router();

const multerConfig = multer();

fileUploadRouter.post('/', multerConfig.single('file'), async (req: Request, res: Response) => {

    let tagsArr = {};
    let tasksArr = [];
    let taskObj = {};
    let listId: number = 0;
    let counter = 0;

    //receiving file
    const { file } = req;
    const { buffer } = file;

    //reading file
    listId = parseInt(req.body.listId);
    const readableFile = new Readable();
    readableFile.push(buffer);
    readableFile.push(null);

    const dataLine = readline.createInterface({
        input: readableFile
    })

    let fileData: string[];

    //handle data
    for await (let line of dataLine) {

        //remove first line
        if (!counter++) continue;

        let splited = line.split(",");
        fileData = _.compact(splited);

        //for create tag      
        let tags = fileData.slice(1);
        for (let tag of tags) {

            const exists = await findTag(tag, listId);

            if (exists === null) {
                tagsArr[tag] = true;
            }
        }

        //for create task
        taskObj = {
            title: fileData[0],
            tags: fileData.slice(1)
        }
        tasksArr.push(taskObj);
    }

    await fileUploadService.createTagFromUpload(_.keys(tagsArr), listId);
    await fileUploadService.createTaskFromUpload(tasksArr, listId);

    return res.send();
})


