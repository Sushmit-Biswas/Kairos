'use client';
import { useState } from 'react';
import { mockApprovals } from '@/lib/mock-data';

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState(mockApprovals);
  const [actionTaken, setActionTaken] = useState({});

  const handleAction = (id, action) => {
    setActionTaken(prev => ({ ...prev, [id]: action }));
  };

  return (
    <>
      <div className="page-header">
        <h2>Approval Queue</h2>
        <p>Review and approve autonomous actions taken by your AI agents</p>
      </div>

      <div style={{ maxWidth: 700 }}>
        {approvals.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>All clear!</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>No pending approvals. Your agents are standing by.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {approvals.map(approval => (
              <div key={approval.id} className="glass-card approval-card">
                <div className="approval-header">
                  <span style={{ fontSize: 24 }}>{approval.agentEmoji}</span>
                  <div>
                    <div className="approval-agent">{approval.agent} Agent</div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{approval.title}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>
                    {approval.createdAt}
                  </span>
                </div>

                <div className="approval-body">{approval.description}</div>

                {approval.preview && (
                  <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    whiteSpace: 'pre-line',
                    lineHeight: 1.7,
                  }}>
                    {approval.preview}
                    {approval.recipient && (
                      <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                        📧 To: {approval.recipient}
                      </div>
                    )}
                  </div>
                )}

                {actionTaken[approval.id] ? (
                  <div className={`badge ${actionTaken[approval.id] === 'approved' ? 'badge-success' : 'badge-danger'}`}
                    style={{ padding: '8px 16px', fontSize: 13 }}>
                    {actionTaken[approval.id] === 'approved' ? '✅ Approved & Executed' : '❌ Rejected'}
                  </div>
                ) : (
                  <div className="approval-actions">
                    <button className="action-btn action-btn-success" onClick={() => handleAction(approval.id, 'approved')} id={`approve-${approval.id}`}>
                      ✅ Approve & Execute
                    </button>
                    <button className="action-btn action-btn-ghost" onClick={() => handleAction(approval.id, 'rejected')} id={`reject-${approval.id}`}>
                      ❌ Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
