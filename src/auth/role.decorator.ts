import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user.entity';

export type allowedRoles = keyof typeof UserRole | 'any';

export const Role = (roles: allowedRoles[]) => SetMetadata('roles', roles);
