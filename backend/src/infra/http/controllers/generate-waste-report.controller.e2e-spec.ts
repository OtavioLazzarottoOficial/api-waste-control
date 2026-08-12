import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { setupE2E } from '../../../../test/setup-e2e';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { makeUser } from '../../../../test/factories/make-user';
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper';
import { Roles } from '@/domain/enterprise/entities/user';
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

describe('Generate Waste Report (E2E)', () => {
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

  test('[GET] /wastes/report', async () => {
    const user = await db.user.create({
      data: PrismaUserMapper.toPrisma(makeUser({ roles: Roles.ADMIN })),
    });

    const accessToken = jwt.sign({ sub: user.id, name: user.name, role: Roles.ADMIN, roles: Roles.ADMIN });

    const category = await db.category.create({
      data: PrismaCategoryMapper.toPrisma(makeCategory({ name: 'Legumes' })),
    });

    const food = await db.food.create({
      data: PrismaFoodMapper.toPrisma(
        makeFood({ name: 'Abóbora', categoryId: new UniqueEntityID(category.id) }),
      ),
    });

    const meal = await db.meal.create({
      data: PrismaMealMapper.toPrisma(
        makeMeal({ userId: new UniqueEntityID(user.id), date: new Date('2026-06-01') }),
      ),
    });

    const mealItem = await db.mealItem.create({
      data: PrismaMealItemMapper.toPrisma(
        makeMealItem({
          foodId: new UniqueEntityID(food.id),
          mealId: new UniqueEntityID(meal.id),
          quantityServed: 50,
          quantityConsumed: 40,
        }),
      ),
    });

    await db.waste.create({
      data: PrismaWasteMapper.toPrisma(
        makeWaste({
          mealItemId: new UniqueEntityID(mealItem.id),
          quantity: 10,
          createdAt: new Date('2026-06-02'),
        }),
      ),
    });

    const response = await request(app.getHttpServer())
      .get('/wastes/report')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        startDate: '2026-06-01',
        endDate: '2026-06-03',
      });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('application/pdf');
    expect(response.headers['content-disposition']).toContain('attachment');
    expect(response.headers['content-disposition']).toContain('relatorio-desperdicio');
    expect(response.body).toBeInstanceOf(Buffer);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('[GET] /wastes/report with invalid dates should return bad request', async () => {
    const user = await db.user.create({
      data: PrismaUserMapper.toPrisma(makeUser({ roles: Roles.ADMIN })),
    });

    const accessToken = jwt.sign({ sub: user.id, name: user.name, role: Roles.ADMIN, roles: Roles.ADMIN });

    const response = await request(app.getHttpServer())
      .get('/wastes/report')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        startDate: '2026-06-05',
        endDate: '2026-06-03',
      });

    expect(response.statusCode).toBe(400);
  });

  test('[GET] /wastes/report as an employee should return 403 Forbidden', async () => {
    const user = await db.user.create({
      data: PrismaUserMapper.toPrisma(makeUser({ roles: Roles.EMPLOYEE })),
    });

    const accessToken = jwt.sign({ sub: user.id, name: user.name, role: Roles.EMPLOYEE, roles: Roles.EMPLOYEE });

    const response = await request(app.getHttpServer())
      .get('/wastes/report')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        startDate: '2026-06-01',
        endDate: '2026-06-03',
      });

    expect(response.statusCode).toBe(403);
  });
});
