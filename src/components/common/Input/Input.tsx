import React, {
type Dispatch,
type SetStateAction,
type InputHTMLAttributes
} from "react";
import styles from "./Input.module.css"

type InputType = "text" | "email" | "password";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>,"type" | "value" | "onChange"> & {
    id?: string;
    label?: string;
    type?: InputType;
    value: string;
    onChange: Dispatch<SetStateAction<string>>;
    errorText?: string;
};

export default function Input({
    id,
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    disabled = false,
    required = false,
    errorText,
    ...rest
}:Props) {
    return (
        <div className={`${styles.root} ${disabled ? styles.isDisabled : ""} ${errorText ? styles.isError : ""}`}>
           {label && (
            <label className={styles.label} htmlFor={id}>
                {label} {required ? <span className={styles.req}>*</span> : null}
            </label>
           )}
           
           <input 
           id={id}
           className={styles.input}
           type={type}
           value={value}
           onChange={(e) => onChange(e.target.value)}
           placeholder={placeholder}
           disabled={disabled}
           required={required}
           aria-invalid={!errorText}
           {...rest}
           />

           {errorText ? <div className={styles.error}>{errorText}</div> : null}
        </div>
    );
}