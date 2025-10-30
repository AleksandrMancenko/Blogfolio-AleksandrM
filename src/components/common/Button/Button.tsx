import React from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'secondary2';
  disabled?: boolean;
  pressed?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  disabled = false,
  pressed = false,
  onClick,
  children,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]} ${disabled ? styles.disabled : ''}`}
      disabled={disabled}
      aria-pressed={pressed}
      data-variant={variant}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
