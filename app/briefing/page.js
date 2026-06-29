'use client';
import { useState } from 'react';
import { mockBriefing } from '@/lib/mock-data';

export default function BriefingPage() {
  const [playing, setPlaying] = useState(false);
  const [briefing] = useState(mockBriefing);

  const handlePlay = () => {
    setPlaying(!playing);
    if (!playing && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const fullText = `${briefing.greeting} ` +
        briefing.criticalItems.map(i => `${i.title}. ${i.body}`).join('. ') + '. ' +
        briefing.upcoming.map(i => `${i.title}. ${i.body}`).join('. ') + '. ' +
        `My recommendation: ${briefing.recommendation}`;

      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.onend = () => setPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis?.cancel();
    }
  };

  const scoreColor = briefing.kairosScore >= 70 ? 'var(--success)' : briefing.kairosScore >= 40 ? 'var(--warning)' : 'var(--critical)';
  const circumference = 2 * Math.PI * 48;
  const offset = circumference - (briefing.kairosScore / 100) * circumference;

  return (
    <>
      <div className="page-header">
        <h2>Morning Briefing</h2>
        <p>Your AI-generated daily crisis report — listen or read</p>
      </div>

      <div className="briefing-container">
        {/* Player */}
        <div className="glass-card briefing-player">
          <button className="briefing-play-btn" onClick={handlePlay} id="briefing-play-btn">
            {playing ? '⏸' : '▶'}
          </button>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
              {playing ? 'Playing Briefing...' : 'Play Daily Briefing'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              {playing ? 'Using Web Speech API for voice synthesis' : 'AI-generated summary of your day'}
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <div className="kairos-score-ring" style={{ width: 80, height: 80 }}>
              <svg width="80" height="80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="var(--bg-tertiary)" strokeWidth="6" />
                <circle cx="40" cy="40" r="32" fill="none" stroke={scoreColor} strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 32} strokeDashoffset={2 * Math.PI * 32 - (briefing.kairosScore / 100) * 2 * Math.PI * 32}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease', transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
              </svg>
              <div className="score-value" style={{ color: scoreColor, fontSize: 22 }}>{briefing.kairosScore}</div>
            </div>
          </div>
        </div>

        {/* Greeting */}
        <div className="glass-card briefing-card" style={{ borderLeft: '3px solid var(--accent)' }}>
          <div className="briefing-card-body" style={{ fontSize: 16, color: 'var(--text-primary)', fontWeight: 500 }}>
            {briefing.greeting}
          </div>
        </div>

        {/* Critical Items */}
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--critical)', textTransform: 'uppercase', letterSpacing: 1.5, margin: '24px 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ animation: 'pulse-critical 2s ease-in-out infinite' }}>●</span> Critical — Requires Immediate Action
        </div>
        {briefing.criticalItems.map((item, i) => (
          <div key={i} className="glass-card briefing-card" style={{ borderLeft: '3px solid var(--critical)' }}>
            <div className="briefing-card-header">
              <span className="briefing-card-icon">{item.icon}</span>
              <span className="briefing-card-title">{item.title}</span>
            </div>
            <div className="briefing-card-body">{item.body}</div>
          </div>
        ))}

        {/* Upcoming */}
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--warning)', textTransform: 'uppercase', letterSpacing: 1.5, margin: '24px 0 12px' }}>
          ⏳ Upcoming — Preparation Required
        </div>
        {briefing.upcoming.map((item, i) => (
          <div key={i} className="glass-card briefing-card" style={{ borderLeft: '3px solid var(--warning)' }}>
            <div className="briefing-card-header">
              <span className="briefing-card-icon">{item.icon}</span>
              <span className="briefing-card-title">{item.title}</span>
            </div>
            <div className="briefing-card-body">{item.body}</div>
          </div>
        ))}

        {/* Recommendation */}
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1.5, margin: '24px 0 12px' }}>
          ⚡ Kairos Recommendation
        </div>
        <div className="glass-card briefing-card" style={{ borderLeft: '3px solid var(--accent)', background: 'rgba(108,92,231,0.05)' }}>
          <div className="briefing-card-body" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
            {briefing.recommendation}
          </div>
        </div>
      </div>
    </>
  );
}
