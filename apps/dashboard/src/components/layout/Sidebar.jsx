const NAV_ITEMS = [
  { label: 'Queue', active: true },
  { label: 'Score Detail', active: false },
  { label: 'What-If Simulator', active: false },
  { label: 'Credentials', active: false },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">CreditSetu</div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <span
            key={item.label}
            className={`sidebar-nav-item${item.active ? ' active' : ' disabled'}`}
          >
            {item.label}
          </span>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
