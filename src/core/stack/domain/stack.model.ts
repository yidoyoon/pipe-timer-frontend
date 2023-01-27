import { plainToClass } from 'class-transformer';
import { ITimer } from 'src/core/timer/domain/timer.model';
import { ulid } from 'ulid';

export interface IStack {
  _id: string;
  _name: string;
  _count: number;
  _data: ITimer[];
  _isEditing: boolean;
}

export class Stacks implements IStack {
  _id: string;
  _name: string;
  _count: number;
  _data: ITimer[];
  _isEditing: boolean;

  constructor(stacks: Partial<Stacks>) {
    if (stacks) {
      Object.assign(
        this,
        plainToClass(Stacks, stacks, {
          excludeExtraneousValues: false,
        })
      );
      this._id = stacks.id || ulid();
      this._name = stacks.name || 'Stack';
      this._count = stacks.count || 0;
      this._data = stacks._data || [];
      this._isEditing = stacks.isEditing || false;
    }
  }

  get id(): Readonly<string> {
    return this._id;
  }

  get name(): Readonly<string> {
    return this._name;
  }

  set name(newName: string) {
    this._name = newName;
  }

  get count(): Readonly<number> {
    return this._count;
  }

  set count(newCount: number) {
    this._count = newCount;
  }

  get frags(): ITimer[] {
    return this._data;
  }

  set frags(newFrags: ITimer[]) {
    this._data = newFrags;
  }

  get isEditing(): Readonly<boolean> {
    return this._isEditing;
  }

  set isEditing(newValue: boolean) {
    this._isEditing = newValue;
  }
}
