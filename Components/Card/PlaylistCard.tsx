import useSWR from 'swr';
import { request } from 'graphql-request';
import { useSetRecoilState } from 'recoil';

import { Artist, Track } from '../../types';
import { playerState, playlistState } from '../../recoilStates';

import styles from './PlaylistCard.module.css';

export default function PlaylistCard({ playlistId }:{ playlistId: string }) {

  const fetcher = (query: string) => request('/api/graphql', query);
  
  const { data, error } = useSWR(`{
    getPlaylist(id: "${playlistId}") {
      name
      owner {
        display_name
      }
      images {
        url
      }
      tracks {
        items {
          track {
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
      }
    }
  }`, fetcher, { revalidateOnFocus: false });

  const setPlayer = useSetRecoilState(playerState);
  const setPlaylist = useSetRecoilState(playlistState);

  const addPlaylist = () => {
    const items: { track: Track }[] = Array.from(data.getPlaylist.tracks.items);
    const tracksIdArray = items.map( (item) => item.track.id );
    setPlaylist({ 
      playingId: undefined, 
      playedIds: [],
      tracks: tracksIdArray
    });
  }

  return (
    <article className={styles.area}>
      <img className={styles.playlistCover} alt="playlist cover" src={data && data.getPlaylist.images[0].url} />
      <div className={styles.Info}>
        <p className={styles.trackCount}>
        { data && `${data.getPlaylist.tracks.items.length} 트랙` }
        </p>
      </div>
      <button className={styles.playButton} onClick={addPlaylist}>
        <img alt="play" src="/svg/playCard.svg" />
      </button>
      <div className={styles.playlistInfo}>
        <p className={styles.title}>
          { data && data.getPlaylist.name }
        </p>
        <p className={styles.owner}>
          { data && data.getPlaylist.owner.display_name }
        </p>
      </div>
    </article>
  )
}