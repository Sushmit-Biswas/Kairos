'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

export default function SidebarClient() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isActive = (path) => pathname === path ? 'nav-item active' : 'nav-item';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">⚡</div>
        <div>
          <h1>Kairos</h1>
          <div className="tagline">AI Crisis Manager</div>
        </div>
      </div>

      {/* Auth Section */}
      <div style={{ padding: '0 4px', marginBottom: 24 }}>
        {status === 'loading' ? (
          <div className="nav-item" style={{ cursor: 'default' }}>
            <span className="nav-icon">⏳</span>
            <span style={{ fontSize: 13 }}>Connecting...</span>
          </div>
        ) : session ? (
          <div style={{ background: 'rgba(0,210,211,0.06)', border: '1px solid rgba(0,210,211,0.15)', borderRadius: 12, padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              {session.user?.image ? (
                <img src={session.user.image} alt="" style={{ width: 32, height: 32, borderRadius: 10 }} />
              ) : (
                <span style={{ fontSize: 24 }}>👤</span>
              )}
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{session.user?.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{session.user?.email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <span className="badge badge-success" style={{ fontSize: 10 }}>🟢 Connected</span>
              <button onClick={() => signOut()} style={{
                marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)', background: 'none',
                border: 'none', cursor: 'pointer', textDecoration: 'underline',
              }}>Sign Out</button>
            </div>
          </div>
        ) : (
          <button onClick={() => signIn('google')} className="action-btn action-btn-primary" id="google-sign-in"
            style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '12px 16px' }}>
            <span>🔑</span> Sign in with Google
          </button>
        )}
      </div>

      <ThemeToggle />

      <nav className="sidebar-nav">
        <div className="nav-section-label">Command Center</div>
        <a href="/" className={isActive('/')} id="nav-dashboard">
          <span className="nav-icon">📊</span>
          Dashboard
        </a>
        <a href="/agents" className={isActive('/agents')} id="nav-agents">
          <span className="nav-icon">🤖</span>
          Agent Swarm
        </a>
        <a href="/chat" className={isActive('/chat')} id="nav-chat">
          <span className="nav-icon">💬</span>
          Command Chat
        </a>

        <div className="nav-section-label">Autonomous Actions</div>
        <a href="/ghost" className={isActive('/ghost')} id="nav-ghost">
          <span className="nav-icon">👻</span>
          Ghost Mode
        </a>
        <a href="/briefing" className={isActive('/briefing')} id="nav-briefing">
          <span className="nav-icon">🗣️</span>
          Morning Briefing
        </a>
        <a href="/approvals" className={isActive('/approvals')} id="nav-approvals">
          <span className="nav-icon">✅</span>
          Approvals
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
