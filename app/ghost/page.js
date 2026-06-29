'use client';
import { useState, useEffect } from 'react';

export default function GhostModePage() {
  const [activated, setActivated] = useState(false);
  const [timer, setTimer] = useState(0);
  const [actions, setActions] = useState([
    { icon: '📅', label: 'Set Google Calendar to "Do Not Disturb"', done: false },
    { icon: '📧', label: 'Enable Gmail auto-responder with deep work message', done: false },
    { icon: '🔕', label: 'Mute all non-critical notifications', done: false },
    { icon: '📄', label: 'Open required documents for Q3 Marketing Report', done: false },
    { icon: '🛡️', label: 'Guardian Agent monitoring — will block distractions', done: false },
  ]);

  useEffect(() => {
    if (!activated) return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [activated]);

  useEffect(() => {
    if (!activated) return;
    // Simulate actions completing one by one
    actions.forEach((_, i) => {
      setTimeout(() => {
        setActions(prev => prev.map((a, j) => j === i ? { ...a, done: true } : a));
      }, (i + 1) * 800);
    });
  }, [activated]);

  const toggleGhost = () => {
    if (activated) {
      setActivated(false);
      setTimer(0);
      setActions(prev => prev.map(a => ({ ...a, done: false })));
    } else {
      setActivated(true);
    }
  };

  const formatTimer = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="page-header">
        <h2>Ghost Mode</h2>
        <p>One click to vanish from the world and enter deep work</p>
      </div>

      <div className="ghost-container">
        <div className={`ghost-toggle ${activated ? 'activated' : ''}`} onClick={toggleGhost} id="ghost-toggle-btn">
          {activated ? '👻' : '🔒'}
        </div>

        <div className="ghost-label">
          {activated ? 'Ghost Mode Active' : 'Activate Ghost Mode'}
        </div>

        {activated && (
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 40,
            fontWeight: 700,
            color: 'var(--accent)',
            letterSpacing: 4,
          }}>
            {formatTimer(timer)}
          </div>
        )}

        <div className="ghost-sublabel">
          {activated
            ? 'You are invisible. All distractions neutralized. Focus on what matters.'
            : 'When activated, Kairos will autonomously shield you from all distractions and prepare your workspace for deep focus.'}
        </div>

        <div className="ghost-actions">
          {actions.map((action, i) => (
            <div key={i} className={`glass-card ghost-action-item ${action.done ? 'done' : ''}`}>
              <span className="action-icon">{action.icon}</span>
              <span>{action.label}</span>
              <span className="action-check">✓</span>
            </div>
          ))}
        </div>

        {activated && (
          <button className="action-btn action-btn-danger" onClick={toggleGhost} style={{ marginTop: 16 }} id="ghost-exit-btn">
            🚪 Exit Ghost Mode
          </button>
        )}
      </div>
    </>
  );
}
