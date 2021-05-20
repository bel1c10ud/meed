import useSWR from 'swr';
import { request } from 'graphql-request';
import { useSetRecoilState } from 'recoil';

import { Artist, Track } from './../../types';
import { playlistState } from './../../recoilStates';

import styles from './AlbumCard.module.css';

export default function AlbumCard({ albumId, melonAlbumId, width }:{ albumId: string, melonAlbumId?: string, width?: number }) {

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
${ melonAlbumId ?  `
      getMelonAlbumData(id: "${melonAlbumId}") {
        description
      }
  ` : ""
}
    }
  `, fetcher, { revalidateOnFocus: false });

  const setPlaylist = useSetRecoilState(playlistState);

  const addPlaylist = () => {
    const items: Track[] = Array.from(data.getAlbum.tracks.items);
    setPlaylist({ 
      playingId: undefined, 
      playedIds: [],
      tracks: items.map((track) => track.id)
    });
  }

  const albumStyle = {
    width: (width ?? "219") + "px",
    "--card-width": (width ?? "219") + "px"
  }

  return (
    <article 
    className={ melonAlbumId ? `${styles.area} ${styles.descriptionType}`: styles.area }
    style={albumStyle}
    >
      <div className={styles.cover}>
        <img className={styles.albumArt} alt="album art" src={data && data.getAlbum.images[1].url} />
        <div className={styles.Info}>
{ melonAlbumId === undefined && 
        <>
          <p className={styles.title}>
            { data && data.getAlbum.name }
          </p>
          <p className={styles.artist}>
            { data && data.getAlbum.artists.map((artist: Artist) => <span>{artist.name}</span>)}
          </p>
        </>
}
        </div> 
        <button className={styles.playButton} onClick={addPlaylist}>
          <img alt="play" src="/svg/playCard.svg" />
        </button>
      </div>
{ melonAlbumId && 
      <div className={styles.description}>
        <div className={styles.body}>
          <p className={styles.title}>{ data && data.getAlbum.name }</p>
          <p className={styles.artist}>{ data && data.getAlbum.artists.map((artist: Artist) => <span>{artist.name}</span>) }</p>
          <p className={styles.text}>{ data && data.getMelonAlbumData.description }</p>
        </div>
      </div>
}
    </article>
  )
}