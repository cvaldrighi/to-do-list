import express from "express";
import type { Request, Response } from "express";
import { Readable } from "stream";
import readline from "readline";

import multer from "multer";
const multerConfig = multer();

export const fileUploadRouter = express.Router();

fileUploadRouter.post('/', multerConfig.single('file'), async (req: Request, res: Response) => {

    //receiving file
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

        console.log("tasks:", task, "tags:", tag);
    }

    return res.send();

})





