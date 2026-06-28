import { useState, useEffect } from 'react';


export default function SearchBar({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  return (
    <input
      type="text"
      className="search-input"
      placeholder="Search tasks..."
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
    />
  );
}