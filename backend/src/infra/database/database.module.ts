import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaCategoriesRepository } from './prisma/repositories/prisma-categories-repository';
import { PrismaFoodsRepository } from './prisma/repositories/prisma-foods-repository';
import { PrismaMealItensRepository } from './prisma/repositories/prisma-meal-itens-repository';
import { PrismaMealsRepository } from './prisma/repositories/prisma-meals-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { PrismaWastesRepository } from './prisma/repositories/prisma-wastes-repository';
import { CategoriesRepository } from '@/domain/application/repositories/categories-repository';
import { FoodsRepository } from '@/domain/application/repositories/foods-repository';
import { MealItensRepository } from '@/domain/application/repositories/meal-item-repository';
import { MealsRepository } from '@/domain/application/repositories/meals-repository';
import { UsersRepository } from '@/domain/application/repositories/users-repository';
import { WastesRepository } from '@/domain/application/repositories/wastes-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: CategoriesRepository,
      useClass: PrismaCategoriesRepository,
    },
    {
      provide: FoodsRepository,
      useClass: PrismaFoodsRepository,
    },
    {
      provide: MealItensRepository,
      useClass: PrismaMealItensRepository,
    },
    {
      provide: MealsRepository,
      useClass: PrismaMealsRepository,
    },
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: WastesRepository,
      useClass: PrismaWastesRepository,
    },
  ],
  exports: [
    PrismaService,
    CategoriesRepository,
    FoodsRepository,
    MealItensRepository,
    MealsRepository,
    UsersRepository,
    WastesRepository,
  ],
})
export class DatabaseModule {}
