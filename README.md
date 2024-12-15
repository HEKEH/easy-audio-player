# "Easy Audio Player"

[English](README.md) | [中文](README.zh-cn.md)

## Introduction

Easy Audio Player is a simple audio player that supports Vue 3.

![View](img/demo.png)

## Installation

```bash
# Using npm
npm install @hekeh/easy-audio-player-vue

# Using yarn
yarn add @hekeh/easy-audio-player-vue

# Using pnpm
pnpm add @hekeh/easy-audio-player-vue
```

## Parameters

| Parameter | Description           | Type                 | Required | Default                   |
| --------- | --------------------- | -------------------- | -------- | ------------------------- |
| url       | Audio URL             | `string`             | Yes      | -                         |
| options   | Configuration options | `AudioPlayerOptions` | No       | See options configuration |

### Options Configuration

| Parameter          | Description                           | Type      | Default |
| ------------------ | ------------------------------------- | --------- | ------- |
| stopOthersOnPlay   | Stop other audio players when playing | `boolean` | `true`  |
| showDownloadButton | Show download button                  | `boolean` | `true`  |
