import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSearchHistory } from '../../../features/search/searchHistorySlice';
import styles from './SearchAutocomplete.module.css';

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  className?: string;
}

export default function SearchAutocomplete({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search…',
  className = '',
}: SearchAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchHistory = useAppSelector(selectSearchHistory);

  // Фильтруем историю по введенному тексту
  const filteredSuggestions = searchHistory.filter(
    (item) => item.toLowerCase().includes(value.toLowerCase()) && item !== value,
  );

  // Показываем dropdown только если есть предложения и поле не пустое
  const shouldShowDropdown = isOpen && filteredSuggestions.length > 0 && value.trim().length > 0;

  // Обработка изменения значения
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
  };

  // Обработка фокуса
  const handleFocus = () => {
    setIsOpen(true);
  };

  // Обработка клика вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Обработка клавиатуры - только Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  // Обработка клика по предложению
  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    // Вызываем onSubmit с правильным значением
    setTimeout(() => {
      onSubmit();
    }, 0);
  };

  const listboxId = 'search-autocomplete-listbox';
  return (
    <div className={`${styles.container} ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={styles.input}
        aria-expanded={shouldShowDropdown}
        aria-haspopup="listbox"
        aria-controls={shouldShowDropdown ? listboxId : undefined}
        role="combobox"
      />

      {shouldShowDropdown && (
        <div ref={dropdownRef} className={styles.dropdown} role="listbox" id={listboxId}>
          {filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion}
              className={styles.suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              role="option"
              aria-selected={false}
            >
              <span className={styles.suggestionText}>{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
