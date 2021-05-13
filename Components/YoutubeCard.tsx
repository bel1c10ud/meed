import axios from 'axios';
import useSWR from 'swr';
import { request } from 'graphql-request';

import { Artist } from './../types';

import { useSetRecoilState } from 'recoil';
import { modalState } from './../recoilStates';

import YoutubeModal from './YoutubeModal';


import styles from './YoutubeCard.module.css';

export default function YoutubeCard({ videoId, trackId } : { videoId: string, trackId: string }) {

  const setModal = useSetRecoilState(modalState);

  const fetcher = (query: string) => request('/api/graphql', query);
  
  const { data, error } = useSWR(`
    {
      getTrack(id: "${trackId}") {
        name
        artists {
          name
        }
      }
    }
  `, fetcher, { revalidateOnFocus: false });

  const openYoutubeModal = () => {
    setModal(() => ({ isModal: true, component: YoutubeModal, props: { id: videoId } }));
  }

  return (
    <article className={styles.area}>
      <div className={styles.cover}>
        <div className={styles.thumbnail}>
          <div className={styles.thumbnailImage} style={{"backgroundImage": `url('https://img.youtube.com/vi/${videoId}/hqdefault.jpg');`}}></div>
          <div className={styles.info}>
            <p className={styles.title}>{data && data.getTrack.name}</p>
            <p className={styles.artist}>{data && data.getTrack.artists.map((artist: Artist) => artist.name)}</p>
          </div>
        </div>
        <button className={styles.playButton} 
        onClick={openYoutubeModal}>
          <img alt="Play" src={""} />
        </button>
      </div>
    </article>
  )
}