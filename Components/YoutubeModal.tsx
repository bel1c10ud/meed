import styles from './YoutubeModal.module.css';

export default function YoutubeModal(props: any) {
  return (
    <div className={styles.area}>
      <div className={styles.video}>
        <iframe src={"http://www.youtube.com/embed/"+ props.id} />
      </div>
    </div>
  )
}