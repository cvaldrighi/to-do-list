import express from "express";
import multer from "multer";
import readline from "readline";

import type { Request, Response } from "express";
import { Readable } from "stream";
import * as fileUploadService from "./fileUpload.service"
import _ from "lodash";

export const fileUploadRouter = express.Router();

const multerConfig = multer();
let tagsArr = [];
let tasksArr = [];
let listId: number = 0;
let taskObj = {};

fileUploadRouter.post('/', multerConfig.single('file'), async (req: Request, res: Response) => {

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

        let splited = line.split(",");
        fileData = _.compact(splited);

        //for create tag      
        let tag = fileData.slice(1);

        tag.forEach(async e => {
            if (!tagsArr.includes(e)) {
                tagsArr.push(e);
            }
        })

        //for create task
        taskObj = {
            title: fileData[0],
            tags: fileData.slice(1)
        }
        tasksArr.push(taskObj);
    }

    //removing first index (column name)
    tagsArr = tagsArr.slice(1);
    tasksArr = tasksArr.slice(1);

    await fileUploadService.createTagFromUpload(tagsArr, listId);
    await fileUploadService.createTaskFromUpload(tasksArr, listId);

    return res.send();
})


