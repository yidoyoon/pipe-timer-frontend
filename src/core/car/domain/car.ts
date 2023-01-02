import { plainToClass } from 'class-transformer';
import { ulid } from 'ulid';

export class Car {
  private readonly _carId: string;
  private readonly _userId: string;
  private _carName: string;
  private _duration: number; // dayjs
  private _color: string;
  private _count: number;

  constructor(protected car: Partial<Car>) {
    if (car) {
      Object.assign(
        this,
        plainToClass(Car, car, {
          excludeExtraneousValues: false,
        })
      );
    }

    this._carId = car.carId || ulid();
    this._userId = car.userId || ulid();
    this._carName = car.carName || '';
    this._duration = car.duration || 1;
    this._color = car.color || '000000';
    this._count = car.count || 0;
  }

  get carId(): Readonly<string> {
    return this._carId;
  }

  get userId(): Readonly<string> {
    return this._userId;
  }

  get carName(): Readonly<string> {
    return this._carName;
  }

  set carName(newName: string) {
    this._carName = newName;
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
}
