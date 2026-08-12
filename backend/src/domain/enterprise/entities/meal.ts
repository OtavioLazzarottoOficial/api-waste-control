import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { MealItem } from './meal-item';

export enum TurnsType {
  AFTERNOON = 'Almoco',
  DINNER = 'Janta',
}

export interface MealProps {
  date: Date;
  turn: TurnsType;
  userId: UniqueEntityID;
  mealItems?: MealItem[];
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Meal extends Entity<MealProps> {
  get date() {
    return this.props.date;
  }

  set date(date: Date) {
    this.props.date = date;
    this.touch();
  }

  get turn() {
    return this.props.turn;
  }

  set turn(turn: TurnsType) {
    this.props.turn = turn;
    this.touch();
  }

  get userId() {
    return this.props.userId;
  }

  get mealItems() {
    return this.props.mealItems;
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

  static create(props: Optional<MealProps, 'createdAt'>, id?: UniqueEntityID) {
    const meal = new Meal(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return meal;
  }
}
