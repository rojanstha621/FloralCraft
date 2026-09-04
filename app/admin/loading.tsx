export default function AdminLoading() {
  return (
    <div className="admin-root">
      <div className="admin-loading-shell">
        <div className="admin-loading-sidebar" />
        <main>
          <div className="admin-loading-line is-short" />
          <div className="admin-loading-line is-title" />
          <div className="admin-loading-grid">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} />
            ))}
          </div>
          <div className="admin-loading-table" />
        </main>
      </div>
    </div>
  );
}
