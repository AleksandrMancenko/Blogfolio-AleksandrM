import React, { ReactNode } from 'react';
import styles from './OverlayMenu.module.css';

type Props = {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

const OverlayMenu: React.FC<Props> = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <aside className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <nav className={styles.list}>
          {children ?? (
            <>
              <a href="#">Profile</a>
              <a href="#">Settings</a>
              <a href="#">Log Out</a>
            </>
          )}
        </nav>
      </aside>
    </div>
  );
};

export default OverlayMenu;
