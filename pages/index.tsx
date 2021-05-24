import styles from './index.module.css'

import Modal from './../Components/Modal';
import Navigation from './../Components/Navigation';
import Feed from './../Components/Feed';
import Player from './../Components/Player';

export default function Home() {

  return (
    <div className={styles.area}>
      <Modal />
      {/* <Navigation /> */}
      <Feed />
      <Player />
    </div>
  )
}
