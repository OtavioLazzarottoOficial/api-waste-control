import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Roles, User } from '@/domain/enterprise/entities/user';
import {
  Prisma,
  User as PrismaUser,
  RolesType,
} from '@prisma/client';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser) {
    let domainRole: Roles;
    if (raw.roles === RolesType.ADMIN) {
      domainRole = Roles.ADMIN;
    } else {
      domainRole = Roles.EMPLOYEE;
    }

    return User.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        active: raw.active,
        roles: domainRole,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    let prismaRole: RolesType;
    if (user.roles === Roles.ADMIN) {
      prismaRole = RolesType.ADMIN;
    } else {
      prismaRole = RolesType.EMPLOYEE;
    }

    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      active: user.active,
      roles: prismaRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
