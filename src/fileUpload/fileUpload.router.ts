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
    listId = parseInt(req.body.listId);
    const { file } = req;
    const { buffer } = file;
    let data: string[];

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
        data = _.compact(splited);

        //for create tag
        let tag = data.slice(1);
        tag.forEach(e => {
            if (!tagsArr.includes(e)) {
                tagsArr.push(e);
            }

        })

        //for create task
        taskObj = {
            title: data[0],
            tags: data.slice(1)
        }
        tasksArr.push(taskObj);
        //@@@REMOVE FIRST INDEX FOR NO COLUMN NAME
    }

    await fileUploadService.createTagFromUpload(tagsArr, listId);
    await fileUploadService.createTaskFromUpload(tasksArr, listId);

    return res.send();

})


