import jwt from 'jsonwebtoken';

export class GenerateTokenProvider {

    //generate token
    async execute(userId: number) {
        const token = jwt.sign({ id: userId }, process.env.TOKEN_SECRET ?? "", { expiresIn: '30s' });
        return token;
    }
}