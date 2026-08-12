import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export enum ReasonType {
  LEFTOVER = 'Sobrou',
  ITSPOILED = 'Estragou',
  ERROR_PREPARATION = 'Erro no Preparo',
}

export interface WasteProps {
  mealItemId: UniqueEntityID;
  quantity: number;
  reason: ReasonType;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Waste extends Entity<WasteProps> {
  get mealItemId() {
    return this.props.mealItemId;
  }

  set mealItemId(mealItemId: UniqueEntityID) {
    this.props.mealItemId = mealItemId;
    this.touch();
  }

  get quantity() {
    return this.props.quantity;
  }

  set quantity(quantity: number) {
    this.props.quantity = quantity;
    this.touch();
  }

  get reason() {
    return this.props.reason;
  }

  set reason(reason: ReasonType) {
    this.props.reason = reason;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<WasteProps, 'createdAt'>, id?: UniqueEntityID) {
    const waste = new Waste(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return waste;
  }
}
