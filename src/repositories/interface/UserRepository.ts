import { User } from '@prisma/client';
import { UserUpdateBody } from '../../dto/user/UserUpdateBodySchema';

export interface UserRepository {
    createUser(data: {
        name:string;
        email:string;
        password:string;
        avatar?: string | null;
        role?: 'DIRETOR' | 'COORDENADOR' | 'MEMBRO';
        isActive?: boolean;
    }): Promise<User>;
    
    findAllUsers(): Promise<User[]>;

    findByEmail(email: string): Promise<User | null>;

    findById(id: string): Promise<User | null>;

    findByName(name: string): Promise<User | null>;

    update(data: UserUpdateBody, id: string): Promise<User>;

    deactivate(id: string): Promise<void>;

    delete(id: string): Promise<void>;
}