import { db } from "../utils/db.server";
import dayjs from "dayjs";

export class GenerateRefreshTokenProvider {

    //generate refresh token
    async execute(userId: number) {
        const expiresIn = dayjs().add(15, "second").unix();
        const generateRT = await db.refreshToken.create({
            data: {
                userId,
                expiresIn
            }
        });

        return generateRT;
    }

}