// src/components/common/UserTitle/UserTitle.tsx
import { FC } from 'react';
import styles from './UserTitle.module.css';
import { getFirstCapitalLetters } from '../../../utils/functions/getFirstCapitalLetters';

interface Props {
  userName: string;
  rightSlot?: React.ReactNode;
}

export const UserTitle: FC<Props> = ({ userName, rightSlot }) => {
  const cleanName = userName.trim();
  const initials = getFirstCapitalLetters(cleanName);

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.avatar}>{initials}</div>
        <p className={styles.userName}>{cleanName}</p>
      </div>
      {rightSlot && <div className={styles.right}>{rightSlot}</div>}
    </div>
  );
};

export default UserTitle;
