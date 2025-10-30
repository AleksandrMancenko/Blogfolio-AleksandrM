import React from 'react';
import styles from './Title.module.css';

type Props = {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3';
};

const Title: React.FC<Props> = ({ children, as = 'h1' }) => {
  const Tag = as as keyof JSX.IntrinsicElements;
  return (
    <div className={styles.wrapper}>
      <Tag className={styles.title}>{children}</Tag>
    </div>
  );
};

export default Title;
export type { Props as TitleProps };
