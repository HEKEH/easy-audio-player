<script lang="ts">
import { ElPopover } from '@hekeh/el-popover';
import { bem } from 'easy-audio-player-shared';
import { computed, defineComponent, onBeforeUnmount, ref, watch } from 'vue';

function useVolume(setVolume: (volume: number) => void) {
  const volumeBar = ref<HTMLElement | null>(null);
  const volumeBarPin = ref<HTMLElement | null>(null);
  const volumeBarWrapper = ref<HTMLElement | null>(null);
  const volumePercentage = ref(1);
  const isVolumeOpen = ref(true);
  const isDragging = ref(false);

  const handleVolumeBarClick = (event: MouseEvent) => {
    if (!volumeBar.value?.parentElement || isDragging.value) {
      return;
    }
    isVolumeOpen.value = true;
    const bounds = volumeBar.value.parentElement.getBoundingClientRect();
    const y = bounds.bottom - event.clientY;
    const height = bounds.height;
    const percentage = Math.max(0, Math.min(y / height, 1));
    volumePercentage.value = percentage;
  };

  const handleDraggingVolume = (event: MouseEvent) => {
    if (!volumeBar.value?.parentElement) {
      return;
    }
    const bounds = volumeBar.value.parentElement.getBoundingClientRect();
    if (bounds.height === 0) {
      return;
    }
    const y = bounds.bottom - event.clientY;
    const percentage =
      Math.round(Math.max(0, Math.min((y / bounds.height) * 100, 100))) / 100;
    volumePercentage.value = percentage;
  };

  const removeDraggingVolumeListeners = () => {
    document.removeEventListener('mousemove', handleDraggingVolume);
    // eslint-disable-next-line ts/no-use-before-define
    document.removeEventListener('mouseup', stopDraggingVolume);
  };

  const stopDraggingVolume = () => {
    isDragging.value = false;
    removeDraggingVolumeListeners();
  };

  const startDraggingVolume = (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    isDragging.value = true;
    document.addEventListener('mousemove', handleDraggingVolume);
    document.addEventListener('mouseup', stopDraggingVolume);
  };

  onBeforeUnmount(() => {
    removeDraggingVolumeListeners();
  });

  const toggleVolumeOpen = () => {
    isVolumeOpen.value = !isVolumeOpen.value;
  };

  const volume = computed(() => {
    return isVolumeOpen.value ? volumePercentage.value : 0;
  });

  watch(volume, value => {
    setVolume(value);
  });

  return {
    volumeBar,
    volumeBarPin,
    volume,
    handleVolumeBarClick,
    startDraggingVolume,
    volumeBarWrapper,
    toggleVolumeOpen,
  };
}

const emits = {
  'update:volume': (_: number) => true,
};

const PlayerVolume = defineComponent({
  name: 'PlayerVolume',
  components: {
    ElPopover,
  },

  emits,

  setup(_, { emit }) {
    const setVolume = (volume: number) => {
      emit('update:volume', volume);
    };

    const {
      volumeBar,
      volumeBarPin,
      volumeBarWrapper,
      volume,
      handleVolumeBarClick,
      startDraggingVolume,
      toggleVolumeOpen,
    } = useVolume(setVolume);

    return {
      volumeBar,
      volumeBarPin,
      volumeBarWrapper,
      volume,
      handleVolumeBarClick,
      startDraggingVolume,
      toggleVolumeOpen,
      bem,
    };
  },
});

export default PlayerVolume;
</script>

<template>
  <ElPopover
    placement="top"
    trigger="hover"
    width="auto"
    :show-arrow="false"
    :popper-class="bem('volume', 'popover')"
    :offset="2"
  >
    <template #reference>
      <button :class="bem('control-btn')" @click="toggleVolumeOpen">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 22 22"
          :class="bem('control-btn', 'icon')"
        >
          <template v-if="volume === 0">
            <path
              d="M15 11a3.998 3.998 0 0 0-2-3.465v2.636l1.865 1.865A4.02 4.02 0 0 0 15 11z"
            />
            <path
              d="M13.583 5.583A5.998 5.998 0 0 1 17 11a6 6 0 0 1-.585 2.587l1.477 1.477a8.001 8.001 0 0 0-3.446-11.286 1 1 0 0 0-.863 1.805zm5.195 13.195-2.121-2.121-1.414-1.414-1.415-1.415L13 13l-2-2-3.889-3.889-3.889-3.889a.999.999 0 1 0-1.414 1.414L5.172 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39v-3.131l2.587 2.587-.01.005a1 1 0 0 0 .86 1.806c.215-.102.424-.214.627-.333l2.3 2.3a1.001 1.001 0 0 0 1.414-1.416zM11 5.04a.5.5 0 0 0-.813-.39L8.682 5.854 11 8.172V5.04z"
            />
          </template>
          <template v-else>
            <path
              fill-rule="evenodd"
              d="M10.188 4.65 6 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39V5.04a.498.498 0 0 0-.812-.39zm4.258-.872a1 1 0 0 0-.862 1.804 6.002 6.002 0 0 1-.007 10.838 1 1 0 0 0 .86 1.806A8.001 8.001 0 0 0 19 11a8.001 8.001 0 0 0-4.554-7.222z"
            />
            <path
              d="M15 11a3.998 3.998 0 0 0-2-3.465v6.93A3.998 3.998 0 0 0 15 11z"
            />
          </template>
        </svg>
      </button>
    </template>

    <div ref="volumeBarWrapper" :class="bem('volume-bar', 'wrapper')">
      <div :class="bem('volume-bar')" @click="handleVolumeBarClick">
        <div
          ref="volumeBar"
          :class="bem('volume-bar', 'fill')"
          :style="{ height: `${volume * 100}%` }"
        >
          <div
            ref="volumeBarPin"
            :class="bem('volume-bar', 'pin')"
            @mousedown="startDraggingVolume"
            @dragstart.prevent
          />
        </div>
      </div>
    </div>
  </ElPopover>
</template>
