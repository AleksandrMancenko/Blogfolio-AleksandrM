import React from "react";
import styles from "./Button.module.css";
type ButtonProps = {
    variant?: "primary" | "secondary" | "secondary2";
    disabled?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    disabled = false,
    onClick,
    children,
}) => {
    return(
        <button
        className={`${styles.btn} ${styles[variant]} ${
            disabled ? styles.disabled : ""
        }`}
        disabled={disabled}
        onClick={onClick}
        >
        {children}
        </button>
    );
};

export default Button;