import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../modules/auth/entities/user.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const repo = getRepository(User);
    const adminUsername = process.env.ADMIN_USERNAME ?? 'admin';
    const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';

  const exists = await repo.findOne({ where: { username: adminUsername } });
    if (exists) {
      console.log('Admin user already exists, skipping seed.');
      await app.close();
      return;
    }

    const hashed = await bcrypt.hash(adminPassword, 10);
    const user = repo.create({
      username: adminUsername,
      email: adminEmail,
      password: hashed,
      role: 'admin',
    } as Partial<User>);
    await repo.save(user);
    console.log('Admin user created:', adminUsername);
  } catch (err) {
    console.error('Seed admin error', err);
  } finally {
    await app.close();
  }
}

bootstrap();
