import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { Customer } from '../customers/entities/customer.entity';
import {PassportModule} from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Customer]),
    PassportModule.register({ defaultStrategy: 'jwt' }), // <---- enable passport with default jwt strategy
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET') || '516b508ace08b91b46ed9b88b9ef0361';
        console.log('>>> JwtModule initialized with secret:', secret);
        return {
          secret,
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], //register JwtStrategy
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
