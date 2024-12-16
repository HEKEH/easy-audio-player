# "Easy Audio Player"

[English](README.md) | [中文](README.zh-cn.md)

## 介绍

Easy Audio Player 是一个简单的音频播放器，支持 Vue 3 和 React。

![视图](img/demo.png)

## 安装

### Vue 3

```bash
# 使用 npm
npm install @hekeh/easy-audio-player-vue

# 使用 yarn
yarn add @hekeh/easy-audio-player-vue

# 使用 pnpm
pnpm add @hekeh/easy-audio-player-vue
```

### React

```bash
# Using npm
npm install @hekeh/easy-audio-player-react

# Using yarn
yarn add @hekeh/easy-audio-player-react

# Using pnpm
pnpm add @hekeh/easy-audio-player-react
```

## 参数

| 参数    | 说明     | 类型                 | 必填 | 默认值            |
| ------- | -------- | -------------------- | ---- | ----------------- |
| url     | 音频链接 | `string`             | 是   | -                 |
| options | 配置项   | `AudioPlayerOptions` | 否   | 参照options配置项 |

### options 配置项

| 参数               | 说明                         | 类型      | 默认值 |
| ------------------ | ---------------------------- | --------- | ------ |
| stopOthersOnPlay   | 播放时是否停止其他音频播放器 | `boolean` | `true` |
| showDownloadButton | 是否显示下载按钮             | `boolean` | `true` |
