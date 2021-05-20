import styles from './Feed.module.css';

import YoutubeCard from './Card/YoutubeCard';
import ChartCard from './Card/ChartCard';
import AlbumCard from './Card/AlbumCard';
import TrackCard from './Card/TrackCard';
import PlaylistCard from './Card/PlaylistCard';
import { ChartInfo } from '../types';

export default function Feed() {
  const melonDailyChart: ChartInfo = {
    logo: "/svg/melon.svg",
    name: "일간차트",
    labelColor: "rgba(0, 205, 60, 1)",
    textColor: "rgba(0, 205, 60, 1)",
  }

  const spofifyKoreaChart: ChartInfo = {
    logo: "/svg/spotify.svg",
    name: "인기곡 - 대한민국",
    labelColor: "rgba(29, 185, 84, 1)",
    textColor: "rgba(29, 185, 84, 1)",
  }

  return (
    <section className={styles.area}>
      <section className={styles.feedTypes}>
        <div className={styles.feedType + ` ${styles.ActiveFeedType}`}>My</div>
        <div className={styles.feedType}>추천</div>
        <div className={styles.feedType}>인기</div>
      </section>
      <div className={styles.row}>
        <YoutubeCard videoId="v7bnOxV4jAc" trackId="5xrtzzzikpG3BLbo4q1Yul" />
        <ChartCard playlistId="6kbzPEHj3uMPRFsR3v6xzE" chartInfo={melonDailyChart} width={509} />
        <AlbumCard albumId="71hjsg660uio3Z8bnbB6fS" />
      </div>
      <div className={styles.row}>
        <AlbumCard albumId="01dPJcwyht77brL4JQiR8R" melonAlbumId="10554246" width={509} />
        <TrackCard trackId="2pn8dNVSpYnAtlKFC8Q0DJ" />
        <YoutubeCard videoId="_ysomCGaZLw" trackId="2QdH0rKlV3d9Y6lWzcnlBH" />
      </div>
      <div className={styles.row}>
        <ChartCard playlistId="37i9dQZEVXbJZGli0rRP3r" chartInfo={spofifyKoreaChart} width={897} />
        <PlaylistCard playlistId="59LUwJVpBHWjxyKDDuz4Ld" />
      </div>
     
    </section>
  )
}