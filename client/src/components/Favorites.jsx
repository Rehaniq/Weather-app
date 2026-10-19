import { X } from 'lucide-react';

export default function Favorites({ items, onSelect, onRemove }) {
  if (items.length === 0) return null;
  return (
    <div className="chips">
      {items.map((f) => (
        <span className="chip" key={f.id}>
          <button onClick={() => onSelect(f)}>{f.name}</button>
          <button className="x" onClick={() => onRemove(f.id)} aria-label={`Remove ${f.name}`}>
            <X size={14} />
          </button>
        </span>
      ))}
    </div>
  );
}