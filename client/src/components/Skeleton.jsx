export default function Skeleton() {
  return (
    <div className="layout" aria-busy="true">
      <div className="card sk sk-lg" />
      <div className="card sk sk-lg" />
      <div className="card sk sk-md span-2" />
      <div className="card sk sk-xl span-2" />
    </div>
  );
}