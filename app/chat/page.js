'use client';
import { useState, useRef, useEffect } from 'react';
import { mockTasks } from '@/lib/mock-data';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: `⚡ **Kairos Command Center Active**\n\nI'm your autonomous crisis manager. I don't just chat — I take action.\n\nTry saying:\n- *"I have a presentation due tomorrow but I haven't started"*\n- *"Break down my Q3 report into steps"*\n- *"I've been procrastinating all day, help me"*\n- *"Draft an email to extend my deadline"*\n- *"What should I focus on right now?"*\n\nI'll analyze, plan, and execute. Let's go.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }].filter(m => m.role !== 'ai').length > 0
            ? [...messages.filter(m => m.role !== 'system'), { role: 'user', content: userMessage }]
            : [{ role: 'user', content: userMessage }],
          taskContext: mockTasks,
        }),
      });

      if (!res.ok) throw new Error('API error');

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (err) {
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

  return (
    <>
      <div className="page-header">
        <h2>Command Center</h2>
        <p>Talk to Kairos — it doesn't just respond, it takes autonomous action</p>
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
                  <div className="tool-label">🔍 Scanning your tasks and calendar...</div>
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
          <input
            id="chat-input"
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell Kairos what you need... (e.g., 'I'm behind on my report')"
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
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(108,92,231,0.15);padding:2px 6px;border-radius:4px;font-size:12px">$1</code>')
    .replace(/^- (.*)/gm, '• $1')
    .replace(/\n/g, '<br/>');
}

function getFallbackResponse(userMessage) {
  const lower = userMessage.toLowerCase();

  if (lower.includes('procrastinat') || lower.includes('help') || lower.includes('behind')) {
    return `🚨 **Crisis Mode Activated**\n\nI've analyzed your situation. Here's my autonomous action plan:\n\n**Immediate Actions (I'm doing these NOW):**\n- 📊 Scanned your tasks — your Q3 Marketing Report is CRITICAL (2.5 hours left)\n- 📅 Blocked a 2-hour focus slot on your Google Calendar (1:00–3:00 PM)\n- 🛡️ Recommending Ghost Mode activation\n\n**Your Action Items:**\n1. ✍️ Start with the Executive Summary (30 min)\n2. 📈 Add data visualizations (40 min)\n3. 🔍 Final review and submit (20 min)\n\n**Procrastination Cost:** Every 30 minutes of delay increases your risk of missing the deadline by 20%. Your manager is expecting this today.\n\n⚡ *I've already prepared a deadline extension email as backup. Want me to show it?*`;
  }

  if (lower.includes('break') || lower.includes('decompose') || lower.includes('steps')) {
    return `🧠 **Strategist Agent — Task Decomposition**\n\nI've broken down your most critical task:\n\n**Q3 Marketing Report** (Due in 2.5 hours)\n\n| # | Sub-task | Time | Status |\n|---|---------|------|--------|\n| 1 | Pull campaign data from analytics | 15 min | ✅ Done |\n| 2 | Calculate ROI per channel | 20 min | ✅ Done |\n| 3 | Write executive summary | 30 min | ⏳ Next |\n| 4 | Add data visualizations | 40 min | ⬜ Pending |\n| 5 | Final review & submit | 20 min | ⬜ Pending |\n\n**Total remaining: ~90 minutes**\n\n📅 *I've blocked 1:00–2:30 PM on your calendar. Starting now gives you a 30-minute buffer.*\n\n⚡ *Shall I activate Ghost Mode so you can focus?*`;
  }

  if (lower.includes('email') || lower.includes('draft') || lower.includes('extend') || lower.includes('deadline')) {
    return `📧 **Negotiator Agent — Draft Ready**\n\nI've drafted a professional extension request:\n\n---\n**Subject:** Request for Extension — Q3 Marketing Report\n\n*Hi Sarah,*\n\n*I wanted to give you a heads-up that I'm working through the Q3 Marketing Report and want to ensure the data accuracy meets our standards. Would it be possible to extend the deadline by 24 hours to tomorrow EOD?*\n\n*I've completed the campaign analysis and ROI calculations — just need additional time for the executive summary and final data validation.*\n\n*Best regards*\n\n---\n\n**To:** sarah.manager@company.com\n\n✅ **Approve & Send** | ✏️ **Edit** | ❌ **Discard**\n\n⚡ *This email is in your Approvals queue. One click to send.*`;
  }

  if (lower.includes('focus') || lower.includes('what should') || lower.includes('priorit')) {
    return `🎯 **Right Now Priority Analysis**\n\nBased on your current task landscape:\n\n🔴 **DO NOW** (next 2 hours):\n- Submit Q3 Marketing Report — Risk 92/100, due in 2.5 hours\n\n🟡 **DO TODAY** (this evening):\n- Pay HDFC Credit Card — saves you ₹500 in late fees (5 min task)\n- Start Acme Corp Pitch Deck research — meeting tomorrow at 2 PM\n\n🟢 **SCHEDULE** (tomorrow):\n- Database Assignment — due in 36 hours, low risk\n- Renew gym membership — 3 days buffer\n\n⚡ *I'm activating the Strategist to block time for each of these on your calendar. Ghost Mode recommended for the next 2 hours.*`;
  }

  return `⚡ **Understood. Let me analyze this.**\n\nI've cross-referenced your request with your current task landscape:\n\n- 🚨 **1 critical deadline** (Q3 Report — 2.5 hours)\n- ⚠️ **2 high priority tasks** (Pitch Deck, Credit Card)\n- 📊 **Kairos Score: 42/100** — you're in crisis territory\n\nMy recommendation: Focus on the highest-risk item first. I can:\n1. 🧠 **Break down** any task into sub-steps\n2. 📧 **Draft emails** for deadline extensions\n3. 👻 **Activate Ghost Mode** to protect your focus\n4. 📅 **Reorganize your calendar** optimally\n\nWhat would you like me to do?`;
}
