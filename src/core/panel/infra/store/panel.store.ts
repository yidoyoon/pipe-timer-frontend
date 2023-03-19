import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { IRoutine } from 'src/core/routines/domain/routine.model';
import { ITimer } from 'src/core/timers/domain/timer.model';

export interface PomodoroState {
  timer: ITimer;
  routine: IRoutine;
  mode: string; // 'routine', 'timer', ''
  amount: number;
  round: number;
  state: string; // 'start', 'pause', 'stop', ''
}

export const usePanelStore = defineStore('PanelStore', {
  state: (): PomodoroState => {
    return {
      timer: {} as ITimer,
      routine: {} as IRoutine,
      mode: '',
      amount: 0,
      round: 0,
      state: '',
    };
  },
  persist: {
    key: 'panel-data',
    storage: {
      getItem: (key) => {
        return LocalStorage.getItem(key);
      },
      setItem: (key, value) => {
        return LocalStorage.set(key, value);
      },
    },
    beforeRestore: (ctx) => {
      // TODO: 데이터 무결성 검사 추가
    },
  },
  getters: {
    // TODO: 비동기 타이머 기능 추가(다수의 타이머를 개별적으로 실행시킴)
    getTotalDuration(): number {
      let total = 0;
      if (this.mode === 'routine') {
        this.routine.routineToTimer.forEach((e) => {
          total += e.timer.duration;
        });
      } else {
        total = this.timer.duration;
      }
      return total;
    },

    getCurrentDuration(): number {
      const currentRound = this.round;
      let duration = this.timer.duration;
      if (this.routine.routineToTimer?.[currentRound]) {
        duration = this.routine.routineToTimer[currentRound].timer.duration;
      }
      return duration;
    },
  },
  actions: {},
});
