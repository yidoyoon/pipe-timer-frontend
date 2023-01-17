import { api } from 'boot/axios';
import { defineStore } from 'pinia';
import { ITimefrag } from 'src/core/timefrag/domain/timefrag';
import { LocalStorage } from 'quasar';

export interface TimefragState {
  timefrags: Record<string, ITimefrag>;
  timefragIds: string[];
  isLoading: boolean;
}

export const useTimefragStore = defineStore('timefragStore', {
  state: (): TimefragState => {
    return {
      timefrags: {},
      timefragIds: [],
      isLoading: false,
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
  // TODO: hydrate 메서드를 SSR 환경이 아니더라도 상태 초기화에 활용 가능한지 알아보기
  // hydrate(storeState, initialState) {
  //   // @ts-expect-error: https://github.com/microsoft/TypeScript/issues/43826
  //   storeState = useLocalStorage('test', 0);
  // },

  getters: {
    list(): ITimefrag[] {
      return this.timefragIds.map((i) => this.timefrags[i]);
    },

    loaded(): boolean {
      return this.timefragIds.length > 0;
    },

    isEditingOverall(): boolean {
      let filtered;
      if (!this.isLoading) {
        filtered = this.list.find((obj) => {
          return obj._isEditing;
        });
      }

      return filtered !== undefined;
    },

    canSave(): boolean {
      return !(this.isLoading || this.isEditingOverall);
    },
  },

  actions: {
    async fetchAll() {
      if (this.loaded) return;
      this.isLoading = true;
      const res = await api.get('frag/fetch');
      const frags = res.data;
      this.isLoading = false;

      this.timefragIds = frags.map((frag: ITimefrag) => {
        this.timefrags[frag._id] = frag;
        return frag._id;
      });
      this.setInitialState()
    },

    add(newTimefrag: ITimefrag) {
      this.timefrags[newTimefrag._id] = newTimefrag;
      this.timefragIds.push(newTimefrag._id);
    },

    edit(newTimefrag: ITimefrag) {
      const tradfrag = this.timefrags[newTimefrag._id];

      if (!!tradfrag) {
        this.timefrags[newTimefrag._id] = newTimefrag;
      }
    },

    remove(timefragId: string) {
      const target = this.timefrags[timefragId];
      if (!!target) {
        delete this.timefrags[timefragId];
        const i = this.timefragIds.lastIndexOf(timefragId);
        if (i > -1) this.timefragIds.splice(i, 1);
      }
    },

    setInitialState() {
      LocalStorage.set('frags', JSON.stringify(this.$state));
    },

    getInitialState(): TimefragState | null {
      return LocalStorage.getItem('frags');
    },

    reset() {
      this.$reset();
    },
  },
});
