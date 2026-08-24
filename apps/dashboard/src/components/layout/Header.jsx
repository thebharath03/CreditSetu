function Header({ title, subtitle }) {
  return (
    <header className="dashboard-header">
      <h1>{title}</h1>
      {subtitle && <p className="dashboard-header-subtitle">{subtitle}</p>}
    </header>
  )
}

export default Header
