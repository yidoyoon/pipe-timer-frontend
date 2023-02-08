import { api } from 'boot/axios';
import { defineStore } from 'pinia';
import { useSelectorStore } from 'src/core/common/infra/store/selector.store';
import { ITimer } from 'src/core/timer/domain/timer.model';
import { LocalStorage } from 'quasar';
import { Notify } from 'quasar';

export interface TimerState {
  timers: Record<string, ITimer>;
  timerIds: string[];
  isLoadingTimer: boolean;
}

const selectorStore = useSelectorStore();

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
    listTimersMap(): ITimer[] {
      return this.timerIds.map((i) => this.timers[i]);
    },

    listTimers(): ITimer[] {
      const result = [] as ITimer[];
      this.timerIds.forEach((e) => {
        result.push(this.timers[e]);
      });
      return result;
    },

    loadedTimers(): boolean {
      return this.timerIds.length > 0;
    },

    // isEditingTimers(): boolean {
    //   let filtered;
    //   if (!this.isLoadingTimer) {
    //     filtered = this.listTimersMap.find((obj) => {
    //       return obj.isEditing;
    //     });
    //   }
    //
    //   return filtered !== null;
    // },

    // canSaveTimers(): boolean {
    //   return !(this.isLoadingTimer || this.isEditingTimers);
    // },
  },

  // TODO: URL frag에서 timer로 변경
  actions: {
    async fetchAll() {
      if (this.loadedTimers) return;
      this.isLoadingTimer = true;
      // TODO: 에러 처리 필요
      const res = await api.get('frag/fetch');

      const timers = res.data;
      this.isLoadingTimer = false;

      this.timerIds = timers.map((timer: ITimer) => {
        this.timers[timer.fragId] = timer;
        return timer.fragId;
      });
      // this.setInitialState();
    },

    add(newTimer: ITimer) {
      this.timers[newTimer.fragId] = newTimer;
      this.timerIds.push(newTimer.fragId);
    },

    edit(newTimer: ITimer) {
      this.timers[newTimer.fragId] = newTimer;
    },

    remove(timerId: string) {
      const target = this.timers[timerId];
      if (!!target) {
        delete this.timers[timerId];
        const i = this.timerIds.lastIndexOf(timerId);
        if (i > -1) this.timerIds.splice(i, 1);
      }
    },

    updateList(newTimers: ITimer[]) {
      // update timers map
      const updatedTimers = {} as Record<string, ITimer>;
      newTimers.forEach((timer) => {
        updatedTimers[timer.fragId] = timer;
      });
      this.timers = updatedTimers;

      // update timer ids
      this.timerIds = newTimers.map((timer) => timer.fragId);
    },

    setInitialState() {
      LocalStorage.set('timers', JSON.stringify(this.$state));
    },

    getInitState(): TimerState | null {
      return LocalStorage.getItem('timers');
    },

    reset() {
      this.$reset();
    },

    // toBuilder(timer: ITimer) {
    //   try {
    //     const builderStore = useBuilderStore();
    //     builderStore.stackInBuilder.stacksToFrag.frag = timer;
    //   } catch (err) {
    //     console.log(err);
    //   }
    // },

    saveTimer() {
      const res = api.post('frag/save', this.listTimers);
      if (!res) {
        Notify.create({
          message:
            '저장이 완료되지 않았습니다. 인터넷 연결 상태를 확인해주세요',
          color: 'negative',
        });
      } else {
        // TODO: Stack 저장 이후 자동으로 저장을 수행할 땐 Notify가 작동하지 않도록 수정
        // Notify.create({
        //   message: '저장을 완료했습니다.',
        //   color: 'positive',
        // });
        selectorStore.editNow = '';
      }
      // this.setInitialState();
    },
  },
});
