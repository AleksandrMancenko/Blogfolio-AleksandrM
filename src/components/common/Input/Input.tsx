import React, {
type Dispatch,
type SetStateAction,
type InputHTMLAttributes
} from "react";
import { useId } from "react";
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
    const autoId = useId();
    const inputId = id ?? `input-${autoId}`;
    const errorId = errorText ? `${inputId}-error` : undefined;
    return (
        <div className={`${styles.root} ${disabled ? styles.isDisabled : ""} ${errorText ? styles.isError : ""}`}>
           {label && (
            <label className={styles.label} htmlFor={inputId}>
                {label} {required ? <span className={styles.req}>*</span> : null}
            </label>
           )}
           
           <input 
           id={inputId}
           className={styles.input}
           type={type}
           value={value}
           onChange={(e) => onChange(e.target.value)}
           placeholder={placeholder}
           disabled={disabled}
           required={required}
           aria-invalid={Boolean(errorText)}
           aria-describedby={errorId}
           {...rest}
           />

           {errorText ? <div id={errorId} className={styles.error}>{errorText}</div> : null}
        </div>
    );
}