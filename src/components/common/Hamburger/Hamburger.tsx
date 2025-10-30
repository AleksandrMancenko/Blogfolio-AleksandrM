import React from 'react';
import styles from './Hamburger.module.css';

type Props = {
  pressed?: boolean;
  onToggle?: () => void;
  size?: number;
};

const Hamburger: React.FC<Props> = ({ pressed = false, onToggle, size = 120 }) => {
  return (
    <button
      type="button"
      className={styles.box}
      style={{ width: size, height: size }}
      aria-pressed={pressed}
      aria-label={pressed ? 'Close menu' : 'Open menu'}
      onClick={onToggle}
    >
      <span className={styles.icon} aria-hidden="true" />
    </button>
  );
};

export default Hamburger;
export type { Props as HamburgerProps };
