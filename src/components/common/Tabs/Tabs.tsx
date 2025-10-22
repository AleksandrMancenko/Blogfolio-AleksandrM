import styles from "./Tabs.module.css";

export type TabItem = { value: string; label: string };
type Props = { items: TabItem[]; value: string; onChange: (v: string) => void };

export default function Tabs({ items, value, onChange }: Props) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Filters">
      {items.map(({ value: v, label }) => (
        <button
          key={v}
          type="button"
          role="tab"
          aria-selected={value === v}
          className={styles.tabBtn}
          onClick={() => onChange(v)}
        >
          <span className={styles.label}>{label}</span>
        </button>
      ))}
    </div>
  );
}
