import React, { type Dispatch, type SetStateAction} from "react";
import styles from "./Tabs.module.css"

export type TabItem = {
    value: string;
    label: string;
    disabled?: boolean;
};

type Props ={
    items: TabItem[];
    value: string;
    onChange: Dispatch<SetStateAction<string>>;
    stretch?: boolean;
};

export default function Tabs({ items, value, onChange, stretch = false }: Props){
    return (
        <div 
          className={`${styles.wrap} ${stretch ? styles.stretch : ""}`}
          role="tablist"
          aria-label="Tabs"
        >
          {items.map((it) => {
            const active = it.value === value;
            const className = [
                styles.tab,
                active ? styles.active : "",
                it.disabled ? styles.disabled : "",
            ].join(" ");

            return (
                <button
                  key={it.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={className}
                  onClick={() => !it.disabled && onChange(it.value)}
                  disabled={it.disabled}
                >
                {it.label}
                </button>
            );
          })}
        </div>
    );
}