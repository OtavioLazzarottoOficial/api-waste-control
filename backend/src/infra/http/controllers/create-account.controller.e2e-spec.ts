import { INestApplication } from '@nestjs/common';

import request from 'supertest';
import { setupE2E } from '../../../../test/setup-e2e';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Create account (E2E)', () => {
  let app: INestApplication;
  let teardown: () => Promise<void>;
  let db: PrismaService;

  beforeAll(async () => {
    const setup = await setupE2E();
    app = setup.app;
    db = setup.db;
    teardown = setup.teardown;
  });

  afterAll(async () => {
    if (teardown) {
      await teardown();
    }
  });

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'otavio',
      email: 'otavio01@test.com',
      password: '123456',
      roles: 'EMPLOYEE',
    });

    expect(response.statusCode).toBe(201);

    const userOnDatabase = await db.user.findUnique({
      where: {
        email: 'otavio01@test.com',
      },
    });

    expect(userOnDatabase).toBeTruthy()
  });
});
