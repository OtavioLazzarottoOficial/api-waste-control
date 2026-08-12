import { Module } from '@nestjs/common';
import { AuthenticateController } from './controllers/authenticate-controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { FetchRecentCategoriesController } from './controllers/fetch-recent-categories.controller';
import { DatabaseModule } from '../database/database.module';
import { CreateCategoryUseCase } from '@/domain/application/use-cases/create-category';
import { CreateCategoryController } from './controllers/create-category.controller';
import { CreateFoodController } from './controllers/create-food.controller';
import { CreateFoodUseCase } from '@/domain/application/use-cases/create-food';
import { FetchRecentCategoriesUseCase } from '@/domain/application/use-cases/fetch-recent-categories';
import { FetchRecentFoodsController } from './controllers/fetch-recent-foods.controller';
import { FetchRecentFoodsUseCase } from '@/domain/application/use-cases/fetch-recent-foods';
import { AuthenticateUserUseCase } from '@/domain/application/use-cases/authenticate-user';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { CreateUserUseCase } from '@/domain/application/use-cases/create-user';
import { CreateMealUseCase } from '@/domain/application/use-cases/create-meal';
import { CreateMealController } from './controllers/create-meal-controller';
import { CreateMealItemController } from './controllers/create-meal-item.controller';
import { CreateWasteController } from './controllers/create-waste.controller';
import { CreateMealItemUseCase } from '@/domain/application/use-cases/create-meal-item';
import { CreateWasteUseCase } from '@/domain/application/use-cases/create-waste';
import { FetchRecentMealsController } from './controllers/fetch-recent-meals.controller';
import { FetchRecentMealsUseCase } from '@/domain/application/use-cases/fetch-recent-meals';
import { FetchRecentMealItensController } from './controllers/fetch-recent-meal-Itens.controller';
import { FetchRecentWastesController } from './controllers/fetch-recent-wastes.controller';
import { FetchRecentMealItensUseCase } from '@/domain/application/use-cases/fetch-recent-meal-itens';
import { FetchRecentWastesUseCase } from '@/domain/application/use-cases/fetch-recent-wastes';
import { GetByIdCategoryController } from './controllers/get-by-id-category.controller';
import { GetCategoryByIdUseCase } from '@/domain/application/use-cases/get-by-id-category';
import { GetByIdFoodController } from './controllers/get-by-id-food.controller';
import { GetFoodByIdUseCase } from '@/domain/application/use-cases/get-by-id-food';
import { GetByIdMealController } from './controllers/get-by-id-meal.controller';
import { GetByIdMealItemController } from './controllers/get-by-id-meal-item.controller';
import { GetByIdWasteController } from './controllers/get-by-id-waste.controller';
import { GetMealByIdUseCase } from '@/domain/application/use-cases/get-by-id-meal';
import { GetMealItemByIdUseCase } from '@/domain/application/use-cases/get-by-id-meal-item';
import { GetWasteByIdUseCase } from '@/domain/application/use-cases/get-by-id-waste';
import { DeleteCategoryController } from './controllers/delete-category.controller';
import { DeleteCategoryUseCase } from '@/domain/application/use-cases/delete-category';
import { DeleteFoodController } from './controllers/delete-food.controller';
import { DeleteMealController } from './controllers/delete-meal.controller';
import { DeleteMealItemController } from './controllers/delete-meal-item.controller';
import { DeleteWasteController } from './controllers/delete-waste.controller';
import { DeleteFoodUseCase } from '@/domain/application/use-cases/delete-food';
import { DeleteMealUseCase } from '@/domain/application/use-cases/delete-meal';
import { DeleteMealItemUseCase } from '@/domain/application/use-cases/delete-meal-item';
import { DeleteWasteUseCase } from '@/domain/application/use-cases/delete-waste';
import { EditCategoryController } from './controllers/edit-category.controller';
import { EditCategoryUseCase } from '@/domain/application/use-cases/edit-category';
import { EditFoodUseCase } from '@/domain/application/use-cases/edit-food';
import { EditFoodController } from './controllers/edit-food.controller';
import { EditMealController } from './controllers/edit-meal-controller';
import { EditMealUseCase } from '@/domain/application/use-cases/edit-meal';
import { EditMealItemController } from './controllers/edit-meal-item.controller';
import { EditMealItemUseCase } from '@/domain/application/use-cases/edit-meal-item';
import { EditWasteController } from './controllers/edit-waste.controller';
import { EditWasteUseCase } from '@/domain/application/use-cases/edit-waste';
import { FetchMealItemsByMealIdController } from './controllers/fetch-meal-items-by-meal-id.controller';
import { FetchMealItemsByMealIdUseCase } from '@/domain/application/use-cases/fetch-meal-items-by-meal-id';
import { GenerateWasteReportController } from './controllers/generate-waste-report.controller';
import { GenerateWasteReportUseCase } from '@/domain/application/use-cases/generate-waste-report';
import { PdfGenerator } from '@/domain/application/services/pdf-generator';
import { PdfKitGenerator } from '../services/pdfkit-generator';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    FetchRecentCategoriesController,
    CreateCategoryController,
    CreateFoodController,
    FetchRecentFoodsController,
    CreateMealController,
    CreateMealItemController,
    CreateWasteController,
    FetchRecentMealsController,
    FetchRecentMealItensController,
    GenerateWasteReportController,
    FetchRecentWastesController,
    GetByIdCategoryController,
    GetByIdFoodController,
    GetByIdMealController,
    GetByIdMealItemController,
    GetByIdWasteController,
    DeleteCategoryController,
    DeleteFoodController,
    DeleteMealController,
    DeleteMealItemController,
    DeleteWasteController,
    EditCategoryController,
    EditFoodController,
    EditMealController,
    EditMealItemController,
    EditWasteController,
    FetchMealItemsByMealIdController,
  ],

  providers: [
    CreateCategoryUseCase,
    CreateFoodUseCase,
    FetchRecentCategoriesUseCase,
    FetchRecentFoodsUseCase,
    AuthenticateUserUseCase,
    CreateUserUseCase,
    CreateMealUseCase,
    CreateMealItemUseCase,
    CreateWasteUseCase,
    FetchRecentMealsUseCase,
    FetchRecentMealItensUseCase,
    FetchRecentWastesUseCase,
    GetCategoryByIdUseCase,
    GetFoodByIdUseCase,
    GetMealByIdUseCase,
    GetMealItemByIdUseCase,
    GetWasteByIdUseCase,
    DeleteCategoryUseCase,
    DeleteFoodUseCase,
    DeleteMealUseCase,
    DeleteMealItemUseCase,
    DeleteWasteUseCase,
    EditCategoryUseCase,
    EditFoodUseCase,
    EditMealUseCase,
    EditMealItemUseCase,
    EditWasteUseCase,
    FetchMealItemsByMealIdUseCase,
    GenerateWasteReportUseCase,
    {
      provide: PdfGenerator,
      useClass: PdfKitGenerator,
    },
  ],
})
export class HttpModule {}
