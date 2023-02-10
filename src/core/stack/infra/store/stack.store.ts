import { api } from 'boot/axios';
import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { IStack } from 'src/core/stack/domain/stack.model';
import { IStacksToFrag } from 'src/core/timer/domain/timer.model';
import { useUserStore } from 'src/core/users/infra/store/user.store';

export interface StacksState {
  stacks: Record<string, IStack>;
  stacksIds: string[];
  isLoadingStacks: boolean;
  isEditingStacks: boolean;
}

const userStore = useUserStore();
const { user } = userStore;

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

    listStacksData(): IStacksToFrag[] {
      const result = [] as IStacksToFrag[];
      this.stacksIds.forEach((e) => {
        result.push(...this.stacks[e].stacksToFrag);
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
          return obj.isEditing;
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
      if (!!user) {
        this.isLoadingStacks = true;
        // TODO: 에러 처리 필요
        const res = await api.get('stacks/fetch');
        const stacks = res.data as IStack[];

        this.isLoadingStacks = false;

        this.stacksIds = stacks.map((stack: IStack) => {
          stack.stacksToFrag.sort((a, b) => a.order - b.order);
          this.stacks[stack.id] = stack;
          return stack.id;
        });
      }
    },

    edit(newStacks: IStack) {
      const tradStack = this.stacks[newStacks.id];

      if (!!tradStack) {
        this.stacks[newStacks.id] = newStacks;
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
