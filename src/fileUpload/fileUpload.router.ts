import express from "express";
import type { Request, Response } from "express";

import multer from "multer";
import readline from "readline";
import { Readable } from "stream";
import _ from "lodash";

import * as fileUploadService from "./fileUpload.service"
import { findTag } from '../tag/tag.service';

export const fileUploadRouter = express.Router();
const multerConfig = multer();

fileUploadRouter.post('/', multerConfig.single('file'), async (req: Request, res: Response) => {

    let tagsObj = {};
    let taskObj = {};
    let tasksArr = [];

    let fileData: string[];
    let listId: number = 0;
    let counter: number = 0;

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

    //handle data
    for await (let line of dataLine) {

        //remove first line
        if (!counter++) continue;

        //split data
        let splited = line.split(",");
        fileData = _.compact(splited);

        //for create tag      
        let tags = fileData.slice(1);
        for (let tag of tags) {

            const exists = await findTag(tag, listId);

            if (exists === null) {
                tagsObj[tag] = true;
            }
        }

        //for create task
        taskObj = {
            title: fileData[0],
            tags: fileData.slice(1)
        }

        tasksArr.push(taskObj);
    }

    await fileUploadService.createTagFromUpload(_.keys(tagsObj), listId);
    await fileUploadService.createTaskFromUpload(tasksArr, listId);

    return res.send();
})


