import useSWR from 'swr';
import { request } from 'graphql-request';
import { useSetRecoilState } from 'recoil';

import { Artist, Track } from '../../types';
import { playlistState } from '../../recoilStates';

import styles from './TrackCard.module.css';

export default function TrackCard({ trackId }:{ trackId: string }) {

  const fetcher = (query: string) => request('/api/graphql', query);
  
  const { data, error } = useSWR(`
    {
      getTrack(id: "${trackId}") {
        id
        name
        artists {
          name
        }
        album {
          name
          images {
            url
          }
        }
      }
    }
  `, fetcher, { revalidateOnFocus: false });

  const setPlaylist = useSetRecoilState(playlistState);

  const addPlaylist = () => {
    setPlaylist({ 
      playingId: undefined, 
      playedIds: [],
      tracks: [ data.getTrack.id ]
    });
  }

  return (
    <article className={styles.area}>
      <div className={styles.cover}>
        <img className={styles.albumArt} alt="album art" src={data && data.getTrack.album.images[1].url} />
        <div className={styles.Info}>
        </div> 
        <button className={styles.playButton} onClick={addPlaylist}>
          <img alt="play" src="/svg/playCard.svg" />
        </button>
      </div>
      <div className={styles.trackInfo}>
        <p className={styles.title}>{ data && data.getTrack.name}</p>
        <p className={styles.artists}>{ data && data.getTrack.artists.map((artist: Artist) => artist.name).join(', ')}</p>
      </div>
    </article>
  )
}