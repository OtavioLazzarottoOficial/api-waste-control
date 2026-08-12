import { INestApplication } from '@nestjs/common';

import request from 'supertest';
import { setupE2E } from '../../../../test/setup-e2e';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { makeUser } from '../../../../test/factories/make-user';
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper';
import { UniqueEntityID } from '../../../core/entities/unique-entity-id';
import { makeMeal } from '../../../../test/factories/make-meal';
import { PrismaMealMapper } from '@/infra/database/prisma/mappers/prisma-meal-mapper';
import { PrismaCategoryMapper } from '@/infra/database/prisma/mappers/prisma-category-mapper';
import { PrismaFoodMapper } from '@/infra/database/prisma/mappers/prisma-food-mapper';
import { PrismaMealItemMapper } from '@/infra/database/prisma/mappers/prisma-meal-item-mapper';
import { makeCategory } from '../../../../test/factories/make-category';
import { makeFood } from '../../../../test/factories/make-food';
import { makeMealItem } from '../../../../test/factories/make-meal-item';

describe('Get meal item by id (E2E)', () => {
  let app: INestApplication;
  let teardown: () => Promise<void>;
  let db: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const setup = await setupE2E();
    app = setup.app;
    db = setup.db;
    jwt = setup.jwt;
    teardown = setup.teardown;
  });

  afterAll(async () => {
    if (teardown) {
      await teardown();
    }
  });

  test('[Get] /mealItems/:id', async () => {
    const user = await db.user.create({
      data: PrismaUserMapper.toPrisma(makeUser()),
    });

    const accessToken = jwt.sign({ sub: user.id });

    const category = await db.category.create({
      data: PrismaCategoryMapper.toPrisma(makeCategory()),
    });

    const food = await db.food.create({
      data: PrismaFoodMapper.toPrisma(
        makeFood({ categoryId: new UniqueEntityID(category.id) }),
      ),
    });

    const meal = await db.meal.create({
      data: PrismaMealMapper.toPrisma(
        makeMeal({ userId: new UniqueEntityID(user.id) }),
      ),
    });

    const mealItem = await db.mealItem.create({
      data: PrismaMealItemMapper.toPrisma(
        makeMealItem({
          foodId: new UniqueEntityID(food.id),
          mealId: new UniqueEntityID(meal.id),
        }),
      ),
    });

    const response = await request(app.getHttpServer())
      .get(`/mealItems/${mealItem.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);

    const mealItemOnDatabase = await db.mealItem.findUnique({
      where: {
        id: mealItem.id,
      },
    });

    expect(mealItemOnDatabase).toBeTruthy();
  });
});
