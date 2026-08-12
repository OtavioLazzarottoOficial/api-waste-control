import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { hash } from 'bcryptjs';
import { setupE2E } from '../../../../test/setup-e2e';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Authenticate (E2E)', () => {
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

  test('[POST] /sessions', async () => {
    await db.user.create({
      data: {
        name: 'otavio',
        email: 'otavio01@test.com',
        password: await hash('123456', 8),
        roles: 'EMPLOYEE',
      },
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'otavio01@test.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
