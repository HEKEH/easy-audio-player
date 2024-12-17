<script setup lang="ts">
import type { AudioPlayerOptions } from 'easy-audio-player-shared';
import EasyAudioPlayer from '@hekeh/easy-audio-player-vue';

const options: AudioPlayerOptions = {
  showDownloadButton: true,
};
const url = '/Richard Wagner - Rienzi Overture.mp3';
</script>

<template>
  <div class="container" style="margin-top: 50px">
    <h1>Vue Easy Audio Player</h1>
    <EasyAudioPlayer :options="options" :url="url" />
  </div>
</template>
