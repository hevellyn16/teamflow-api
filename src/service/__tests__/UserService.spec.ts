import { UserService } from '../UserService';
import { PrismaUserRepository } from '../../repositories/prisma/PrismaUserRepository';
import { Role } from '@prisma/client'; 

const userRepositoryMock = {
  createUser: jest.fn(),
  findByEmail: jest.fn()
} as unknown as PrismaUserRepository;

const userService = new UserService(userRepositoryMock);

describe('UserService - User Creation', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('must allow a Director to register a new user successfully', async () => {
    userRepositoryMock.createUser = jest.fn().mockResolvedValue({
      id: 'user-id-123',
      email: 'novo@email.com',
      role: 'DIRETOR' as Role,
      isActive: true,
    });

    const novoDiretorData = {
      email: 'director@email.com',
      password: 'senhaSegura123',
      name: 'Novo Diretor',
      role: 'DIRETOR' as Role 
    };

    await expect(userService.createUser(novoDiretorData)).resolves.not.toThrow();
    expect(userRepositoryMock.createUser).toHaveBeenCalledWith(novoDiretorData);
  });

  it('must NOT allow a Coordinator to register a new user', async () => {
    const novoCoordenadorData = {
      email: 'coordenador@email.com',
      password: 'senhaSegura123',
      name: 'Novo Coordenador',
      role: 'COORDENADOR' as Role
    };

    await expect(userService.createUser(novoCoordenadorData)).rejects.toThrow('Unauthorized action');
    expect(userRepositoryMock.createUser).not.toHaveBeenCalled();
  });

});
