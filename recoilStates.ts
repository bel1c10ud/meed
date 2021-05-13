import { atom, selector } from 'recoil';
import { Track, PlayerState, Playlist } from './types';

export const modalState = atom<{isModal:boolean, component:any, props: any}>({
  key: "modalState",
  default: {
    isModal: false,
    component: undefined,
    props: {}
  }
})

export const playerState = atom<PlayerState>({
  key: "playerState",
  default: {
    status: "PAUSE",
    volume: 10,
    currentTime: 0,
    previewDuration: 30.040816,
    isLoop: false
  }
});

export const playbackStringState = selector({
  key: "playbackStringState",
  get: ({ get }) => {
    const { currentTime, previewDuration } = get(playerState);

    const currentMinute = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime) % 60;
    const durationMinute = Math.floor(previewDuration / 60);
    const durationSeconds = Math.floor(previewDuration) % 60;

    return {
      currrentString: currentMinute + ":" + (currentSeconds < 10 ? "0"+currentSeconds : currentSeconds),
      durationString: durationMinute + ":" + durationSeconds 
    }
  }
})

export const playlistState = atom<Playlist>({
  key: "playlistState",
  default: {
    playingId: 0,
    tracks: []
  }
})

export const playingTrackState = atom<Track|undefined>({
  key: "playingTrackState",
  default: undefined
})