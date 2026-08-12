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

describe('Fetch recent meal (E2E)', () => {
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

  test('[Get] /meals', async () => {
    const user = await db.user.create({
      data: PrismaUserMapper.toPrisma(makeUser()),
    });

    const accessToken = jwt.sign({ sub: user.id });

    await db.meal.createMany({
      data: [
        PrismaMealMapper.toPrisma(
          makeMeal({
            date: new Date('2026-01-17T00:00:00.000Z'),
            userId: new UniqueEntityID(user.id),
          }),
        ),
        PrismaMealMapper.toPrisma(
          makeMeal({
            date: new Date('2026-01-18T00:00:00.000Z'),
            userId: new UniqueEntityID(user.id),
          }),
        ),
      ],
    });

    const response = await request(app.getHttpServer())
      .get(`/meals`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      meals: expect.arrayContaining([
        expect.objectContaining({ date: '2026-01-17T00:00:00.000Z'}),
        expect.objectContaining({ date: '2026-01-18T00:00:00.000Z'})
      ]) ,
    });
  });
});
