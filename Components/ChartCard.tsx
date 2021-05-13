import useSWR from 'swr';
import { request } from 'graphql-request';
import { useRecoilState } from 'recoil';

import { playlistState } from './../recoilStates';

import styles from './ChartCard.module.css';

import PlaylistItem from './PlaylistItem';
import { Track } from '../types';


export default function ChartCard({ playlistId }: { playlistId: string }) {

  const [playlist, setPlaylist] = useRecoilState(playlistState);

  const fetcher = (query: string) => request('/api/graphql', query);
  
  const { data, error } = useSWR(`{
    getPlaylist(id: "${playlistId}") {
      name
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

  const addPlaylist = (playingId: number) => {
    setPlaylist({ 
      playingId: playingId, 
      tracks: data.getPlaylist.tracks.items.map(({ track }: { track: Track }) => track.id)
    });
  };

  return (
    <article className={styles.area}>
      <div className={styles.title}>
        <div className={styles.titleWrap}>
          <div className={styles.logo}>
            <img alt="melon" src="/img/logo_melon.png" />
          </div>
          <div className={styles.name}>
            일간차트
          </div>
        </div>
      </div>
      <div className={styles.rank1to5}>
        { data && 
        data.getPlaylist.tracks.items.map( (item: any, i: number) => <PlaylistItem key={item.track.id} id={i} track={item.track} addPlaylist={addPlaylist} />).slice(0,5)}
      </div>
      <div className={styles.rank5to10}>
        { data && 
        data.getPlaylist.tracks.items.map( (item: any, i: number) => <PlaylistItem key={item.track.id} id={i} track={item.track} addPlaylist={addPlaylist} />).slice(5,10)}
      </div>
    </article>
  )
}

