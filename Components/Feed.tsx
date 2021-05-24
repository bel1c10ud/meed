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
        <div className={styles.feedType + ` ${styles.ActiveFeedType}`}>My Feed</div>
      </section>
      <div className={styles.row}>
        <YoutubeCard videoId="WMweEpGlu_U" trackId="3VqeTFIvhxu3DIe4eZVzGq" />
        <ChartCard playlistId="6kbzPEHj3uMPRFsR3v6xzE" chartInfo={melonDailyChart} width={752} />
      </div>
      <div className={styles.row}>
        <TrackCard trackId="6B8MM3PVQtUbZLay7tP7er" />
        <TrackCard trackId="1MtCOuTy3B6fU72LQPvg16" />
        <AlbumCard albumId="2BDhPi2XCYujYxU6VM0QaD" />
        <TrackCard trackId="6kH1sKkvgN4Yikake52glq" />
        <YoutubeCard videoId="4TWR90KJl84" trackId="2zrhoHlFKxFTRF5aMyxMoQ" />
      </div>
      <div className={styles.row}>
        <ChartCard playlistId="37i9dQZEVXbJZGli0rRP3r" chartInfo={spofifyKoreaChart} width={752} />
        <YoutubeCard videoId="HzOjwL7IP_o" trackId="54HsCR7lJJdwxmEnTY1JfF" />
      </div>
      <div className={styles.row}>
        <YoutubeCard videoId="AJPLgrfBiBo" trackId="1MtCOuTy3B6fU72LQPvg16" />
        <YoutubeCard videoId="_X3r09dgbQg" trackId="5BXr7hYZQOeRttkeWYTq5S" />
        <YoutubeCard videoId="_ysomCGaZLw" trackId="2QdH0rKlV3d9Y6lWzcnlBH" />
      </div>
      <div className={styles.row}>
        <YoutubeCard videoId="v7bnOxV4jAc" trackId="5xrtzzzikpG3BLbo4q1Yul" />
        <TrackCard trackId="4as4XEOR03oGm1STUKl6pa" />
        <TrackCard trackId="4Dr2hJ3EnVh2Aaot6fRwDO" />
        <TrackCard trackId="0pYacDCZuRhcrwGUA5nTBe" />
        <TrackCard trackId="4RewTiGEGoO7FWNZUmp1f4" />
      </div>
      <div className={styles.row}>
        <TrackCard trackId="0xKthdfyD9BgnNVVmh2fIx" />
        <TrackCard trackId="3Wp7UAy0xn1QnpKROqDNHC" />
        <YoutubeCard videoId="FCsLikmxhV0" trackId="31LHplV8BL8F0Uu9YbvTAY" />
        <PlaylistCard playlistId="3C6TxEwCOMIgdh55i8uzmA" />
        <PlaylistCard playlistId="1knndR4g4yPjArjNRCPvUk" />
      </div>
    </section>
  )
}