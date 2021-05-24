import Head from 'next/head'

import { BaseSyntheticEvent, useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { request } from 'graphql-request';

import { playerState, playbackStringState, playlistState, playingTrackState } from '../recoilStates';
import { findUnusedRandomId } from './../utility';

import styles from './Player.module.css';
import { Playlist } from '../types';

export default function Player() {
  const [player, setPlayer] = useRecoilState(playerState);
  const [playlist, setPlaylist] = useRecoilState<Playlist>(playlistState);
  const [playingTrack, setPlayingTrack] = useRecoilState(playingTrackState);

  const playbackString = useRecoilValue(playbackStringState);

  const audioElement = useRef<HTMLAudioElement>(null);

  const updatePlayerCurrentTime = (e: BaseSyntheticEvent) => setPlayer( state => ({ ...state, currentTime: e.target.currentTime }) );

  const setAudioElementCurrentTime = (e: BaseSyntheticEvent) => {
    setPlayer( state => ({ ...state, currentTime: Number(e.target.value) }) );

    if(audioElement && audioElement.current)
      audioElement.current.currentTime = Number(e.target.value);
  };

  const updatePlayerStatus = (e: BaseSyntheticEvent) => setPlayer(state => ({ ...state, status: e.type.toUpperCase() }));

  const playPause = () => {
    if(audioElement && audioElement.current) {
      if(!(audioElement.current.paused)) audioElement.current.pause();
      else if(audioElement.current.paused) audioElement.current.play();
    }
  };

  const updatePlayerVolume = (e: BaseSyntheticEvent) => setPlayer( state => ({ ...state, volume: e.target.value }) );

  const fetchTrack = async (trackId: string) => {
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
  }

  const initPlayingId = () => {
    if(player.isShuffle) {
      // 랜덤 재생
      setPlaylist(state => {
        const randomId = Math.floor( Math.random() * (state.tracks.length + 1) );
        return { ...state, playingId: randomId, playedIds: [ randomId ] };
      });
    } else {
      // 0번부터 재생
      setPlaylist(state => ({ ...state, playingId: 0, playedIds: [ 0 ] }));
    }
  }

  const changePlayingId = (direction: "prev"|"next") => {
    if(player.isShuffle === true) {
      // 재생했던곡 배열에 넣고, 재생목록 배열에서 랜덤으로 꺼내기
      const newPlayingId = findUnusedRandomId(playlist.tracks.map((c,i) => i), playlist.playedIds);

      if(newPlayingId !== undefined) {
        // 새 playing id가 있다면
        setPlaylist(state => ({ ...state, playingId: newPlayingId, playedIds: state.playedIds.concat(newPlayingId) }));
      } else {
        // 새 playing id가 없고
        if(player.isLoop) {
          // 루프가 켜져 있으면
          initPlayingId();
        } else {
          // 루프가 꺼져 있으면
          console.log("다음곡이 없습니다.(isShuffle: true)", playlist.playedIds);
        }
      }
    } else {
      // 순서대로
      const directionNum = direction === "prev" ? -1 : 1;

      if(playlist.playingId !== undefined) {
        const newPlayingId = playlist.playingId + directionNum;

        if(playlist.tracks[newPlayingId] !== undefined) {
          // 다음 곡이 있다면
          setPlaylist( state => ({ ...state, playingId: newPlayingId, playedIds: state.playedIds.concat(newPlayingId) }) );
        } else {
          // 다음 곡이 없다면
          if(player.isLoop) {
            // 루프가 활성화 되어 있다면
            initPlayingId();
          } else {
            // 루프가 비활성화 되어 있다면
            console.log("다음곡이 없습니다.");
          }
        }
      }

    }
  }

  useEffect(() => { // playlist가 변경되면
    if(playlist.tracks.length !== 0) {
      // 플레이리스트에 트랙이 있을 때
      if(playlist.playingId === undefined) {
        // 정해진 ID가 없을 때
        initPlayingId();
      } 

      if(playlist.playingId !== undefined) {
        // 정해진 ID가 있을 때
        fetchTrack( playlist.tracks[playlist.playingId] );
      }
    } 
  }, [playlist]);

  useEffect(() => { // playingTrack이 변경되면
    if(playingTrack?.preview_url) {
      return playPause();
    } else {
      console.log("재생할 수 없는 곡입니다.", playingTrack);
      const timer = setTimeout(() => {
        if(playingTrack?.preview_url === null) {
          changePlayingId('next');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [playingTrack]);

  useEffect(() => { // set mediaSession metadata
    if(navigator.mediaSession) {
      navigator.mediaSession.metadata = new MediaMetadata({
        album: playingTrack?.album.name,
        artist: playingTrack?.artists.map(artist => artist.name).join(", "),
        title: playingTrack?.name,
        artwork: playingTrack?.album.images.map(image => ({ size: `${image.width}x${image.height}`, src: image.url }))
      });
    }
  }, [playingTrack]);

  useEffect(() => { // set volume
    if(audioElement && audioElement.current) {
      audioElement.current.volume = (player.volume / 100);
    }
  }, [player.volume]);

  useEffect(() => { // player status
    if(audioElement.current) {
      if(player.status === "PAUSE" && (audioElement.current.paused === false)) {
        audioElement.current.pause();
      }
    }
  }, [player.status]);

  return (
    <section className={styles.area}>
{ playingTrack && player.status === "PLAYING" &&
      <Head>
        <title>
          { `${playingTrack.name} · ${playingTrack.artists.map(artist => artist.name).join(", ")}` }
        </title>
      </Head>    
}
      <audio ref={audioElement}
      className={styles.audioElement} 
      src={playingTrack?.preview_url ?? ""}
      onTimeUpdate={updatePlayerCurrentTime}
      onPlaying={updatePlayerStatus}
      onPause={updatePlayerStatus}
      onEnded={() => changePlayingId("next")}
      controls
      />
      <div className={styles.container}>
        <div className={styles.track}>
        { playingTrack ? 
          <img className={styles.albumArt} alt="album art" src={playingTrack.album.images[2]?.url ?? ""} /> 
        : <div className={styles.albumArt}></div> 
        }
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
            <button onClick={() => setPlayer(state => ({ ...state, isLoop: !(state.isLoop) }))}>
{ player.isLoop ? 
              <img alt="loop on" src="/svg/loop.svg" /> 
            : <img alt="loop off" src="/svg/loopOff.svg" />
}
            </button>
            <button 
            onClick={() => changePlayingId("prev")}
            >
              <img alt="prev" src="/svg/prev.svg" />
            </button>
            <button onClick={playPause}>
            { player.status === "PLAYING" ? 
              <img alt="pause" src="/svg/pause.svg" /> 
              : <img alt="play" src="/svg/play.svg" /> }
            </button>
            <button 
            onClick={() => changePlayingId("next")}
            >
              <img alt="next" src="/svg/next.svg" />
            </button>
            <button onClick={() => setPlayer(state => ({ ...state, isShuffle: !(state.isShuffle) }))}>
{ player.isShuffle ?
              <img alt="shuffle on" src="/svg/shuffle.svg" /> 
            : <img alt="shuffle off" src="/svg/shuffleOff.svg" /> 
}
            </button>
          </div>
          <div className={styles.playbackProgress}>
            <p className={styles.currentTime}>
              { playbackString.currrentString }
            </p>
            <input className={styles.rangeInput}
            type="range" 
            min="0" max={player.previewDuration.toString()} 
            value={player.currentTime} 
            onChange={setAudioElementCurrentTime}
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
          onChange={updatePlayerVolume}
          />
        </div>
      </div>
    </section>
  )
}