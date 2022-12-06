import { db } from "../utils/db.server";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export type UserRead = {
    id: number;
    username: string;
}

export type UserWrite = {
    username: string;
    password: string;
}

export const register = async (user: UserWrite): Promise<UserRead> => {
    const { username, password } = user;
    const hashPassword = await bcrypt.hash(password, 10);

    return db.user.create({
        data: {
            username,
            password: hashPassword
        },
        select: {
            id: true,
            username: true,
        },
    })
}

export const login = async (userDto: UserWrite) => {
    const { username, password } = userDto;

    const user = await db.user.findUnique({
        where: {
            username
        }
    })

    if (!user) {
        throw new Error('user not exists');
    }

    const verifyPass = await bcrypt.compare(password, user.password);

    if (!verifyPass) {
        throw new Error('wrong password');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET ?? "", { expiresIn: '1h' });

    return {
        "user": username,
        "token": token
    }
}



