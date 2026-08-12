import { INestApplication } from '@nestjs/common';

import request from 'supertest';
import { setupE2E } from '../../../../test/setup-e2e';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { makeUser } from '../../../../test/factories/make-user';
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper';
import { makeMeal } from '../../../../test/factories/make-meal';
import { PrismaMealMapper } from '@/infra/database/prisma/mappers/prisma-meal-mapper';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

describe('Create Meal (E2E)', () => {
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

  test('[POST] /meals', async () => {
    const user = await db.user.create({
      data: PrismaUserMapper.toPrisma(makeUser()),
    });

    const accessToken = jwt.sign({ sub: user.id });

    const meal = await db.meal.create({
      data: PrismaMealMapper.toPrisma(makeMeal({ userId: new UniqueEntityID(user.id) })),
    });

    const response = await request(app.getHttpServer())
      .post('/meals')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(meal);

    expect(response.statusCode).toBe(201);

    const mealOnDatabase = await db.meal.findFirst({
      where: {
        date: meal.date,
      },
    })

    expect(mealOnDatabase).toBeTruthy()
  });
});
