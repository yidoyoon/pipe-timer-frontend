import { plainToClass } from 'class-transformer';
import { ulid } from 'ulid';

export interface ITimer {
  readonly _id: string;
  _name: string;
  _color: string;
  _duration: number; // dayjs
  _count: number;
  _isEditing: boolean;
}

export class Timer implements ITimer {
  readonly _id: string;
  _name: string;
  _color: string;
  _duration: number; // dayjs
  _count: number;
  _isEditing: boolean;

  constructor(timer: Partial<Timer>) {
    if (timer) {
      Object.assign(
        this,
        plainToClass(Timer, timer, {
          excludeExtraneousValues: false,
        })
      );
      this._id = timer.id || ulid();
      this._name = timer.name || 'New';
      this._color = timer.color || '000000';
      this._duration = timer.duration || 1;
      this._count = timer.count || 0;
      this._isEditing = timer.isEditing || false;
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
