import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { IStack } from 'src/core/stack/domain/stack.model';

export interface BuilderState {
  stackInBuilder: IStack[];
}

export const useBuilderStore = defineStore('BuilderStore', {
  state: (): BuilderState => {
    return {
      stackInBuilder: [] as IStack[],
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
  actions: {
    emptyBuilder(): void {
      while (this.stackInBuilder.length) {
        this.stackInBuilder.pop();
      }
    },
    addStack(newStack: IStack) {
      this.stackInBuilder.push(newStack);
    },
  },
});
