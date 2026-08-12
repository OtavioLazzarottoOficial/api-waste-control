import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export enum Roles {
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN',
}

export interface UserProps {
  name: string;
  email: string;
  password: string;
  active: boolean;
  roles: Roles;
  createdAt: Date;
  updatedAt: Date | null;
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get roles() {
    return this.props.roles;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get active() {
    return this.props.active;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  disable() {
    this.props.active = false;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<UserProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityID) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
      },
      id,
    );
    return user;
  }
}
