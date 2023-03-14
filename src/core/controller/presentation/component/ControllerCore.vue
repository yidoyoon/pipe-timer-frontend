<template>
  <div class="row fit justify-center content-start">
    <div id="clock">
      <div class="time">{{ timeFormatter }}</div>
    </div>

    <q-space class="flex-break"></q-space>

    <div class="row flex q-my-none">
      <div>
        <q-toggle
          v-model="endless"
          icon="all_inclusive"
          class="q-pr-sm"
          color="orange-6"
        />
        <q-tooltip anchor="top middle" self="top middle">
          <div>
            반복 모드를 활성화 합니다. 루틴이 끝까지 도달해도 처음으로
            되돌아갑니다.
          </div>
        </q-tooltip>
      </div>
      <div>
        <q-toggle
          v-model="autoStart"
          icon="check"
          color="purple-6"
          class="q-pr-sm"
        />
        <q-tooltip anchor="top middle" self="top middle">
          <div>
            자동 시작 모드를 활성화 합니다. 데스크톱 알림에 응답하지 않아도
            자동으로 다음 타이머가 실행됩니다.
          </div>
        </q-tooltip>
      </div>
      <div>
        <q-toggle
          v-model="notification"
          icon="notifications_active"
          color="teal-6"
        />
        <q-tooltip anchor="top middle" self="top middle">
          <div>데스크톱 알림을 활성화 합니다.</div>
        </q-tooltip>
      </div>
    </div>

    <q-space class="flex-break"></q-space>

    <div class="row justify-center col-3 no-wrap text-no-wrap q-my-md">
      <q-btn
        v-if="controllerStore.state !== 'start'"
        color="green-7"
        text-color="white"
        @click="start"
        >start</q-btn
      >
      <q-btn
        v-else-if="controllerStore.state === 'start'"
        color="yellow"
        text-color="black"
        @click="pause"
        >pause</q-btn
      >
      <q-btn class="q-ml-lg" color="red" text-color="white" @click="stop"
        >stop</q-btn
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import _ from 'lodash-es';
import { storeToRefs } from 'pinia';
import { useQuasar }        from 'quasar';
import { usePomodoroStore } from 'src/core/controller/infra/store/controller.store';
import { IRoutine }         from 'src/core/routines/domain/routine.model';
import { useRoutineStore } from 'src/core/routines/infra/store/routine.store';
import { ITimer } from 'src/core/timers/domain/timer.model';
import { useTimerStore } from 'src/core/timers/infra/store/timer.store';
import { computed, onMounted, ref, watch } from 'vue';

const $q = useQuasar();

dayjs.extend(duration);
dayjs.extend(relativeTime);

const controllerStore = usePomodoroStore();
const pomodoroStoreRefs = storeToRefs(controllerStore);
const { routine } = storeToRefs(usePomodoroStore());
let { round } = storeToRefs(usePomodoroStore());
const routineStore = useRoutineStore();
const timerStore = useTimerStore();

const notifOptions: NotificationOptions = {
  requireInteraction: false,
};

let started: string | number | NodeJS.Timeout | undefined;

// TODO: Pinia에 state로 저장
const endless = ref(false);
const autoStart = ref(false);
const notification = ref(false);

const currDuration = computed(() => {
  if (controllerStore.mode === 'routine') {
    const data = controllerStore.routine;
    if ('routineToTimer' in data && round.value < data.routineToTimer.length) {
      return data.routineToTimer[round.value].timer.duration;
    }
  } else if (controllerStore.mode === 'timer') {
    return controllerStore.timer.duration;
  }
  return 0;
});

const timeFormatter = computed(() => {
  const time = currDuration.value || 0;
  const formatted = dayjs.duration(time, 'seconds').format('HH:mm:ss');
  return formatted;
});

const arrowDrawer = (index: number) => {
  return !!routine.value && index !== routine.value.routineToTimer.length - 1;
};

const start = () => {
  if (controllerStore.state === 'start') return;
  if (
    'routineToTimer' in controllerStore.routine ||
    'timerId' in controllerStore.timer
  ) {
    started = setInterval(elapse, 1000);
    controllerStore.state = 'start';
  } else {
    $q.notify({
      color: 'warning',
      message: '우선 작동 시킬 타이머 혹은 루틴을 더블클릭하여 셋팅해주세요.',
      textColor: 'black',
    });
    clearInterval(started);
  }
};

const elapse = () => {
  let timer;
  if (controllerStore.mode === 'routine') {
    timer = _.cloneDeep(
      controllerStore.routine.routineToTimer[round.value].timer
    );
    timer.duration--;
    controllerStore.routine.routineToTimer[round.value].timer =
      _.cloneDeep(timer);
  } else if (controllerStore.mode === 'timer') {
    timer = _.cloneDeep(controllerStore.timer);
    timer.duration--;
    controllerStore.timer = timer;
  }
  if (timer !== undefined && timer.duration <= 0) {
    if (!!notification.value) {
      clearInterval(started);
      notifyRoundEnd();
    }
    controllerStore.round++;
    timeEnd();
  }
};

const pause = () => {
  // TODO: 시간 정보 출력 부분이 깜빡이는 트랜지션 추가
  if (controllerStore.state === 'pause') return;
  controllerStore.state = 'pause';

  clearInterval(started);
};

const stop = () => {
  if (controllerStore.state === 'stop') return;
  loadSession();
  controllerStore.state = 'stop';
  controllerStore.round = 0;
  clearInterval(started);
};

const loadSession = () => {
  let data;
  if (controllerStore.mode === 'routine') {
    data = $q.sessionStorage.getItem('controller-data') as IRoutine;
    controllerStore.routine = _.cloneDeep(data);
    controllerStore.timer = _.cloneDeep({} as ITimer);
    const id = data.id;
    routineStore.routine[id] = data;
  } else if (controllerStore.mode === 'timer') {
    data = $q.sessionStorage.getItem('timers-data') as ITimer;
    controllerStore.timer = _.cloneDeep(data);
    controllerStore.routine = _.cloneDeep({} as IRoutine);
    const id = data.timerId;
    timerStore.timers[id] = data;
  }
};

const setNotification = () => {
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
};
watch(endless, () => {
  if (endless.value === true) {
    $q.notify({
      html: true,
      message:
        '무제한 모드를 활성화합니다.<br>설정된 루틴, 타이머가 STOP 버튼을 누를 때 까지 계속해서 반복 작동합니다',
    });
  }

  if (endless.value === false) {
    $q.notify({
      html: true,
      message: '무제한 모드를 비활성화합니다',
    });
  }
});

watch([notification, Notification.permission], () => {
  if (notification.value === true) {
    setNotification();
    if (Notification.permission === 'granted') {
      new Notification(
        '데스크톱 푸시 알림 설정을 활성화합니다.\n타이머 종료 시, 데스크톱 알림을 전송합니다.',
        notifOptions
      );
    }
  }
  if (notification.value === false) {
    $q.notify({
      message: '데스크톱 푸시 알림을 비활성화 합니다.',
    });
  }
});

watch(autoStart, () => {
  if (autoStart.value === true) {
    $q.notify({
      html: true,
      message:
        '자동 시작 기능을 활성화합니다.<br>라운드 종료 시, 다음 라운드를 자동으로 실행합니다.',
    });
  }

  if (autoStart.value === false) {
    $q.notify({
      message: '자동 시작 기능을 비활성화합니다.',
    });
  }
});

const timeEnd = () => {
  if (
    controllerStore.mode === 'routine' &&
    +round.value >= +controllerStore.routine.routineToTimer.length
  ) {
    if (endless.value === true) {
      round.value = 0;
    } else {
      clearInterval(started);
      pomodoroStoreRefs.state = ref('');
      pomodoroStoreRefs.round = ref(0);
      $q.notify({ message: '타이머를 종료합니다', color: 'green' });
    }
  } else if (controllerStore.mode === 'timer' && +round.value >= 1) {
    if (endless.value) {
      round.value = 0;
    } else {
      clearInterval(started);
      controllerStore.state = '';
      controllerStore.round = 0;
      $q.notify({ message: '타이머를 종료합니다', color: 'green' });
    }
  }
  loadSession();
};

function endRoundPush(timerInfo: string) {
  controllerStore.state = 'pause';
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then((registration) => {
      if (
        controllerStore.mode === 'routine' &&
        round.value < controllerStore.routine.routineToTimer.length - 1
      ) {
        registration.showNotification('Round end notification', {
          ...notifOptions,
          requireInteraction: false,
          body: `다음 타이머를 실행하시겠습니까?\n${timerInfo}`,
          actions: [
            {
              title: 'Confirm',
              action: 'confirm',
            },
            {
              title: 'Cancel',
              action: 'close',
            },
          ],
        });
      } else if (
        (controllerStore.mode === 'routine' &&
         round.value === controllerStore.routine.routineToTimer.length - 1) ||
        controllerStore.mode === 'timer'
      ) {
        new Notification('모든 타이머를 실행했습니다.');
      }
    });
  }
}

const notifyRoundEnd = () => {
  let name = '';
  let duration = 0;
  const nextRound = round.value + 1;

  if (
    controllerStore.mode === 'routine' &&
    nextRound < controllerStore.routine.routineToTimer.length
  ) {
    const timer = controllerStore.routine.routineToTimer[nextRound].timer;
    name = timer.name;
    duration = timer.duration;
  } else if (controllerStore.mode === 'timer') {
    const id = controllerStore.timer.timerId;
    const timer = timerStore.timers[id];
    name = timer.name;
    duration = timer.duration;
  }

  let nextTimerInfo = `타이머 이름: ${name}\n시간: ${duration}`;

  if (!!autoStart.value) {
    new Notification(
      `다음 타이머를 실행합니다.\n${nextTimerInfo}`,
      notifOptions
    );
    started = setInterval(elapse, 1000);
  } else {
    if (
      !(
        controllerStore.mode === 'routine' &&
        round.value > controllerStore.routine.routineToTimer.length
      )
    ) {
      endRoundPush(nextTimerInfo);
    }
  }
};

onMounted(() => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener('message', (e) => {
      if (e.data === 'confirm') {
        started = setInterval(elapse, 1000);
      }
    });
  }
});

const highlightBorder = (timer: ITimer) => {
  return {
    border: 'solid teal 0.3rem',
    ...colorExtractor(timer),
  };
};

const notCurrent = (timer: ITimer) => {
  return {
    border: 'solid transparent 0.3rem',
    ...colorExtractor(timer),
  };
};

const colorExtractor = (timer: ITimer) => {
  return {
    background: timer.color,
  };
};
</script>

<style scoped lang="scss">
.flex-break {
  flex: 1 0 100% !important;
  height: 0;
  margin: 0;
  border: 0;
}

$color: black;
$color-light: white;

@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');

#clock {
  order: 0;

  .time {
    font-family: 'Share Tech Mono', sans-serif;
    font-size: 3rem;
  }
}
</style>
