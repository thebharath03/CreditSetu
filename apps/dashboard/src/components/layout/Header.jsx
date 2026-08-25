function Header({ kicker, title, subtitle }) {
  return (
    <header className="dashboard-header">
      {kicker && <span className="kicker">{kicker}</span>}
      <h1>{title}</h1>
      {subtitle && <p className="dashboard-header-subtitle">{subtitle}</p>}
    </header>
  )
}

export default Header
