import { INestApplication } from '@nestjs/common';

import request from 'supertest';
import { setupE2E } from '../../../../test/setup-e2e';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { makeUser } from '../../../../test/factories/make-user';
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeMealItem } from '../../../../test/factories/make-meal-item';
import { PrismaMealItemMapper } from '@/infra/database/prisma/mappers/prisma-meal-item-mapper';
import { PrismaFoodMapper } from '@/infra/database/prisma/mappers/prisma-food-mapper';
import { makeFood } from '../../../../test/factories/make-food';
import { PrismaMealMapper } from '@/infra/database/prisma/mappers/prisma-meal-mapper';
import { makeMeal } from '../../../../test/factories/make-meal';
import { PrismaCategoryMapper } from '@/infra/database/prisma/mappers/prisma-category-mapper';
import { makeCategory } from '../../../../test/factories/make-category';
import { PrismaWasteMapper } from '@/infra/database/prisma/mappers/prisma-waste-mapper';
import { makeWaste } from '../../../../test/factories/make-waste';

describe('Create Waste (E2E)', () => {
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

  test('[POST] /wastes', async () => {

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

    const waste = await db.waste.create({
      data: PrismaWasteMapper.toPrisma(
        makeWaste({
         mealItemId:  new UniqueEntityID(mealItem.id)
        }),
      ),
    });

    const response = await request(app.getHttpServer())
      .post('/wastes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(waste);


    expect(response.statusCode).toBe(201);

    const wasteOnDatabase = await db.waste.findFirst({
      where: {
        id: waste.id,
      },
    });

    expect(wasteOnDatabase).toBeTruthy();
  });
});
