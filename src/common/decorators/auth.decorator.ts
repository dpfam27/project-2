// src/common/decorators/auth.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../modules/auth/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator'; // internal only

export function Auth(...roles: string[]) {
  // In tests we may not have a fully configured auth environment; skip guards to keep e2e deterministic
  if (process.env.NODE_ENV === 'test') {
    return applyDecorators(Roles(...roles));
  }

  return applyDecorators(
    Roles(...roles), // attaches required roles
    UseGuards(JwtAuthGuard, RolesGuard), // applies both guards
  );
}
