// auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET') || '516b508ace08b91b46ed9b88b9ef0361';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // must match JwtModule secret
    });
    console.log('>>> JwtStrategy initialized with secret:', secret);
  }

  async validate(payload: any) {
    // This will be available as request.user
    console.log('>>> JwtStrategy.validate() called with payload:', payload);
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
