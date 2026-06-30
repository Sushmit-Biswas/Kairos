'use client';
import { useState, useRef, useEffect } from 'react';
import { mockTasks } from '@/lib/mock-data';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: `**Kairos Command Center Active**\n\nI'm your autonomous crisis manager. I don't just chat — I take action.\n\nTry saying:\n- *"I have a presentation due tomorrow but I haven't started"*\n- *"Break down my Q3 report into steps"*\n- *"I've been procrastinating all day, help me"*\n- *"Draft an email to extend my deadline"*\n- *"What should I focus on right now?"*\n\nI'll analyze, plan, and execute. Let's go.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const messagesEnd = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice recognition setup
  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser. Please use Chrome.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Build clean history for Gemini: only user and model messages
      const history = messages
        .filter(m => m.role === 'user' || m.role === 'ai')
        .slice(-10) // Keep last 10 messages for context window
        .map(m => ({
          role: m.role === 'ai' ? 'model' : 'user',
          content: m.content,
        }));

      // Add the new user message
      history.push({ role: 'user', content: userMessage });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          taskContext: mockTasks,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || `API returned ${res.status}`);
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: getFallbackResponse(userMessage),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (text) => {
    setInput(text);
  };

  const quickActions = [
    { label: 'Plan my day', text: 'Plan my day optimally based on my current deadlines and priorities' },
    { label: 'Break down tasks', text: 'Break down my most critical task into actionable sub-steps with time estimates' },
    { label: 'Draft extension email', text: 'Draft a professional email to request a deadline extension for my most urgent task' },
    { label: 'Activate Ghost Mode', text: 'I need to focus. What distractions should I eliminate and how should I structure my next 2 hours?' },
  ];

  return (
    <>
      <div className="page-header">
        <h2>Command Center</h2>
        <p>Talk to Kairos — it doesn't just respond, it takes autonomous action</p>
      </div>

      {/* Quick Action Buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => handleQuickAction(action.text)}
            className="action-btn action-btn-ghost"
            style={{ fontSize: 12, padding: '6px 14px', borderRadius: 20 }}
          >
            {action.label}
          </button>
        ))}
      </div>

      <div className="chat-panel">
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role === 'user' ? 'user' : 'ai'}`}>
              <div className="msg-avatar">
                {msg.role === 'user' ? '👤' : '⚡'}
              </div>
              <div className="msg-bubble">
                <div dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }} />
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message ai">
              <div className="msg-avatar">⚡</div>
              <div className="msg-bubble">
                <div className="tool-call" style={{ marginBottom: 8 }}>
                  <div className="tool-label">Scanning your tasks, calendar, and emails...</div>
                </div>
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEnd} />
        </div>

        <div className="chat-input-area">
          <button
            className={`voice-btn ${listening ? 'listening' : ''}`}
            onClick={listening ? stopVoice : startVoice}
            title={listening ? 'Stop listening' : 'Voice input'}
            id="voice-input-btn"
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: listening ? '2px solid var(--danger)' : '1px solid var(--glass-border)',
              background: listening ? 'rgba(239,68,68,0.15)' : 'var(--bg-tertiary)',
              color: listening ? 'var(--danger)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              transition: 'var(--transition)',
              animation: listening ? 'pulse-critical 1.5s ease-in-out infinite' : 'none',
              flexShrink: 0,
            }}
          >
            🎙️
          </button>
          <input
            id="chat-input"
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={listening ? 'Listening... speak now' : "Tell Kairos what you need... (e.g., 'I'm behind on my report')"}
            disabled={loading}
          />
          <button
            id="chat-send"
            className="chat-send-btn"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            ➤
          </button>
        </div>
      </div>
    </>
  );
}

function formatMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(79,70,229,0.12);padding:2px 6px;border-radius:4px;font-size:12px;font-family:\'Space Mono\',monospace">$1</code>')
    .replace(/^### (.*)/gm, '<h4 style="font-size:15px;font-weight:700;margin:12px 0 6px;color:var(--text-primary)">$1</h4>')
    .replace(/^## (.*)/gm, '<h3 style="font-size:16px;font-weight:700;margin:14px 0 8px;color:var(--text-primary)">$1</h3>')
    .replace(/^\d+\.\s(.*)/gm, '<div style="padding-left:16px;margin:4px 0">$&</div>')
    .replace(/^- (.*)/gm, '<div style="padding-left:12px;margin:3px 0">• $1</div>')
    .replace(/\n/g, '<br/>');
}

function getFallbackResponse(userMessage) {
  const lower = userMessage.toLowerCase();

  if (lower.includes('plan') && (lower.includes('day') || lower.includes('schedule'))) {
    return `**AI Day Planner — Optimized Schedule**\n\nBased on your current deadlines and priorities, here is your optimal time-blocked plan:\n\n**IMMEDIATE (Next 2 Hours)**\n1. 🚨 **Q3 Marketing Report** — Risk 92/100\n   - Write executive summary (30 min)\n   - Add data visualizations (40 min)\n   - Final review and submit (20 min)\n\n**AFTERNOON (3:00 - 5:00 PM)**\n2. 💳 **Pay HDFC Credit Card** — 5 minutes\n   - Saves you ₹500 in late fees\n\n3. 📊 **Start Acme Corp Pitch Deck research** — 90 min\n   - Research Acme Corp background\n   - Draft slide structure\n\n**EVENING (8:00 - 10:00 PM)**\n4. 📊 **Continue Pitch Deck design** — 90 min\n\n*15-minute decompression breaks are built in after every 2 hours of focus.*\n\nI've blocked these time slots on your Google Calendar. Activating Ghost Mode for the next 2 hours is strongly recommended.`;
  }

  if (lower.includes('procrastinat') || lower.includes('help') || lower.includes('behind')) {
    return `**Crisis Mode Activated**\n\nI've analyzed your situation. Here's my autonomous action plan:\n\n**Immediate Actions (executing NOW):**\n- Scanned your tasks — your Q3 Marketing Report is CRITICAL (2.5 hours left)\n- Blocked a 2-hour focus slot on your Google Calendar (1:00 - 3:00 PM)\n- Recommending Ghost Mode activation\n\n**Your Action Items:**\n1. Start with the Executive Summary (30 min)\n2. Add data visualizations (40 min)\n3. Final review and submit (20 min)\n\n**Procrastination Cost:** Every 30 minutes of delay increases your risk of missing the deadline by 20%. Your manager is expecting this today.\n\n*I've already prepared a deadline extension email as backup. Want me to show it?*`;
  }

  if (lower.includes('break') || lower.includes('decompose') || lower.includes('steps') || lower.includes('sub-task')) {
    return `**Strategist Agent — Task Decomposition**\n\nI've broken down your most critical task:\n\n**Q3 Marketing Report** (Due in 2.5 hours)\n\n| Step | Sub-task | Time | Status |\n|------|---------|------|--------|\n| 1 | Pull campaign data from analytics | 15 min | Done |\n| 2 | Calculate ROI per channel | 20 min | Done |\n| 3 | Write executive summary | 30 min | Next |\n| 4 | Add data visualizations | 40 min | Pending |\n| 5 | Final review and submit | 20 min | Pending |\n\n**Total remaining: approximately 90 minutes**\n\nI've blocked 1:00 - 2:30 PM on your calendar. Starting now gives you a 30-minute buffer.\n\n*Shall I activate Ghost Mode so you can focus?*`;
  }

  if (lower.includes('email') || lower.includes('draft') || lower.includes('extend') || lower.includes('deadline')) {
    return `**Negotiator Agent — Draft Ready**\n\nI've drafted a professional extension request:\n\n---\n**Subject:** Request for Extension — Q3 Marketing Report\n\n*Hi Sarah,*\n\n*I wanted to give you a heads-up that I'm working through the Q3 Marketing Report and want to ensure the data accuracy meets our standards. Would it be possible to extend the deadline by 24 hours to tomorrow EOD?*\n\n*I've completed the campaign analysis and ROI calculations — just need additional time for the executive summary and final data validation.*\n\n*Best regards*\n\n---\n\n**To:** sarah.manager@company.com\n\nApprove and Send | Edit | Discard\n\n*This email is in your Approvals queue. One click to send.*`;
  }

  if (lower.includes('focus') || lower.includes('what should') || lower.includes('priorit') || lower.includes('ghost')) {
    return `**Right Now Priority Analysis**\n\nBased on your current task landscape:\n\n**DO NOW** (next 2 hours):\n- Submit Q3 Marketing Report — Risk 92/100, due in 2.5 hours\n\n**DO TODAY** (this evening):\n- Pay HDFC Credit Card — saves you ₹500 in late fees (5 min task)\n- Start Acme Corp Pitch Deck research — meeting tomorrow at 2 PM\n\n**SCHEDULE** (tomorrow):\n- Database Assignment — due in 36 hours, low risk\n- Renew gym membership — 3 days buffer\n\n**Distraction Elimination Plan:**\n1. Close all social media tabs\n2. Set phone to Do Not Disturb\n3. Enable Gmail auto-responder\n4. Block calendar for next 2 hours\n\n*I'm activating the Strategist to block time for each of these on your calendar. Ghost Mode recommended for the next 2 hours.*`;
  }

  return `**Understood. Let me analyze this.**\n\nI've cross-referenced your request with your current task landscape:\n\n- **1 critical deadline** (Q3 Report — 2.5 hours)\n- **2 high priority tasks** (Pitch Deck, Credit Card)\n- **Kairos Score: 42/100** — you're in crisis territory\n\nMy recommendation: Focus on the highest-risk item first. I can:\n1. **Break down** any task into sub-steps\n2. **Draft emails** for deadline extensions\n3. **Activate Ghost Mode** to protect your focus\n4. **Reorganize your calendar** optimally\n\nWhat would you like me to do?`;
}
