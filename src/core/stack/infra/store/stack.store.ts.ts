import { api } from 'boot/axios';
import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { IStack } from 'src/core/stack/domain/stack.model';
import { ITimer } from 'src/core/timer/domain/timer.model';

export interface StacksState {
  stacks: Record<string, IStack>;
  stacksIds: string[];
  isLoadingStacks: boolean;
  isEditingStacks: boolean;
}

export const useStackStore = defineStore('StackStore', {
  state: (): StacksState => {
    return {
      stacks: {},
      stacksIds: [],
      isLoadingStacks: false,
      isEditingStacks: false,
    };
  },
  persist: {
    key: 'stacks-data',
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
    listStacks(): IStack[] {
      return this.stacksIds.map((i) => this.stacks[i]);
    },

    listStacksData(): ITimer[] {
      const result = [] as ITimer[];
      this.stacksIds.forEach((e) => {
        result.push(...this.stacks[e]._data);
      });
      return result;
    },

    loadedStacks(): boolean {
      return this.stacksIds.length > 0;
    },

    isEditingOverallStacks(): boolean {
      let filtered;
      if (!this.isLoadingStacks) {
        filtered = this.listStacks.find((obj) => {
          return obj._isEditing;
        });
      }

      return filtered !== undefined;
    },

    canSaveStack(): boolean {
      return !(this.isLoadingStacks || this.isEditingOverallStacks);
    },


  },

  actions: {
    async fetchAll() {
      if (this.loadedStacks) return;
      this.isLoadingStacks = true;
      // TODO: 에러 처리 필요
      const res = await api.get('stacks/fetch');
      const stacks = res.data;

      // const a = new TimerModel({ name: 'a' });
      //
      // const stack1 = {} as IStacks;
      // stack1._id = 'A';
      // stack1._count = 0;
      // stack1._name = 'ACCC';
      // stack1._isEditing = false;
      // stack1._data = [a];
      //
      // const stack2 = {} as IStacks;
      // stack2._id = 'B';
      // stack2._count = 0;
      // stack2._name = 'B';
      // stack2._isEditing = false;
      // stack2._data = [new TimerModel({ _name: 'a' })];

      // const stacks: IStacks[] = [{ ...stack1 }, { ...stack2 }];

      this.isLoadingStacks = false;

      this.stacksIds = stacks.map((stack: IStack) => {
        this.stacks[stack._id] = stack;
        return stack._id;
      });
      this.setInitialState();
    },



    edit(newStacks: IStack) {
      const tradStack = this.stacks[newStacks._id];

      if (!!tradStack) {
        this.stacks[newStacks._id] = newStacks;
      }
    },

    remove(timeStacksId: string) {
      const target = this.stacks[timeStacksId];
      if (!!target) {
        delete this.stacks[timeStacksId];
        const i = this.stacksIds.lastIndexOf(timeStacksId);
        if (i > -1) this.stacksIds.splice(i, 1);
      }
    },

    setInitialState(): void {
      LocalStorage.set('stacks', JSON.stringify(this.$state));
    },

    getInitState(): StacksState | null {
      return LocalStorage.getItem('stacks');
    },

    reset() {
      this.$reset();
    },
  },
});
