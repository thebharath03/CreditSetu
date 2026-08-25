const NAV_VIEWS = [
  { key: 'queue', label: 'Queue' },
  { key: 'credentials', label: 'Credentials' },
]

const DISABLED_ITEMS = ['Score Detail', 'What-If Simulator']

function Sidebar({ activeView, onSelectView }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">CreditSetu</div>
      <nav className="sidebar-nav">
        {NAV_VIEWS.map((item) => (
          <button
            type="button"
            key={item.key}
            className={`sidebar-nav-item${item.key === activeView ? ' active' : ''}`}
            onClick={() => onSelectView(item.key)}
          >
            {item.label}
          </button>
        ))}
        {DISABLED_ITEMS.map((label) => (
          <span key={label} className="sidebar-nav-item disabled">
            {label}
          </span>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
