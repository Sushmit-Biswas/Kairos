'use client';
import { useState } from 'react';
import { mockAgents, mockActivityFeed } from '@/lib/mock-data';

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState(null);

  return (
    <>
      <div className="page-header">
        <h2>Agent Swarm</h2>
        <p>Your autonomous AI workforce — 4 specialized agents working in parallel</p>
      </div>

      {/* Agent Cards */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {mockAgents.map(agent => (
          <div key={agent.id}
            className="glass-card agent-card"
            style={{ cursor: 'pointer', border: selectedAgent?.id === agent.id ? `1px solid ${agent.color}` : undefined }}
            onClick={() => setSelectedAgent(agent)}
          >
            <div className="agent-avatar" style={{ background: `${agent.color}22`, boxShadow: `0 0 24px ${agent.color}33` }}>
              {agent.emoji}
            </div>
            <div className="agent-name">{agent.name}</div>
            <div className="agent-role">{agent.role}</div>
            <div className="agent-status">
              <span className={`status-dot ${agent.status}`} />
              <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                {agent.status === 'active' ? 'Active' : agent.status === 'working' ? 'Working...' : 'Idle'}
              </span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>
                {agent.actionsToday} actions today
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Agent Detail / Reasoning */}
        <div className="glass-card" style={{ minHeight: 400 }}>
          {selectedAgent ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 40 }}>{selectedAgent.emoji}</div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>{selectedAgent.name} Agent</h3>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{selectedAgent.description}</div>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                  Latest Reasoning Chain
                </div>
                <ReasoningChain agent={selectedAgent} />
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                  Last Action
                </div>
                <div className="tool-call">
                  <div className="tool-label">⚡ {selectedAgent.name} → Action Taken</div>
                  <div className="tool-result">{selectedAgent.lastAction}</div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: 14 }}>
              Select an agent to view their reasoning chain
            </div>
          )}
        </div>

        {/* Live Activity Feed */}
        <div className="glass-card">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📡 Live Agent Feed</h3>
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
    </>
  );
}

function ReasoningChain({ agent }) {
  const chains = {
    scout: [
      { step: 1, thought: 'Scanning Gmail inbox for keywords: "deadline", "due", "by EOD", "ASAP", "urgent"...', type: 'thinking' },
      { step: 2, thought: 'Found email from boss@company.com: "Need the Q3 marketing report by end of day"', type: 'discovery' },
      { step: 3, thought: 'Cross-referencing with Google Calendar — no existing event for this task', type: 'thinking' },
      { step: 4, thought: 'Cross-referencing with Google Tasks — task exists but marked "In Progress" with 2/5 sub-tasks complete', type: 'analysis' },
      { step: 5, thought: 'VERDICT: Risk Score 92/100 — CRITICAL. Only 2.5 hours remain, 60% of work incomplete.', type: 'conclusion' },
    ],
    strategist: [
      { step: 1, thought: 'Received alert from Scout: Q3 Marketing Report is CRITICAL (Risk: 92)', type: 'input' },
      { step: 2, thought: 'Analyzing remaining sub-tasks: Executive Summary (~30min), Data Viz (~40min), Final Review (~20min)', type: 'thinking' },
      { step: 3, thought: 'Scanning Google Calendar for open slots in next 2.5 hours...', type: 'thinking' },
      { step: 4, thought: 'Found conflict: "Team Standup" at 2:00 PM. Recommending reschedule to 4:30 PM.', type: 'analysis' },
      { step: 5, thought: 'ACTION: Created focus block 1:00–3:00 PM, moved Team Standup to 4:30 PM. Notified Guardian.', type: 'action' },
    ],
    negotiator: [
      { step: 1, thought: 'Received alert: Q3 Report deadline may not be met. Preparing contingency.', type: 'input' },
      { step: 2, thought: 'Analyzing relationship context: boss@company.com is direct manager, formal tone preferred.', type: 'thinking' },
      { step: 3, thought: 'Drafting extension request with positive framing: emphasize quality over speed.', type: 'thinking' },
      { step: 4, thought: 'Email draft ready. Subject: "Request for Extension — Q3 Marketing Report"', type: 'action' },
      { step: 5, thought: 'Placed in approval queue. Waiting for user to approve or modify before sending.', type: 'pending' },
    ],
    guardian: [
      { step: 1, thought: 'Monitoring user activity... Detected 45 minutes on social media in the last hour.', type: 'alert' },
      { step: 2, thought: 'Cross-referencing with deadlines: Q3 Report due in 2.5 hours — CRITICAL mismatch.', type: 'analysis' },
      { step: 3, thought: 'Calculating procrastination cost: If deadline missed, professional reputation risk + potential project delay.', type: 'thinking' },
      { step: 4, thought: 'Nudge sent to user. Recommending Ghost Mode activation for remaining time.', type: 'action' },
      { step: 5, thought: 'Ghost Mode standing by. Will set Calendar to Busy, enable Gmail auto-responder, and open report doc.', type: 'ready' },
    ],
  };

  const chain = chains[agent.id] || chains.scout;

  const typeColors = {
    thinking: 'var(--text-muted)',
    discovery: 'var(--accent2)',
    analysis: 'var(--accent)',
    conclusion: 'var(--critical)',
    input: 'var(--text-secondary)',
    action: 'var(--success)',
    pending: 'var(--warning)',
    alert: 'var(--danger)',
    ready: 'var(--accent)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {chain.map((item, i) => (
        <div key={i} style={{
          display: 'flex', gap: 12, alignItems: 'flex-start',
          padding: '10px 14px', borderRadius: 8,
          background: 'rgba(255,255,255,0.02)',
          borderLeft: `3px solid ${typeColors[item.type]}`,
          animation: `msg-in 0.3s ease-out ${i * 0.1}s both`,
        }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)', minWidth: 20 }}>
            {item.step}.
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {item.thought}
          </span>
        </div>
      ))}
    </div>
  );
}
