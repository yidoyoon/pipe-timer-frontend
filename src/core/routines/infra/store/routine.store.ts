import { api } from 'boot/axios';
import { defineStore } from 'pinia';
import { LocalStorage }     from 'quasar';
import { usePomodoroStore } from 'src/core/controller/infra/store/controller.store';
import { IRoutine }         from 'src/core/routines/domain/routine.model';
import { IRoutineToTimer } from 'src/core/timers/domain/timer.model';
import { useUserStore } from 'src/core/users/infra/store/user.store';
import _ from 'lodash-es';

export interface RoutineState {
  routine: Record<string, IRoutine>;
  routineIds: string[];
  isLoadingRoutine: boolean;
  isEditingRoutine: boolean;
}

const userStore = useUserStore();
const pomodoroStore = usePomodoroStore();
const { user } = userStore;

export const useRoutineStore = defineStore('RoutineStore', {
  state: (): RoutineState => {
    return {
      routine: {},
      routineIds: [],
      isLoadingRoutine: false,
      isEditingRoutine: false,
    };
  },
  persist: {
    key: 'routines-data',
    storage: {
      getItem: (key) => {
        return LocalStorage.getItem(key);
      },
      setItem: (key, value) => {
        return LocalStorage.set(key, value);
      },
    },
    beforeRestore: (ctx) => {
      // TODO: 루틴 무결성 검사 추가
    },
  },

  getters: {
    listRoutine(): IRoutine[] {
      return this.routineIds.map((i) => this.routine[i]);
    },

    listRoutineData(): IRoutineToTimer[] {
      const result = [] as IRoutineToTimer[];
      this.routineIds.forEach((e) => {
        result.push(...this.routine[e].routineToTimer);
      });
      return result;
    },

    loadedRoutine(): boolean {
      return this.routineIds.length > 0;
    },

    isEditingOverallRoutine(): boolean {
      let filtered;
      if (!this.isLoadingRoutine) {
        filtered = this.listRoutine.find((obj) => {
          return obj.isEditing;
        });
      }

      return filtered !== undefined;
    },

    canSaveRoutine(): boolean {
      return !(this.isLoadingRoutine || this.isEditingOverallRoutine);
    },
  },

  actions: {
    async fetchAll() {
      if (!!user) {
        this.isLoadingRoutine = true;
        // TODO: 에러 처리 필요
        const res = await api.get('routine/fetch');
        const routine = res.data as IRoutine[];

        this.isLoadingRoutine = false;

        this.routineIds = routine.map((routine: IRoutine) => {
          routine.routineToTimer.sort((a, b) => a.order - b.order);
          this.routine[routine.id] = routine;
          return routine.id;
        });
      }
    },

    edit(newRoutine: IRoutine) {
      const tradRoutine = this.routine[newRoutine.id];

      if (!!tradRoutine) {
        this.routine[newRoutine.id] = newRoutine;
      }
    },

    async remove(routineId: string) {
      const target = this.routine[routineId];
      if (!!target) {
        delete this.routine[routineId];
        const i = this.routineIds.lastIndexOf(routineId);
        if (i > -1) this.routineIds.splice(i, 1);
        if (routineId === pomodoroStore.routine.id) {
          pomodoroStore.routine = _.cloneDeep({} as IRoutine);
        }
        if (!!user) {
          // TODO: 에러처리
          const res = await api.post('routine/remove', target.id);
        }
      }
    },

    // TODO: 에러처리
    async removeLocalTimer(timerId: string) {
      const routineList: string[] = [];
      this.listRoutine.forEach((routine) => {
        const timerIds: number[] = [];
        routine.routineToTimer.forEach((timer, index) => {
          if (timer.timer.timerId === timerId) {
            timerIds.push(index);
          }
        });
        for (let i = timerIds.length - 1; i >= 0; i--) {
          if (i > -1) routine.routineToTimer.splice(i, 1);
        }
        if (routine.routineToTimer.length === 0) {
          this.remove(routine.id);
        }
      });
    },

    getInitState(): RoutineState | null {
      return LocalStorage.getItem('routine');
    },

    reset() {
      this.$reset();
    },
  },
});
