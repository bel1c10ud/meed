import useSWR from 'swr';
import { request } from 'graphql-request';
import { useRecoilState } from 'recoil';

import { playlistState } from './../../recoilStates';

import styles from './ChartCard.module.css';

import PlaylistItem from './../PlaylistItem';
import { ChartInfo, Track } from '../../types';


export default function ChartCard({ playlistId, chartInfo, width }: { playlistId: string, chartInfo: ChartInfo, width: number }) {

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
      tracks: data.getPlaylist.tracks.items.map(({ track }: { track: Track }) => track.id),
      playedIds: [playingId]
    });
  };

  const ChartStyles = {
    "--chart-label-color": chartInfo.labelColor,
    "--chart-text-color": chartInfo.textColor
  }

  return (
    <article className={styles.area} style={{ ...ChartStyles, "width": width+"px" }}>
      <div className={styles.label}>
        <div className={styles.anchor}></div>
        <div className={styles.titleWrap}>
          <div className={styles.logo}>
            <img alt="melon" src={chartInfo.logo ?? ""} />
          </div>
          <div className={styles.name}>
            { chartInfo && chartInfo.name }
          </div>
        </div>
      </div>
      <div className={styles.rank} style={{"width": (width - 130 - 30) + "px"}}>
        <div className={styles.rankWrap}>
          { data && 
          data.getPlaylist.tracks.items.map( (item: any, i: number) => <PlaylistItem key={item.track.id} id={i} track={item.track} addPlaylist={addPlaylist} />).slice(0,5)}
        </div>
        <div className={styles.rankWrap}>
          { data && 
          data.getPlaylist.tracks.items.map( (item: any, i: number) => <PlaylistItem key={item.track.id} id={i} track={item.track} addPlaylist={addPlaylist} />).slice(5,10)}
        </div>      
        <div className={styles.rankWrap}>
          { data && 
          data.getPlaylist.tracks.items.map( (item: any, i: number) => <PlaylistItem key={item.track.id} id={i} track={item.track} addPlaylist={addPlaylist} />).slice(10,15)}
        </div>      
        <div className={styles.rankWrap}>
          { data && 
          data.getPlaylist.tracks.items.map( (item: any, i: number) => <PlaylistItem key={item.track.id} id={i} track={item.track} addPlaylist={addPlaylist} />).slice(15,20)}
        </div>
      </div>
    </article>
  )
}

