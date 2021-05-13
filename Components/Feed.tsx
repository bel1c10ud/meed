import styles from './Feed.module.css';

import YoutubeCard from './YoutubeCard';
import ChartCard from './ChartCard';
import AlbumCard from './AlbumCard';

export default function Feed() {
  return (
    <section className={styles.area}>
      <YoutubeCard videoId="v7bnOxV4jAc" trackId="5xrtzzzikpG3BLbo4q1Yul" />
      <ChartCard playlistId="6kbzPEHj3uMPRFsR3v6xzE" />
      <AlbumCard albumId="01dPJcwyht77brL4JQiR8R" />
    </section>
  )
}