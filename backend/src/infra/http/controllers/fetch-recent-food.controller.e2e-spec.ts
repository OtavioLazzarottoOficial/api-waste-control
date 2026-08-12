import { INestApplication } from '@nestjs/common';

import request from 'supertest';
import { setupE2E } from '../../../../test/setup-e2e';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { makeUser } from '../../../../test/factories/make-user';
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper';
import { makeFood } from '../../../../test/factories/make-food';
import { PrismaFoodMapper } from '@/infra/database/prisma/mappers/prisma-food-mapper';
import { PrismaCategoryMapper } from '@/infra/database/prisma/mappers/prisma-category-mapper';
import { makeCategory } from '../../../../test/factories/make-category';
import { UniqueEntityID } from '../../../core/entities/unique-entity-id';

describe('Fetch recent foods (E2E)', () => {
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

  test('[Get] /foods', async () => {
    const user = await db.user.create({
      data: PrismaUserMapper.toPrisma(makeUser()),
    });

    const accessToken = jwt.sign({ sub: user.id });

    const category = await db.category.create({
      data: PrismaCategoryMapper.toPrisma(makeCategory()),
    });

    await db.food.createMany({
      data: [
        PrismaFoodMapper.toPrisma(
          makeFood({
            name: 'Frango',
            categoryId: new UniqueEntityID(category.id),
          }),
        ),
        PrismaFoodMapper.toPrisma(
          makeFood({
            name: 'Maca',
            categoryId: new UniqueEntityID(category.id),
          }),
        ),
      ],
    });

    const response = await request(app.getHttpServer())
      .get(`/foods`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      foods: expect.arrayContaining([
        expect.objectContaining({ name: 'Frango' }),
        expect.objectContaining({ name: 'Maca' }),
      ]),
    });
  });
});
