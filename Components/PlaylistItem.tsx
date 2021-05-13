import { Track, Artist } from '../types';

import styles from './PlaylistItem.module.css';

export default function PlaylistItem({ id, track, addPlaylist }: { id: number, track: Track,  addPlaylist: Function }) {
  return (
    <div className={styles.area} onClick={() => addPlaylist(id)}>
      <div className={styles.rank}>
        <span>{id+1}</span>
      </div>
      <div className={styles.albumArt}>
        <img alt="album art" src={track.album.images[track.album.images.length-1].url} />
      </div>
      <div className={styles.trackInfo}>
        <p className={styles.title}>{track.name}</p>
        <p className={styles.artist}>
          { track.artists.map((artist: Artist) => <span>{artist.name}</span>) }
        </p>
      </div>
    </div>
  )
}