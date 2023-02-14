<template>
  <q-drawer
    v-model="rightDrawerOpen"
    show-if-above
    side="right"
    borderd
    :width="205"
    :breakpoint="400"
  >
    <q-scroll-area
      style="
        height: 100%;
        /*height: calc(100% - 150px);*/
        /*margin-top: 150px;*/
        border-left: 1px solid #ddd;
      "
    >
      <q-list padding>
        <q-item-section>
          <q-item class="row justify-center">
            <q-item-label v-if="!!user"
              >Logged in as <b>{{ userStore.user.userName }}</b></q-item-label
            >
            <q-item-label v-else
              >타이머, 스택 정보를 서버에<br>저장하시려면 로그인 해주세요.</q-item-label
            >
          </q-item>
        </q-item-section>
        <q-separator />

        <div class="row justify-evenly">
          <q-btn
            v-if="user"
            @click="createTimerBtn"
            :disable="!listTimers.length"
            dense
            icon="add"
            flat
            label="add"
            text-color="positive"
            class="q-pr-sm"
          >
            <q-tooltip anchor="top middle" self="top middle">
              <div>타이머를 생성합니다.</div>
            </q-tooltip>
          </q-btn>

          <q-separator vertical />

          <q-btn
            v-if="user"
            @click="saveTimersBtn"
            :disable="!listTimers.length"
            dense
            icon="save"
            flat
            label="save"
            text-color="positive"
            class="q-pr-sm"
          >
            <q-tooltip anchor="top middle" self="top middle">
              <div>타이머를 저장합니다.</div>
            </q-tooltip>
          </q-btn>
        </div>

        <q-separator />

        <q-item>
          <q-item-section avatar>
            <q-icon name="timer" />
          </q-item-section>
          <q-item-section>
            <q-item-label>타이머 리스트</q-item-label>
            <!--            <q-item-label caption>Caption</q-item-label>-->
          </q-item-section>
        </q-item>

        <q-separator />

        <TimerCore v-if="listTimers.length" :timers="listTimers" class="col-12" />
        <div v-else class="row justify-between q-pt-lg absolute-center">
          <q-icon name="hourglass_disabled" class="col-12"> 타이머가 비어있습니다. </q-icon>
        </div>
      </q-list>
    </q-scroll-area>

    <!--    <q-img-->
    <!--      class="absolute-top"-->
    <!--      src="https://cdn.quasar.dev/img/material.png"-->
    <!--      style="height: 150px"-->
    <!--    >-->
    <!--      <div class="absolute-bottom bg-transparent">-->
    <!--        <q-avatar size="56px" class="q-mb-sm">-->
    <!--          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />-->
    <!--        </q-avatar>-->
    <!--        <div class="text-weight-bold">Razvan Stoenescu</div>-->
    <!--        <div>@rstoenescu</div>-->
    <!--      </div>-->
    <!--    </q-img>-->
  </q-drawer>

  <!--  Create timer dialog-->
  <q-dialog v-model="timerPrompt" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Create new timer</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          label="Name"
          v-model="timerName"
          hint="타이머의 이름을 입력해주세요."
          dense
          autofocus
          @keyup.enter.prevent="createTimer"
          @keyup.esc.prevent="timerPrompt = false"
          :rules="[
            (val) => val.length >= 1 || '최소 1 글자 이상으로 설정해주세요.',
          ]"
        />
        <!--        TODO: 시간 입력기 개선-->
        <q-input
          label="Duration"
          v-model="duration"
          dense
          autofocus
          hint="설정할 시간을 초 단위로 입력해주세요."
          @keyup.enter.prevent="createTimer"
          @keyup.esc.prevent="timerPrompt = false"
          :rules="[
            (val) =>
              val.length >= 1 ||
              val.length <= 86400 ||
              '1초 - 86400초(24 시간) 사이로 입력해주세요',
          ]"
        />
        <q-input
          filled
          v-model="color"
          :rules="['anyColor']"
          hint="타이머 구분에 사용할 색상을 선택합니다."
          class="my-input"
        >
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-color v-model="color" no-header-tabs format-model="hexa" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          flat
          label="Confirm"
          color="green"
          v-close-popup
          @click="createTimer"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { api } from 'boot/axios';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useBuilderStore } from 'src/core/builder/infra/store/builder.store';
import { useSelectorStore } from 'src/core/common/infra/store/selector.store';
import { useStackStore } from 'src/core/stack/infra/store/stack.store';
import { Timer } from 'src/core/timer/domain/timer.model';
import { useTimerStore } from 'src/core/timer/infra/store/timer.store';
import { useUserStore } from 'src/core/users/infra/store/user.store';
import { ref, watch } from 'vue';
import TimerCore from 'src/core/timer/presentation/components/TimerCore.vue';

const props = withDefaults(defineProps<{ rightDrawerOpen: boolean }>(), {
  rightDrawerOpen: true,
});

const timerStore = useTimerStore();
const userStore = useUserStore();
const { listTimers } = timerStore;
const stackStore = useStackStore();
const selectorStore = useSelectorStore();
const { user } = userStore;

const rightDrawerOpen = ref(props.rightDrawerOpen);
// const { canSaveTimers } = timerStoreRefs;

timerStore.fetchAll();
stackStore.fetchAll();

const $q = useQuasar();

const timerPrompt = ref(false);

const timerName = ref('');
const duration = ref(0);
const color = ref('#000000ff');

timerStore.fetchAll();

watch(props, () => {
  rightDrawerOpen.value = props.rightDrawerOpen;
});

const createTimerBtn = () => {
  timerPrompt.value = true;
};

const createTimer = () => {
  timerStore.add(
    new Timer({
      name: timerName.value,
      duration: duration.value,
      color: color.value,
    })
  );
  timerPrompt.value = false;
};

const saveTimersBtn = () => {
  $q.notify({
    progress: true,
    message: '타이머를 저장합니다. 계속 하시겠습니까?',
    color: 'navy',
    multiLine: true,
    actions: [
      {
        label: '확인',
        color: 'white',
        handler: saveTimers,
      },
      { label: '취소', color: 'white' },
    ],
  });
};

const saveTimers = () => {
  if (!!user) {
    const res = api.post('frag/save', timerStore.listTimers);
    if (!res) {
      $q.notify({
        message: '저장이 완료되지 않았습니다. 인터넷 연결 상태를 확인해주세요',
        color: 'negative',
      });
    } else {
      $q.notify({
        message: '저장을 완료했습니다.',
        color: 'positive',
      });
      timerStore.fetchAll();
    }
  }
};
</script>
