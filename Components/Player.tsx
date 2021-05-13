
import { BaseSyntheticEvent, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { request } from 'graphql-request';

import { playerState, playbackStringState, playlistState, playingTrackState } from '../recoilStates';

import styles from './Player.module.css';

export default function Player() {
  const [player, setPlayer] = useRecoilState(playerState);
  const playbackString = useRecoilValue(playbackStringState);

  const [playingTrack, setPlayingTrack] = useRecoilState(playingTrackState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  const updateCurrentTime = (e: BaseSyntheticEvent) => setPlayer( state => ({ ...state, currentTime: e.target.currentTime }) );

  const setCurrentTime = (e: BaseSyntheticEvent) => {
    setPlayer( state => ({ ...state, currentTime: Number(e.target.value) }) );
    const audioElement: HTMLAudioElement|null = document.querySelector(`.${styles.audioElement}`);
    if(audioElement && audioElement.currentTime) audioElement.currentTime = Number(e.target.value);
  };

  const updateStatus = (e: BaseSyntheticEvent) => setPlayer(state => ({ ...state, status: e.type.toUpperCase() }));

  const playPause = (e: BaseSyntheticEvent) => {
    const audioElement: HTMLAudioElement|null = document.querySelector(`.${styles.audioElement}`);

    if(player.status === "PLAYING") audioElement?.pause();
    else if(player.status === "PAUSE") audioElement?.play();
    
  };

  const changeVolume = (e: BaseSyntheticEvent) => setPlayer( state => ({ ...state, volume: e.target.value }) );

  const nextTrack = () => {
    if(playlist.tracks.length > (playlist.playingId + 1)) {
      setPlaylist(state => ({ ...state, playingId: state.playingId + 1 }));
    } else {
      setPlaylist(state => ({ ...state, playingId: 0 }));
    }
  }

  const prevTrack = () => {
    if(playlist.playingId >= 1) {
      setPlaylist(state => ({ ...state, playingId: state.playingId - 1 }));
    } else {
      setPlaylist(state => ({ ...state, playingId: state.tracks.length-1 }));
    }
  }

  const setTrack = async (trackId: string) => {
    const data = await request('/api/graphql',`
      {
        getTrack(id: "${trackId}") {
          name
          artists {
            name
          }
          preview_url
          album {
            images {
              width
              height
              url
            }
          }
        }
      }
    `);

    setPlayingTrack(data.getTrack);
    // return data.getTrack
  }

  useEffect(() => { // playing id가 변경되면 fetch
    console.log("playing id change: ", playlist.playingId);
    if(playlist.tracks.length !== 0) {
      setTimeout(() => {
        setTrack( playlist.tracks[playlist.playingId] );
      }, 250);
    }
  }, [playlist])

  // set volume
  useEffect(() => {
    const audioElement: HTMLAudioElement|null = document.querySelector(`.${styles.audioElement}`);
    if(audioElement) audioElement.volume = (player.volume / 100);
  }, [player.volume]);

  return (
    <section className={styles.area}>
      <audio className={styles.audioElement} 
      src={playingTrack && playingTrack.preview_url}
      onTimeUpdate={updateCurrentTime}
      onPlaying={updateStatus}
      onPause={updateStatus}
      onEnded={nextTrack}
      controls
      autoPlay
      />
      <div className={styles.container}>
        <div className={styles.track}>
          <img className={styles.albumArt} alt="album art" src={playingTrack?.album.images[2].url} />
          <div className={styles.trackInfo}>
            <p className={styles.title}>
              { playingTrack ? playingTrack.name : "재생 목록이 비어있습니다"}
            </p>
            <p className={styles.artist}>
              { playingTrack ? playingTrack.artists.map(artist => <span>{artist.name}</span>) : "재생 목록이 비어있습니다"}
            </p>
          </div>
        </div>
        <div className={styles.controls}>
          <div className={styles.buttons}>
            <button>8</button>
            <button onClick={prevTrack}>{"<<"}</button>
            <button onClick={playPause}>
              { player.status === "PLAYING" ? "ll" : ">" }
            </button>
            <button onClick={nextTrack}>{">>"}</button>
            <button>{ player.status }</button>
          </div>
          <div className={styles.playbackProgress}>
            <p className={styles.currentTime}>
              { playbackString.currrentString }
            </p>
            <input className={styles.rangeInput}
            type="range" 
            min="0" max={player.previewDuration.toString()} 
            value={player.currentTime} 
            onChange={setCurrentTime}
            />
            <p className={styles.playbackDuration}>
              { playbackString.durationString }
            </p>
          </div>
        </div>
        <div className={styles.extraControls}>
          <input className={styles.volumeRange}
          type="range" 
          min="0" max="100" 
          value={player.volume}  
          onChange={changeVolume}
          />
        </div>
      </div>
    </section>
  )
}