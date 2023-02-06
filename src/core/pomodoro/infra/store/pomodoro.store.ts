import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { IStack } from 'src/core/stack/domain/stack.model';
import { ITimer } from 'src/core/timer/domain/timer.model';

export interface PomodoroState {
  timer: ITimer;
  stack: IStack;
  mode: string; // 'stack', 'timer', ''
  amount: number;
  round: number;
  state: string; // 'start', 'pause', 'stop', ''
}

export const usePomodoroStore = defineStore('PomodoroStore', {
  state: (): PomodoroState => {
    return {
      timer: {} as ITimer,
      stack: {} as IStack,
      mode: '',
      amount: 0,
      round: 0,
      state: '',
    };
  },
  persist: {
    key: 'pomodoro-data',
    storage: {
      getItem: (key) => {
        return LocalStorage.getItem(key);
      },
      setItem: (key, value) => {
        return LocalStorage.set(key, value);
      },
    },
    beforeRestore: (ctx) => {
      console.log(`about to restore '${ctx.store.$id}'`);
    },
  },
  getters: {
    // TODO: 비동기 타이머 기능 추가(다수의 타이머를 개별적으로 실행시킴)
    getTotalDuration(): number {
      let total = 0;
      if (this.mode === 'stack') {
        this.stack.stacksToFrag.forEach((e) => {
          total += e.frag.duration as number;
        });
      } else {
        total = this.timer.duration;
      }
      return total;
    },

    getCurrentDuration(): number {
      const round = this.round;
      let res = 0;
      if (this.mode === 'stack') {
        res = this.stack.stacksToFrag[round].frag.duration;
      } else {
        res = this.timer.duration;
      }
      return res;
    },
  },
  actions: {},
});
