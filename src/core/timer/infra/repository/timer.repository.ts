import { ITimerRepository } from 'src/core/timer/domain/itimer.repository';
import { Timer } from 'src/core/timer/domain/timer.model';

export class TimerRepository implements ITimerRepository {
  // carStore = useCarStore();

  async getTimefragByUserId(userId: string): Promise<void> {
    // return this.carStore.fetchAll(userId);
  }

  async saveTimefrag(car: Timer): Promise<void> {
    return Promise.resolve(undefined);
  }

  async editTimefrag(criteria: object, partialEntity: object): Promise<void> {
    return Promise.resolve(undefined);
  }
}
