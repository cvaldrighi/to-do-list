import { db } from "../utils/db.server";
import { GenerateTokenProvider } from '../providers/GenerateTokenProvider';
import dayjs from 'dayjs';
import { GenerateRefreshTokenProvider } from '../providers/GenerateRefreshTokenProvider';

export class RefreshTokenService {
    async execute(refresh_token: string) {

        //get refreshToken
        const refreshToken = await db.refreshToken.findFirst({
            where: {
                id: refresh_token
            }
        })

        if (!refreshToken) {
            throw new Error('Refresh token invalid');
        }

        //create new token
        const generateTokenProvider = new GenerateTokenProvider();
        const newToken = await generateTokenProvider.execute(refreshToken.userId);

        //verify if refresh token is expired
        const refreshTokenExpired = dayjs().isAfter(dayjs.unix(refreshToken.expiresIn));

        if (refreshTokenExpired) {

            //deletes old RT
            await db.refreshToken.deleteMany({
                where: {
                    userId: refreshToken.userId
                }
            })

            //create new RT
            const generateRefreshTokenProvider = new GenerateRefreshTokenProvider();
            const newRefreshToken = await generateRefreshTokenProvider.execute(refreshToken.userId);

            return { newToken, newRefreshToken };
        }

        return { newToken };

    }
}