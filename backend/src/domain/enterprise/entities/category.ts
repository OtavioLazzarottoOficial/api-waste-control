import { Entity } from '@/core/entities/entity';
import { Optional } from '../../../core/types/optional';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface CategoryProps {
  name: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Category extends Entity<CategoryProps> {
  get name() {
    return this.props.name;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<CategoryProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const category = new Category(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return category;
  }
}
