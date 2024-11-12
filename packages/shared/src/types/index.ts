export interface AudioPlayerOptions {
  showDownloadButton?: boolean;
}

export interface EasyAudioPlayerProps {
  /** Audio source URL */
  url: string;
  /** Player configuration options */
  options: AudioPlayerOptions;
}
