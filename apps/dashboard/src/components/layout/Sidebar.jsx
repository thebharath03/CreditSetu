import { useMock } from '../../lib/dataSource'
import { getSupabase } from '../../lib/supabaseClient'

const NAV_VIEWS = [
  { key: 'queue', label: 'Queue' },
  { key: 'credentials', label: 'Credentials' },
  { key: 'applicant-view', label: 'Applicant View' },
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
      {!useMock && (
        <button type="button" className="sidebar-nav-item sidebar-sign-out" onClick={() => getSupabase().auth.signOut()}>
          Sign out
        </button>
      )}
    </aside>
  )
}

export default Sidebar
