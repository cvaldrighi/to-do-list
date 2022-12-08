import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { taskRouter } from './task/task.router';
import { listRouter } from './list/list.router';
import { statusRouter } from './status/status.router';
import { tagRouter } from './tag/tag.router';
import { userRouter } from './user/user.router';
import { refreshTokenRouter } from './refreshToken/refreshToken.router';
import { fileUploadRouter } from "./fileUpload/fileUpload.router";
import { uploadedDataRouter } from "./uploadedData/uploadedData.router";

// import fileUpload from "express-fileupload";
import { AuthMiddleware } from './middlewares/auth';

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
// app.use(fileUpload());

//AuthMiddleware

app.use("/api/tasks", taskRouter);
app.use("/api/lists", listRouter);
app.use("/api/status", statusRouter);
app.use("/api/tags", tagRouter);
app.use("/api/user", userRouter);
app.use("/api/refresh-token", refreshTokenRouter);
app.use("/api/upload", fileUploadRouter);
app.use("/api/data", uploadedDataRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});