import { Waste } from '@/domain/enterprise/entities/waste';

export class WastePresenter {
  static toHttp(waste: Waste) {
    return {
      id: waste.id.toString(),
      mealItemId: waste.mealItemId.toString(),
      quantity: waste.quantity,
      reason: waste.reason,
      createdAt: waste.createdAt,
      updatedAt: waste.updatedAt,
    };
  }
}
