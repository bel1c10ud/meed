import { useRecoilState } from 'recoil';
import { modalState } from './../recoilStates';

import styles from './Modal.module.css';

export default function Modal() {
  const [modal, setModal] = useRecoilState(modalState);

  if(!modal.isModal)
    return <></>
  
  return (
    <div className={styles.area} onClick={() => {setModal(state => ({ ...state, isModal: false }))}}>
      {modal.component && <modal.component {...modal.props} /> }
      <div className={styles.anchorPoint}></div>
    </div>
  )
}