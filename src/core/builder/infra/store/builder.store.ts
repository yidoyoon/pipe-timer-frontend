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
      console.log(`about to restore '${ctx.store.$id}'`);
    },
  },

  getters: {
    // TODO: Number를 시간단위로 변경
    getTotalDur(): number {
      let total = 0;
      if ('stackToFrag' in this.stackInBuilder) {
        this.stackInBuilder.stacksToFrag.forEach((e) => {
          total += e.frag.duration as number;
        });
      }
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
    // sortBuilder() {
    //   this.stackInBuilder.stacksToFrag = this.stackInBuilder.stacksToFrag.sort(
    //     (a, b) => a.order - b.order
    //   );
    // },

    orderStack() {
      if (this.stackInBuilder.stacksToFrag !== undefined) {
        return this.stackInBuilder.stacksToFrag.map((timer, index) => {
          timer.order = index;
        });
      }
    },

    async saveStack(stack: IStack) {
      // TODO: 상단에서 Initialize 하면 발생하는 오류 해결 -> ReferenceError: Cannot access 'useTimerStore' before initialization
      const timerStore = useTimerStore();
      timerStore.saveTimer();
      this.orderStack();
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
