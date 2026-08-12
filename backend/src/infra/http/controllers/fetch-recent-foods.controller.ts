import { ApiTags } from '@nestjs/swagger';
import {
  BadGatewayException,
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { FetchRecentFoodsUseCase } from '@/domain/application/use-cases/fetch-recent-foods';
import { FoodPresenter } from '../presenters/food-presenter';
import { Public } from '@/infra/auth/public';

const pageQueryParamSchema = z.coerce.number().min(1).default(1);

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/foods')
@Public()
@ApiTags('Foods')
export class FetchRecentFoodsController {
  constructor(private fetchRecentFoods: FetchRecentFoodsUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchRecentFoods.execute({
      page,
    });

    if (result.isLeft()) {
      throw new BadGatewayException();
    }

    const foods = result.value.foods;

    console.log(foods);

    return { foods: foods.map(FoodPresenter.toHttp) };
  }
}
