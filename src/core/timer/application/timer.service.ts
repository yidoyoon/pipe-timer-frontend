import { ITimerRepository } from 'src/core/timer/domain/itimer.repository';
import { Timer } from 'src/core/timer/domain/timer.model';

export class TimerService {
  constructor(
    protected car: Timer,
    protected timefragRepository: ITimerRepository
  ) {}

  async createTimefrag(car: Timer) {
    await this.timefragRepository.saveTimefrag(car);
  }

  // TODO: show CarSet 추가

  async findCarByUserId() {
    return;
  }

  async findCarByCarName() {
    return;
  }

  async editCarName() {
    return;
  }

  async editCarColor() {
    return;
  }

  async editCarDuration() {
    return;
  }
}
