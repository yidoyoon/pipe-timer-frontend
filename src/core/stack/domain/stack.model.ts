import { plainToClass } from 'class-transformer';
import { IStacksToFrag } from 'src/core/timer/domain/timer.model';
import { ulid } from 'ulid';

export interface IStack {
  id: string;
  name: string;
  count: number;
  stacksToFrag: IStacksToFrag[];
  isEditing: boolean;
}

export class Stack implements IStack {
  id: string;
  name: string;
  count: number;
  stacksToFrag: IStacksToFrag[];
  isEditing: boolean;

  constructor(stacks: Partial<Stack>) {
    if (stacks) {
      Object.assign(
        this,
        plainToClass(Stack, stacks, {
          excludeExtraneousValues: false,
        })
      );
      this.id = stacks.id || ulid();
      this.name = stacks.name || 'Stack';
      this.count = stacks.count || 0;
      this.stacksToFrag = stacks.stacksToFrag || [];
      this.isEditing = stacks.isEditing || false;
    }
  }

  // get id(): Readonly<string> {
  //   return this._id;
  // }
  //
  // get name(): Readonly<string> {
  //   return this._name;
  // }
  //
  // set name(newName: string) {
  //   this._name = newName;
  // }
  //
  // get count(): Readonly<number> {
  //   return this._count;
  // }
  //
  // set count(newCount: number) {
  //   this._count = newCount;
  // }
  //
  // get frags(): ITimer[] {
  //   return this._timers;
  // }
  //
  // set frags(newFrags: ITimer[]) {
  //   this._timers = newFrags;
  // }
  //
  // get isEditing(): Readonly<boolean> {
  //   return this._isEditing;
  // }
  //
  // set isEditing(newValue: boolean) {
  //   this._isEditing = newValue;
  // }
}
