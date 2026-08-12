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

describe('Edit Meal (E2E)', () => {
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

  test('[PUT] /meals/:id', async () => {
    const user = await db.user.create({
      data: PrismaUserMapper.toPrisma(makeUser()),
    });

    const accessToken = jwt.sign({ sub: user.id });

    const meal = await db.meal.create({
      data: PrismaMealMapper.toPrisma(makeMeal({ 
        userId: new UniqueEntityID(user.id), 
        date: new Date('2026-01-23T00:00:00.000Z') },)),
    });

    const response = await request(app.getHttpServer())
      .put(`/meals/${meal.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        date: new Date('2026-01-24T00:00:00.000Z')
      });

      

    expect(response.statusCode).toBe(204);

    const mealOnDatabase = await db.meal.findUnique({
      where: {
        id: meal.id
      },
    })

    // console.log(mealOnDatabase)

    expect(mealOnDatabase).toEqual(
      expect.objectContaining({
        date: new Date('2026-01-24T00:00:00.000Z')
    })
    )
  });
});
