import { api } from 'boot/axios';
import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { IStacks } from 'src/core/stack/domain/stacks.model';
import { ITimefrag } from 'src/core/timefrag/domain/timefrag';

export interface StacksState {
  stacks: Record<string, IStacks>;
  stacksIds: string[];
  builds: ITimefrag[];
  isLoading: boolean;
}

export const useStacksStore = defineStore('StacksStore', {
  state: (): StacksState => {
    return {
      stacks: {},
      stacksIds: [],
      builds: [],
      isLoading: false,
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
    listStacks(): IStacks[] {
      return this.stacksIds.map((i) => this.stacks[i]);
    },

    loadedStacks(): boolean {
      return this.stacksIds.length > 0;
    },

    isEditingOverallStacks(): boolean {
      let filtered;
      if (!this.isLoading) {
        filtered = this.listStacks.find((obj) => {
          return obj._isEditing;
        });
      }

      return filtered !== undefined;
    },

    canSaveStacks(): boolean {
      return !(this.isLoading || this.isEditingOverallStacks);
    },
  },

  actions: {
    async fetchAll() {
      if (this.loadedStacks) return;
      this.isLoading = true;
      // TODO: 에러 처리 필요
      const res = await api.get('stacks/fetch');
      const stacks = res.data;
      this.isLoading = false;

      this.stacksIds = stacks.map((stack: IStacks) => {
        this.stacks[stack._id] = stack;
        return stack._id;
      });
      this.setInitialState();
    },

    addStack(newStacks: IStacks) {
      this.stacks[newStacks._id] = newStacks;
      this.stacksIds.push(newStacks._id);
    },

    edit(newStacks: IStacks) {
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

    setInitialState() {
      LocalStorage.set('stacks', JSON.stringify(this.$state));
    },

    getInitialState(): StacksState | null {
      return LocalStorage.getItem('stacks');
    },

    reset() {
      this.$reset();
    },

    getFrag(frag: ITimefrag) {
      this.builds.push(frag);
    },
  },
});
