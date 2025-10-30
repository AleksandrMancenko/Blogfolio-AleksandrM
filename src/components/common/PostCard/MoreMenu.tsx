import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './MoreMenu.module.css';

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function MoreMenu({ onEdit, onDelete }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    onEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    onDelete();
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 120;

      // Рассчитываем позицию для портала
      const left = Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 10);
      const top = rect.bottom + 4;

      setDropdownStyle({
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 10000,
      });
    }

    setIsOpen(!isOpen);
  };

  // Закрываем меню при скролле
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const dropdownContent = isOpen ? (
    <div className={styles.dropdown} style={dropdownStyle}>
      <button className={styles.menuItem} type="button" onClick={handleEdit}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M11.333 2a1.333 1.333 0 0 1 1.334 1.333v9.334a1.333 1.333 0 0 1-1.334 1.333H4.667a1.333 1.333 0 0 1-1.334-1.333V3.333A1.333 1.333 0 0 1 4.667 2h6.666zM4.667 3.333v9.334h6.666V3.333H4.667z"
            fill="currentColor"
          />
          <path
            d="M6.667 5.333h2.666v1.334H6.667V5.333zm0 2h2.666v1.334H6.667V7.333zm0 2h2.666v1.334H6.667V9.333z"
            fill="currentColor"
          />
        </svg>
        Edit
      </button>
      <button className={styles.menuItem} type="button" onClick={handleDelete}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M6.5 2a.5.5 0 0 0-.5.5v1H4a.5.5 0 0 0 0 1h8a.5.5 0 0 0 0-1h-2v-1a.5.5 0 0 0-.5-.5h-3zM4 5.5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5H4z"
            fill="currentColor"
          />
        </svg>
        Delete
      </button>
    </div>
  ) : null;

  return (
    <>
      <div className={styles.container} ref={menuRef}>
        <button
          ref={buttonRef}
          className={styles.moreBtn}
          type="button"
          aria-label="More options"
          onClick={toggleMenu}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="2" r="1.5" fill="currentColor" />
            <circle cx="8" cy="8" r="1.5" fill="currentColor" />
            <circle cx="8" cy="14" r="1.5" fill="currentColor" />
          </svg>
        </button>
      </div>

      {dropdownContent && createPortal(dropdownContent, document.body)}
    </>
  );
}
