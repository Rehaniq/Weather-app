import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { searchCities } from '../api';
import { useDebounce } from '../useDebounce';

export default function SearchBar({ onSelect }) {
  const [text, setText] = useState('');
  const [results, setResults] = useState([]);
  const [active, setActive] = useState(-1);
  const debounced = useDebounce(text);

  useEffect(() => {
    if (debounced.trim().length < 2) {
      setResults([]);
      return;
    }
    searchCities(debounced)
      .then((r) => { setResults(r); setActive(-1); })
      .catch(() => setResults([]));
  }, [debounced]);

  function choose(city) {
    onSelect(city);
    setText('');
    setResults([]);
  }

  function onKeyDown(e) {
    if (!results.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => (i + 1) % results.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => (i <= 0 ? results.length - 1 : i - 1)); }
    else if (e.key === 'Enter') { choose(results[active >= 0 ? active : 0]); }
    else if (e.key === 'Escape') { setResults([]); }
  }

  return (
    <div className="search">
      <Search size={18} className="search-icon" />
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search city…"
        aria-label="Search city"
        role="combobox"
        aria-expanded={results.length > 0}
      />
      {results.length > 0 && (
        <ul className="suggestions" role="listbox">
          {results.map((c, i) => (
            <li
              key={`${c.latitude}-${c.longitude}`}
              role="option"
              aria-selected={i === active}
              className={i === active ? 'active' : ''}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(c)}
            >
              <b>{c.name}</b>
              <span>{[c.region, c.country].filter(Boolean).join(', ')}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}