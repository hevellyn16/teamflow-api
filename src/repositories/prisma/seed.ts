// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Limpa o banco para garantir um estado inicial limpo (opcional, cuidado em produção)
  await prisma.user.deleteMany();

  console.log('Criando o usuário Diretor inicial...');

  const passwordHash = await hash('senhaforte123', 8);

  const director = await prisma.user.create({
    data: {
      email: 'diretor@teamflow.com',
      name: 'Diretor Padrão',
      password: passwordHash,
      role: Role.DIRETOR, // Garante que a role seja DIRETOR
      isActive: true,
    },
  });

  console.log('Usuário Diretor criado com sucesso:', director);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });