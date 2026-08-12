import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ReasonType } from '../waste';
import { TurnsType } from '../meal';

export interface WasteWithDetailsProps {
  wasteId: UniqueEntityID;
  quantity: number;
  reason: ReasonType;
  createdAt: Date;
  foodName: string;
  categoryName: string;
  mealDate: Date;
  mealTurn: TurnsType;
  quantityServed: number;
  quantityConsumed: number;
}

export class WasteWithDetails extends ValueObject<WasteWithDetailsProps> {
  get wasteId() {
    return this.props.wasteId;
  }

  get quantity() {
    return this.props.quantity;
  }

  get reason() {
    return this.props.reason;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get foodName() {
    return this.props.foodName;
  }

  get categoryName() {
    return this.props.categoryName;
  }

  get mealDate() {
    return this.props.mealDate;
  }

  get mealTurn() {
    return this.props.mealTurn;
  }

  get quantityServed() {
    return this.props.quantityServed;
  }

  get quantityConsumed() {
    return this.props.quantityConsumed;
  }

  static create(props: WasteWithDetailsProps) {
    return new WasteWithDetails(props);
  }
}
