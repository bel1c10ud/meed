import useSWR from 'swr';
import { request } from 'graphql-request';
import { useSetRecoilState } from 'recoil';

import { Artist, Track } from './../types';
import { playerState, playlistState } from './../recoilStates';

import styles from './AlbumCard.module.css';

export default function AlbumCard({ albumId }:{ albumId: string }) {

  const fetcher = (query: string) => request('/api/graphql', query);
  
  const { data, error } = useSWR(`
    {
      getAlbum(id: "${albumId}") {
        name
        artists {
          name
        }
        images {
          url
        }
        tracks {
          items {
              id
          }
        }
      }
    }
  `, fetcher, { revalidateOnFocus: false });

  const setPlayer = useSetRecoilState(playerState);
  const setPlaylist = useSetRecoilState(playlistState);

  const addPlaylist = () => {
    setPlayer(state => ({ ...state, status: "PAUSE" }));
    const items: Track[] = Array.from(data.getAlbum.tracks.items);
    setPlaylist({ 
      playingId: 0, 
      tracks: items.map((track) => track.id)
    });
  }

  return (
    <article className={styles.area}>
      <img className={styles.albumArt} alt="album art" src={data && data.getAlbum.images[1].url} />
      <div className={styles.Info}>
        <p className={styles.title}>
          { data && data.getAlbum.name }
        </p>
        <p className={styles.artist}>
          { data && data.getAlbum.artists.map((artist: Artist) => <span>{artist.name}</span>)}
        </p>
      </div>
      <button className={styles.playButton} onClick={addPlaylist}>
        <img alt="play" src="" />
      </button>
    </article>
  )
}