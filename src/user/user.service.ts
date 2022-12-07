import { db } from "../utils/db.server";
import bcrypt from 'bcrypt';
import { GenerateRefreshTokenProvider } from '../providers/GenerateRefreshTokenProvider';
import { GenerateTokenProvider } from '../providers/GenerateTokenProvider';

export type UserRead = {
    id: number;
    username: string;
}

export type UserWrite = {
    username: string;
    password: string;
}

export const register = async (dto: UserWrite): Promise<UserRead> => {
    const { username, password } = dto;

    //hash password
    const hashPassword = await bcrypt.hash(password, 10);

    //verify username
    const userExists = await db.user.findUnique({
        where: {
            username
        }
    })
    if (userExists) {
        throw new Error("Username already exists");
    }

    //register user
    return db.user.create({
        data: {
            username,
            password: hashPassword,
        },
        select: {
            id: true,
            username: true,
        },
    })
}

export const login = async (dto: UserWrite) => {
    const { username, password } = dto;

    //verify username
    const user = await db.user.findUnique({
        where: {
            username
        }
    })
    if (!user) {
        throw new Error('User not exists');
    }

    //verify password
    const verifyPass = await bcrypt.compare(password, user.password);
    if (!verifyPass) {
        throw new Error('Wrong password');
    }

    //create token
    const tokenProvider = new GenerateTokenProvider();
    const token = await tokenProvider.execute(user.id);

    //create refresh token
    await db.refreshToken.deleteMany({
        where: {
            userId: user.id
        }
    })
    const refreshTokenProvider = new GenerateRefreshTokenProvider();
    const refreshToken = await refreshTokenProvider.execute(user.id);

    return {
        "user": username,
        "token": token,
        "RT": refreshToken
    }
}



