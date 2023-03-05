import { api } from 'boot/axios';
import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { IStack, Stack } from 'src/core/stack/domain/stack.model';
import { IStacksToFrag } from 'src/core/timer/domain/timer.model';
import { useTimerStore } from 'src/core/timer/infra/store/timer.store';
import { Notify } from 'quasar';
import { isEmptyObj } from 'src/util/is-empty-object.util';

export interface BuilderState {
  stackInBuilder: IStack;
}

const timerStore = useTimerStore();

export const useBuilderStore = defineStore('BuilderStore', {
  state: (): BuilderState => {
    return {
      stackInBuilder: {} as IStack,
    };
  },
  persist: {
    key: 'builder-data',
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
    getTotalDur(): number {
      let total = 0;
      this.stackInBuilder.stacksToFrag.forEach((e) => {
        total += e.frag.duration;
      });
      return total;
    },
    getBuilder(): IStack {
      return this.stackInBuilder;
    },

    getTimersInBuilder(): IStacksToFrag[] {
      return this.stackInBuilder.stacksToFrag;
    },
    isEditBuilder(): boolean {
      return !isEmptyObj(this.stackInBuilder);
    },
  },

  actions: {
    orderStack() {
      if ('stacksToFrag' in this.stackInBuilder) {
        alert('passed');
        return this.stackInBuilder.stacksToFrag.map((timer, index) => {
          timer.order = index;
          timer.frag.order = index;
        });
      }
    },

    async saveStack(stack: IStack) {
      // TODO: 상단에서 Initialize 하면 발생하는 오류 해결 -> ReferenceError: Cannot access 'useTimerStore' before initialization
      try {
        await timerStore.saveTimer();
      } catch {
        Notify.create({
          color: 'negative',
          message: '저장 과정에서 오류가 발생했습니다.',
        });
      }

      stack.stacksToFrag.map((timer, index) => {
        timer.order = index;
      });

      const res = await api.post('stacks/save', stack);
      if (res.data.success) {
        Notify.create({
          position: 'top',
          color: 'positive',
          message: '저장되었습니다',
        });
        // TODO: 저장 완료 후 fetch 통해서 StackList 다시 불러오도록 구현
      } else {
        Notify.create({
          position: 'top',
          color: 'negative',
          message: '오류가 발생했습니다. 인터넷 연결 상태를 확인해주세요.',
        });
      }
    },

    createStack(name: string) {
      // this.$reset();
      this.stackInBuilder = new Stack({ name: name });
    },
  },
});
