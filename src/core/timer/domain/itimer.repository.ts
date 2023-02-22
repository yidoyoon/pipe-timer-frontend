import { Timer } from 'src/core/timer/domain/timer.model';

export interface ITimerRepository {
  getTimefragByUserId: (userId: string) => Promise<void>;
  saveTimefrag: (car: Timer) => Promise<void>;
  editTimefrag: (criteria: object, partialEntity: object) => Promise<void>;
}
