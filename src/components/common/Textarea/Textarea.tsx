import React, { type Dispatch, type SetStateAction, type TextareaHTMLAttributes } from 'react';
import styles from './Textarea.module.css';

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'> & {
  id?: string;
  label?: string;
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  errorText?: string;
};

export default function Textarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  errorText,
  rows = 6,
  ...rest
}: Props) {
  const state = disabled ? 'disabled' : errorText ? 'error' : value ? 'filled' : 'default';
  const errorId = id ? `${id}-error` : undefined;
  const describedBy = errorText && errorId ? errorId : undefined;

  return (
    <div
      className={`${styles.root} ${disabled ? styles.isDisabled : ''} ${errorText ? styles.isError : ''}`}
      data-state={state}
    >
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label} {required ? <span className={styles.req}>*</span> : null}
        </label>
      )}

      <textarea
        id={id}
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!errorText}
        aria-describedby={describedBy}
        rows={rows}
        {...rest}
      />

      {errorText ? (
        <div id={errorId} className={styles.error}>
          {errorText}
        </div>
      ) : null}
    </div>
  );
}
