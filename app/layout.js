import './globals.css';

export const metadata = {
  title: 'Kairos — AI Crisis Manager',
  description: 'Your AI-powered deadline crisis manager that doesn\'t just remind — it rescues. Multi-agent productivity system with autonomous task planning, calendar optimization, and stakeholder management.',
  keywords: ['AI', 'productivity', 'deadline', 'crisis manager', 'autonomous agent', 'Google Gemini'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">⚡</div>
        <div>
          <h1>Kairos</h1>
          <div className="tagline">AI Crisis Manager</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Command Center</div>
        <a href="/" className="nav-item" id="nav-dashboard">
          <span className="nav-icon">📊</span>
          Dashboard
          <span className="nav-badge">3</span>
        </a>
        <a href="/agents" className="nav-item" id="nav-agents">
          <span className="nav-icon">🤖</span>
          Agent Swarm
        </a>
        <a href="/chat" className="nav-item" id="nav-chat">
          <span className="nav-icon">💬</span>
          Command Chat
        </a>

        <div className="nav-section-label">Autonomous Actions</div>
        <a href="/ghost" className="nav-item" id="nav-ghost">
          <span className="nav-icon">👻</span>
          Ghost Mode
        </a>
        <a href="/briefing" className="nav-item" id="nav-briefing">
          <span className="nav-icon">🗣️</span>
          Morning Briefing
        </a>
        <a href="/approvals" className="nav-item" id="nav-approvals">
          <span className="nav-icon">✅</span>
          Approvals
          <span className="nav-badge">2</span>
        </a>
      </nav>

      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px', marginTop: '16px' }}>
        <div className="nav-item" style={{ cursor: 'default' }}>
          <span className="nav-icon">🟢</span>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>4 Agents Active</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Powered by Gemini 2.0</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
