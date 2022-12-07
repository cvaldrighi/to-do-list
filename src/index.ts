import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import coockieParser from "cookie-parser";

import { taskRouter } from './task/task.router';
import { listRouter } from './list/list.router';
import { statusRouter } from './status/status.router';
import { tagRouter } from './tag/tag.router';
import { userRouter } from './user/user.router';
import { refreshTokenRouter } from './refreshToken/refreshToken.router';
import { AuthMiddleware } from './middlewares/auth';

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();

app.use(cors());
app.use(coockieParser());
app.use(express.json());

app.use("/api/tasks", AuthMiddleware, taskRouter);
app.use("/api/lists", AuthMiddleware, listRouter);
app.use("/api/status", AuthMiddleware, statusRouter);
app.use("/api/tags", AuthMiddleware, tagRouter);
app.use("/api/user", userRouter);
app.use("/api/refresh-token", refreshTokenRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});