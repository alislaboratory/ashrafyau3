export default function Tags({ tags }) {
  return (
    <div className="tags">
      {tags.map(t => (
        <span key={t} className="tag">{t}</span>
      ))}
    </div>
  );
}
