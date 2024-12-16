import { AudioPlayerOptions } from 'easy-audio-player-shared';
import EasyAudioPlayer from '@hekeh/easy-audio-player-react';

const options: AudioPlayerOptions = {
  showDownloadButton: true,
};
const url = '/Richard Wagner - Rienzi Overture.mp3';

export default function App() {
  return (
    <div className="container" style={{ marginTop: '50px' }}>
      <h1>React Easy Audio Player</h1>
      <EasyAudioPlayer options={options} url={url} />
    </div>
  );
}
