import express from "express";
import type { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import fs from 'fs';

export const fileUploadRouter = express.Router();

//saving file 
fileUploadRouter.post('/', (req: Request, res: Response) => {

    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    // accessing the file
    const myFile = req.files.file as UploadedFile;

    //  mv() method places the file inside public directory
    myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }

        // returing the response with file path and name
        return res.send({ name: myFile.name, path: `/${myFile.name}` });
    });

})





