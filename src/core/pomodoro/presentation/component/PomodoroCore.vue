<template>
  <!--  <div class="row justify-start">-->
  <!--    현재 알림 설정: {{ permission === 'granted' ? 'On' : 'Off' }}-->
  <!--  </div>-->
  <div class="row fit justify-center content-start">
    <div id="clock">
      <div class="time">{{ timeFormatter }}</div>
    </div>

    <q-space class="flex-break"></q-space>

    <div class="q-my-none">
      <q-toggle
        v-model="endless"
        icon="all_inclusive"
        class="q-pr-sm"
        color="orange-6"
      />
      <q-toggle
        v-model="autoStart"
        icon="check"
        color="purple-6"
        class="q-pr-sm"
      />
      <q-toggle
        v-model="notification"
        icon="notifications_active"
        color="teal-6"
      />
    </div>

    <q-space class="flex-break"></q-space>

    <div class="row justify-center col-3 no-wrap text-no-wrap q-my-md">
      <q-btn
        v-if="pomodoroStore.state !== 'start'"
        color="green-7"
        text-color="white"
        @click="start"
        >start</q-btn
      >
      <q-btn
        v-else-if="pomodoroStore.state === 'start'"
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
import { useQuasar } from 'quasar';
import { usePomodoroStore } from 'src/core/pomodoro/infra/store/pomodoro.store';
import { IStack } from 'src/core/stack/domain/stack.model';
import { useStackStore } from 'src/core/stack/infra/store/stack.store';
import { ITimer } from 'src/core/timer/domain/timer.model';
import { useTimerStore } from 'src/core/timer/infra/store/timer.store';
import { computed, onMounted, ref, watch } from 'vue';

const $q = useQuasar();

dayjs.extend(duration);
dayjs.extend(relativeTime);

const pomodoroStore = usePomodoroStore();
const pomodoroStoreRefs = storeToRefs(pomodoroStore);
const { stack } = storeToRefs(usePomodoroStore());
let { round } = storeToRefs(usePomodoroStore());
const stackStore = useStackStore();
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
  if (pomodoroStore.mode === 'stack') {
    const data = pomodoroStore.stack;
    if ('stacksToFrag' in data && round.value < data.stacksToFrag.length) {
      return data.stacksToFrag[round.value].frag.duration;
    }
  } else if (pomodoroStore.mode === 'timer') {
    return pomodoroStore.timer.duration;
  }
  return 0;
});

const timeFormatter = computed(() => {
  const time = currDuration.value || 0;
  const formatted = dayjs.duration(time, 'seconds').format('HH:mm:ss');
  return formatted;
});

const arrowDrawer = (index: number) => {
  return !!stack.value && index !== stack.value.stacksToFrag.length - 1;
};

const start = () => {
  if (pomodoroStore.state === 'start') return;
  if (
    'stacksToFrag' in pomodoroStore.stack ||
    'fragId' in pomodoroStore.timer
  ) {
    started = setInterval(elapse, 1000);
    pomodoroStore.state = 'start';
  } else {
    $q.notify({
      color: 'warning',
      message: '우선 작동 시킬 타이머 혹은 스택을 더블클릭하여 셋팅해주세요.',
      textColor: 'black',
    });
    clearInterval(started);
  }
};

const elapse = () => {
  let timer;
  if (pomodoroStore.mode === 'stack') {
    timer = _.cloneDeep(pomodoroStore.stack.stacksToFrag[round.value].frag);
    timer.duration--;
    pomodoroStore.stack.stacksToFrag[round.value].frag = _.cloneDeep(timer);
  } else if (pomodoroStore.mode === 'timer') {
    timer = _.cloneDeep(pomodoroStore.timer);
    timer.duration--;
    pomodoroStore.timer = timer;
  }
  if (timer !== undefined && timer.duration <= 0) {
    if (!!notification.value) {
      clearInterval(started);
      notifyRoundEnd();
    }
    pomodoroStore.round++;
    timeEnd();
  }
};

const pause = () => {
  // TODO: 시간 정보 출력 부분이 깜빡이는 트랜지션 추가
  if (pomodoroStore.state === 'pause') return;
  pomodoroStore.state = 'pause';

  clearInterval(started);
};

const stop = () => {
  if (pomodoroStore.state === 'stop') return;
  loadSession();
  pomodoroStore.state = 'stop';
  pomodoroStore.round = 0;
  clearInterval(started);
};

const loadSession = () => {
  let data;
  if (pomodoroStore.mode === 'stack') {
    data = $q.sessionStorage.getItem('pomodoro-data') as IStack;
    pomodoroStore.stack = _.cloneDeep(data);
    pomodoroStore.timer = _.cloneDeep({} as ITimer);
    const id = data.id;
    stackStore.stacks[id] = data;
  } else if (pomodoroStore.mode === 'timer') {
    data = $q.sessionStorage.getItem('timer-data') as ITimer;
    pomodoroStore.timer = _.cloneDeep(data);
    pomodoroStore.stack = _.cloneDeep({} as IStack);
    const id = data.fragId;
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
        '무제한 모드를 활성화합니다.<br>설정된 스택, 타이머가 STOP 버튼을 누를 때 까지 계속해서 반복 작동합니다',
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
    pomodoroStore.mode === 'stack' &&
    +round.value >= +pomodoroStore.stack.stacksToFrag.length
  ) {
    if (endless.value === true) {
      round.value = 0;
    } else {
      clearInterval(started);
      pomodoroStoreRefs.state = ref('');
      pomodoroStoreRefs.round = ref(0);
      $q.notify({ message: '타이머를 종료합니다', color: 'green' });
    }
  } else if (pomodoroStore.mode === 'timer' && +round.value >= 1) {
    if (endless.value) {
      round.value = 0;
    } else {
      clearInterval(started);
      pomodoroStore.state = '';
      pomodoroStore.round = 0;
      $q.notify({ message: '타이머를 종료합니다', color: 'green' });
    }
  }
  loadSession();
};

function endRoundPush(timerInfo: string) {
  pomodoroStore.state = 'pause';
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then((registration) => {
      if (
        pomodoroStore.mode === 'stack' &&
        round.value < pomodoroStore.stack.stacksToFrag.length - 1
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
        (pomodoroStore.mode === 'stack' &&
        round.value === pomodoroStore.stack.stacksToFrag.length - 1) || (pomodoroStore.mode === 'timer')
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
    pomodoroStore.mode === 'stack' &&
    nextRound < pomodoroStore.stack.stacksToFrag.length
  ) {
    const timer = pomodoroStore.stack.stacksToFrag[nextRound].frag;
    name = timer.name;
    duration = timer.duration;
  } else if (pomodoroStore.mode === 'timer') {
    const id = pomodoroStore.timer.fragId;
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
        pomodoroStore.mode === 'stack' &&
        round.value > pomodoroStore.stack.stacksToFrag.length
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

@import url('https://fonts.googleapis.com/css?family=Share+Tech+Mono');

#clock {
  order: 0;

  .time {
    font-family: 'Share Tech Mono', sans-serif;
    font-size: 3rem;
  }
}
</style>
