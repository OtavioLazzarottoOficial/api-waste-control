import { INestApplication } from '@nestjs/common';

import request from 'supertest';
import { setupE2E } from '../../../../test/setup-e2e';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { makeUser } from '../../../../test/factories/make-user';
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper';
import { PrismaCategoryMapper } from '@/infra/database/prisma/mappers/prisma-category-mapper';
import { makeCategory } from '../../../../test/factories/make-category';

describe('Fetch recent category (E2E)', () => {
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

  test('[Get] /categories', async () => {
    const user = await db.user.create({
      data: PrismaUserMapper.toPrisma(makeUser()),
    });

    const accessToken = jwt.sign({ sub: user.id });

    await db.category.createMany({
      data: [
        PrismaCategoryMapper.toPrisma(makeCategory({ name: 'Carnes' })),
        PrismaCategoryMapper.toPrisma(makeCategory({ name: 'Frutas' })),
      ],
    });

    const response = await request(app.getHttpServer())
      .get(`/categories`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      categories: expect.arrayContaining([
        expect.objectContaining({ name: 'Carnes' }),
        expect.objectContaining({ name: 'Frutas' }),
      ]),
    });
  });
});
