import { defineStore }   from 'pinia';
import { LocalStorage }  from 'quasar';
import { IStack, Stack } from 'src/core/stack/domain/stack.model';
import {isEmptyObj}      from 'src/util/is-empty';

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
      if (this.stackInBuilder._data !== undefined) {
        this.stackInBuilder._data.forEach((e) => {
          total += e._duration;
        });
      }
      return total;
    },
    getBuilder(): IStack {
      return this.stackInBuilder;
    },
    isEditBuilder(): boolean {
      return !isEmptyObj(this.stackInBuilder)
    }
  },

  actions: {
    // emptyBuilder(): void {
    //   this.$reset();
    // },
    createStack(name: string) {
      // this.$reset();
      this.stackInBuilder = new Stack({ name: name });
    },
  },
});
