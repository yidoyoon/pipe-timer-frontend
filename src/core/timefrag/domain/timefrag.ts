import { plainToClass } from 'class-transformer';
import { ulid } from 'ulid';

export interface ITimefrag {
  readonly _id: string;
  _name: string;
  _color: string;
  _duration: number; // dayjs
  _count: number;
  _isEditing: boolean;
}

export class Timefrag implements ITimefrag {
  readonly _id: string;
  _name: string;
  _color: string;
  _duration: number; // dayjs
  _count: number;
  _isEditing: boolean;

  constructor(timefrag: Partial<Timefrag>) {
    if (timefrag) {
      Object.assign(
        this,
        plainToClass(Timefrag, timefrag, {
          excludeExtraneousValues: false,
        })
      );
      this._id = timefrag.id || ulid();
      this._name = timefrag.name || 'New_timer';
      this._color = timefrag.color || '000000';
      this._duration = timefrag.duration || 1;
      this._count = timefrag.count || 0;
      this._isEditing = timefrag.isEditing || false;
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

  get duration(): Readonly<number> {
    return this._duration;
  }

  set duration(newDuration: number) {
    this._duration = newDuration;
  }

  get color(): Readonly<string> {
    return this._color;
  }

  set color(newColor: string) {
    this._color = newColor;
  }

  get count(): Readonly<number> {
    return this._count;
  }

  set count(newCount: number) {
    this._count = newCount;
  }

  get isEditing(): Readonly<boolean> {
    return this._isEditing;
  }

  set isEditing(newValue: boolean) {
    this._isEditing = newValue;
  }
}
