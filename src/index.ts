import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { taskRouter } from './task/task.router';
import { listRouter } from './list/list.router';
import { statusRouter } from './status/status.router';
import { tagRouter } from './tag/tag.router';

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRouter);
app.use("/api/lists", listRouter);
app.use("/api/status", statusRouter);
app.use("/api/tags", tagRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});