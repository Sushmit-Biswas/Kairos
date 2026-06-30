'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { mockTasks, mockActivityFeed, getTimeRemaining } from '@/lib/mock-data';

export default function Dashboard() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState(mockTasks);
  const [googleData, setGoogleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [, setTick] = useState(0);

  // Update countdowns every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch real Google data when logged in
  useEffect(() => {
    if (!session?.accessToken) return;
    setLoading(true);
    fetch('/api/google-data', {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setGoogleData(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  const criticalCount = tasks.filter(t => t.priority === 'critical').length;
  const highCount = tasks.filter(t => t.priority === 'high').length;
  const totalRisk = Math.round(tasks.reduce((sum, t) => sum + t.riskScore, 0) / tasks.length);
  const completedSubtasks = tasks.reduce((sum, t) => sum + t.subtasks.filter(s => s.done).length, 0);
  const totalSubtasks = tasks.reduce((sum, t) => sum + t.subtasks.length, 0);

  return (
    <>
      <div className="page-header">
        <h2>Mission Control</h2>
        <p>Real-time overview of your deadlines, risks, and agent activity</p>
      </div>

      {/* Google Data Banner */}
      {session && googleData && (
        <div className="glass-card" style={{ marginBottom: 24, borderLeft: '3px solid var(--accent2)', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 20 }}>🔗</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent2)' }}>Live Google Data Connected</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Fetched at {new Date(googleData.fetchedAt).toLocaleTimeString()}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span className="badge badge-accent">📅 {googleData.calendar?.length || 0} Calendar Events</span>
            <span className="badge badge-success">📧 {googleData.emails?.length || 0} Recent Emails</span>
            <span className="badge badge-warning">🚨 {googleData.deadlineEmails?.length || 0} Deadline Emails</span>
            <span className="badge badge-accent">✅ {googleData.tasks?.length || 0} Tasks</span>
          </div>
        </div>
      )}

      {loading && (
        <div className="glass-card" style={{ marginBottom: 24, padding: '20px', textAlign: 'center' }}>
          <div className="typing-indicator" style={{ justifyContent: 'center' }}>
            <span /><span /><span />
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>
            🔍 Scout Agent scanning your Gmail, Calendar, and Tasks...
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="glass-card stat-card">
          <div className="stat-glow" style={{ background: 'var(--critical)' }} />
          <div className="stat-icon">🚨</div>
          <div className="stat-value" style={{ color: 'var(--critical)' }}>{criticalCount}</div>
          <div className="stat-label">Critical Deadlines</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-glow" style={{ background: 'var(--warning)' }} />
          <div className="stat-icon">⚠️</div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{highCount}</div>
          <div className="stat-label">High Priority</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-glow" style={{ background: 'var(--accent)' }} />
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{totalRisk}</div>
          <div className="stat-label">Avg Risk Score</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-glow" style={{ background: 'var(--success)' }} />
          <div className="stat-icon">✅</div>
          <div className="stat-value">{completedSubtasks}/{totalSubtasks}</div>
          <div className="stat-label">Sub-tasks Done</div>
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 340px', marginBottom: 24 }}>
        {/* Task List + Real Data */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Active Tasks — Sorted by Risk</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tasks.sort((a, b) => b.riskScore - a.riskScore).map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>

          {/* Real Calendar Events */}
          {googleData?.calendar?.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📅 Upcoming Calendar Events</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {googleData.calendar.map(event => (
                  <div key={event.id} className="glass-card" style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{event.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                          {new Date(event.start).toLocaleString()} {event.location ? `• ${event.location}` : ''}
                        </div>
                      </div>
                      <span className="badge badge-accent">Calendar</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real Deadline Emails */}
          {googleData?.deadlineEmails?.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🚨 Emails with Deadline Keywords</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {googleData.deadlineEmails.map(email => (
                  <div key={email.id} className="glass-card" style={{ padding: '14px 18px', borderLeft: '3px solid var(--danger)' }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{email.subject}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      From: {email.from} • {email.date}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>{email.snippet}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real Google Tasks */}
          {googleData?.tasks?.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>✅ Google Tasks</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {googleData.tasks.map(task => (
                  <div key={task.id} className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 18 }}>{task.status === 'completed' ? '✅' : '⬜'}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, textDecoration: task.status === 'completed' ? 'line-through' : 'none', color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)' }}>{task.title}</div>
                      {task.due && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Due: {new Date(task.due).toLocaleDateString()}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column — Kairos Score + Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <KairosScoreCard score={totalRisk > 60 ? 42 : 78} />

          {/* Real Emails Feed */}
          {googleData?.emails?.length > 0 && (
            <div className="glass-card">
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📧</span> Recent Emails
              </h3>
              <div className="activity-feed">
                {googleData.emails.slice(0, 8).map(email => (
                  <div className="activity-item" key={email.id}>
                    <span className="activity-icon">{email.isUnread ? '🔵' : '⚪'}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email.subject}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email.from}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="glass-card" style={{ flex: 1 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🤖</span> Agent Activity
            </h3>
            <div className="activity-feed">
              {mockActivityFeed.map((item, i) => (
                <div className="activity-item" key={i}>
                  <span className="activity-icon">{item.icon}</span>
                  <span className="activity-text" dangerouslySetInnerHTML={{ __html: item.text }} />
                  <span className="activity-time">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function TaskCard({ task }) {
  const timeLeft = getTimeRemaining(task.deadline);
  const completedSubs = task.subtasks.filter(s => s.done).length;
  const totalSubs = task.subtasks.length;
  const progress = totalSubs > 0 ? (completedSubs / totalSubs) * 100 : 0;

  const riskClass = task.riskScore >= 80 ? 'risk-critical' : task.riskScore >= 60 ? 'risk-high' : task.riskScore >= 40 ? 'risk-medium' : 'risk-low';
  const badgeClass = task.priority === 'critical' ? 'badge-critical' : task.priority === 'high' ? 'badge-danger' : task.priority === 'medium' ? 'badge-warning' : 'badge-success';

  return (
    <div className={`glass-card task-card priority-${task.priority}`}>
      <div className="task-header">
        <div>
          <div className="task-title">{task.title}</div>
          <div className="task-deadline">
            <span style={{ marginRight: 8 }}>{task.source === 'gmail' ? '📧' : task.source === 'calendar' ? '📅' : '📌'}</span>
            {task.sourceDetail}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className={`countdown ${timeLeft.urgent ? 'urgent' : ''}`} suppressHydrationWarning>
            {timeLeft.text}
          </div>
          <div className={`risk-gauge ${riskClass}`}>
            {task.riskScore}
          </div>
        </div>
      </div>

      {task.procrastinationCost && (
        <div style={{ fontSize: 12, color: 'var(--danger)', background: 'rgba(255,107,107,0.08)', padding: '8px 12px', borderRadius: 8, marginBottom: 8 }}>
          💰 Cost of Missing: {task.procrastinationCost}
        </div>
      )}

      {totalSubs > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
            <span>{completedSubs} of {totalSubs} sub-tasks</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{
              width: `${progress}%`,
              background: task.riskScore >= 80
                ? 'linear-gradient(90deg, var(--critical), var(--danger))'
                : 'linear-gradient(90deg, var(--accent), var(--accent2))'
            }} />
          </div>
        </div>
      )}

      <div className="task-meta">
        <span className={`badge ${badgeClass}`}>{task.priority.toUpperCase()}</span>
        <span className="badge badge-accent">{task.category}</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>~{task.estimatedMinutes}min estimated</span>
      </div>
    </div>
  );
}

function KairosScoreCard({ score }) {
  const circumference = 2 * Math.PI * 48;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? 'var(--success)' : score >= 40 ? 'var(--warning)' : 'var(--critical)';
  const label = score >= 70 ? 'On Track' : score >= 40 ? 'At Risk' : 'Crisis Mode';

  return (
    <div className="glass-card" style={{ textAlign: 'center', padding: 32 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20 }}>Kairos Score</h3>
      <div className="kairos-score-ring">
        <svg width="120" height="120">
          <circle cx="60" cy="60" r="48" fill="none" stroke="var(--bg-tertiary)" strokeWidth="8" />
          <circle cx="60" cy="60" r="48" fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div className="score-value" style={{ color }}>{score}</div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color, marginTop: 12 }}>{label}</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Daily productivity health</div>
    </div>
  );
}
