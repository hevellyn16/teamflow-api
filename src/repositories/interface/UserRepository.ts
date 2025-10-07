import { User } from '@prisma/client';

export interface UserRepository {
    createUser(data: {
        name:string;
        email:string;
        password:string;
    }): Promise<User>;
    findAllUsers(): Promise<User[]>;
}