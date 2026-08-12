import { INestApplication } from '@nestjs/common';

import request from 'supertest';
import { setupE2E } from '../../../../test/setup-e2e';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { makeUser } from '../../../../test/factories/make-user';
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper';
import { PrismaCategoryMapper } from '@/infra/database/prisma/mappers/prisma-category-mapper';
import { makeCategory } from '../../../../test/factories/make-category';

describe('Edit category (E2E)', () => {
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

  test('[PUT] /categories/:id', async () => {

    const user = await db.user.create({
      data: PrismaUserMapper.toPrisma(makeUser()),
    });

    const accessToken = jwt.sign({ sub: user.id });

    const category = await db.category.create({
      data: PrismaCategoryMapper.toPrisma(makeCategory({
        name: 'Frutas'
      }))
    })
  
    const response = await request(app.getHttpServer())
      .put(`/categories/${category.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Carne',
      });

    expect(response.statusCode).toBe(204);


    const categoryOnDatabase = await db.category.findUnique({
      where: {
        id: category.id
      }
    })

    expect(categoryOnDatabase).toEqual(
      expect.objectContaining({name: 'Carne'})
    )
  });
});
