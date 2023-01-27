import { api } from 'boot/axios';
import { defineStore } from 'pinia';
import { useStackStore } from 'src/core/stack/infra/store/stack.store.ts';
import { ITimer } from 'src/core/timer/domain/timer.model';
import { LocalStorage } from 'quasar';

export interface TimerState {
  timers: Record<string, ITimer>;
  timerIds: string[];
  isLoadingTimer: boolean;
}

const stacksStore = useStackStore();

export const useTimerStore = defineStore('timerStore', {
  state: (): TimerState => {
    return {
      timers: {},
      timerIds: [],
      isLoadingTimer: false,
    };
  },
  persist: {
    key: 'timer-data',
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
    listTimers(): ITimer[] {
      return this.timerIds.map((i) => this.timers[i]);
    },

    loadedTimers(): boolean {
      return this.timerIds.length > 0;
    },

    isEditingTimers(): boolean {
      let filtered;
      if (!this.isLoadingTimer) {
        filtered = this.listTimers.find((obj) => {
          return obj._isEditing;
        });
      }

      return filtered !== null;
    },

    canSaveTimers(): boolean {
      return !(this.isLoadingTimer || this.isEditingTimers);
    },
  },

  actions: {
    async fetchAll() {
      if (this.loadedTimers) return;
      this.isLoadingTimer = true;
      // TODO: 에러 처리 필요
      const res = await api.get('frag/fetch');
      const timers = res.data;
      this.isLoadingTimer = false;

      this.timerIds = timers.map((timer: ITimer) => {
        this.timers[timer._id] = timer;
        return timer._id;
      });
      this.setInitialState();
    },

    add(newTimer: ITimer) {
      this.timers[newTimer._id] = newTimer;
      this.timerIds.push(newTimer._id);
    },

    edit(newTimer: ITimer) {
      const trad = this.timers[newTimer._id];

      if (!!trad) {
        this.timers[newTimer._id] = newTimer;
      }
    },

    remove(timerId: string) {
      const target = this.timers[timerId];
      if (!!target) {
        delete this.timers[timerId];
        const i = this.timerIds.lastIndexOf(timerId);
        if (i > -1) this.timerIds.splice(i, 1);
      }
    },

    setInitialState() {
      LocalStorage.set('frags', JSON.stringify(this.$state));
    },

    getInitState(): TimerState | null {
      return LocalStorage.getItem('frags');
    },

    reset() {
      this.$reset();
    },

    toStack(timefrag: ITimer) {
      try {
        stacksStore.timersInStack.push(timefrag);
      } catch (err) {
        console.log(err);
      }
    },
  },
});
