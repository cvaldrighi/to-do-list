import express from "express";
import type { Request, Response } from "express";
import fs from 'fs';

export const uploadedDataRouter = express.Router();

uploadedDataRouter.get('/', (req: Request, res: Response) => {
    fs.readFile('src/fileUpload/public/import.csv', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(data);
        return res.send(data)
    });

})
