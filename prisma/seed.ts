import { db } from '../src/utils/db.server';

type Task = {
    title: string,
    isDone: boolean
};


async function seed() {
    await Promise.all(
        getTasks().map((task) => {
            return db.task.create({
                data: {
                    title: task.title,
                    isDone: task.isDone
                }
            })
        })
    )
}

seed();

function getTasks(): Array<Task> {
    return [
        {
            title: "Do your API",
            isDone: false
        }
    ]
}
