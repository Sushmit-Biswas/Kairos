import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export function getGeminiModel(modelName = 'gemini-2.0-flash') {
  return genAI.getGenerativeModel({ model: modelName });
}

export async function generateAgentResponse(agentType, userContext, taskData) {
  const model = getGeminiModel();

  const agentPersonas = {
    scout: 'You are SCOUT, a deadline detection agent. Analyze the context and identify hidden deadlines, risks, and urgent commitments. Be brief and military-style.',
    strategist: 'You are STRATEGIST, a task decomposition agent. Break tasks into concrete sub-tasks with time estimates. Create optimal schedule plans.',
    negotiator: 'You are NEGOTIATOR, a communication agent. Draft professional emails for deadline extensions and status updates.',
    guardian: 'You are GUARDIAN, a focus protection agent. Identify distractions, calculate procrastination costs, and recommend Ghost Mode.',
  };

  const persona = agentPersonas[agentType] || agentPersonas.strategist;
  const contextStr = typeof taskData === 'string' ? taskData : JSON.stringify(taskData, null, 2);

  // Use generateContent directly - more reliable than startChat for single turns
  const result = await model.generateContent({
    contents: [{
      role: 'user',
      parts: [{ text: `${persona}\n\nContext: ${userContext}\n\nTask data:\n${contextStr}\n\nRespond in your agent role now. Be concise and actionable.` }],
    }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
  });

  return result.response.text();
}

export async function generateChatResponse(messages, taskContext) {
  const model = getGeminiModel();

  const now = new Date();
  const timeStr = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Summarize task context concisely to reduce payload size
  const taskSummary = Array.isArray(taskContext)
    ? taskContext.map(t => `- ${t.title} | Priority: ${t.priority} | Risk: ${t.riskScore}/100 | Due: ${new Date(t.deadline).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} | Status: ${t.status}`).join('\n')
    : String(taskContext);

  const systemText = `You are KAIROS, an AI crisis manager and autonomous productivity agent. Current time: ${timeStr}

YOUR ACTIVE TASKS:
${taskSummary}

RULES:
- You are an AGENT, not a chatbot. You take action and report what you've done.
- Always be direct, structured, and actionable.
- When user asks about tasks/deadlines, reference the actual task data above.
- Break problems into numbered sub-tasks with time estimates.
- Quantify procrastination costs when relevant.
- Use **bold** for key terms. Keep responses focused, not verbose.
- When context is ambiguous, make a smart assumption based on the task data and proceed.`;

  // Build valid Gemini chat history
  // Strategy: inject system context as the FIRST user message in history (fake turn),
  // followed by a fake model acknowledgement — this is the most reliable way
  // to pass system context with older SDK versions.
  const prevMessages = messages.slice(0, -1);

  // Collect strictly alternating user/model pairs, starting from most recent
  const validPairs = [];
  let expectRole = 'model';
  for (let i = prevMessages.length - 1; i >= 0; i--) {
    const role = prevMessages[i].role === 'user' ? 'user' : 'model';
    if (role === expectRole) {
      validPairs.unshift({ role, content: prevMessages[i].content });
      expectRole = expectRole === 'model' ? 'user' : 'model';
    }
  }

  // Build Gemini history array
  // Always starts with the system context injection pair
  const historyForGemini = [
    {
      role: 'user',
      parts: [{ text: systemText }],
    },
    {
      role: 'model',
      parts: [{ text: 'Understood. I am KAIROS, your autonomous crisis manager. I have your task context loaded. How can I help?' }],
    },
    // Then append real conversation pairs
    ...validPairs.map(m => ({
      role: m.role,
      parts: [{ text: m.content }],
    })),
  ];

  // Ensure history ends with a model turn (so next message can be user)
  // If last pair is user, remove it (the actual message will be sent separately)
  if (historyForGemini[historyForGemini.length - 1]?.role === 'user') {
    historyForGemini.pop();
  }

  const chat = model.startChat({
    history: historyForGemini,
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 2048,
    },
  });

  // Send the actual latest user message
  const lastUserMessage = messages[messages.length - 1];
  const result = await chat.sendMessage(lastUserMessage.content);

  return result.response.text();
}

export async function generateBriefing(tasks) {
  const model = getGeminiModel();

  const prompt = `You are KAIROS, generating a morning crisis briefing. Analyze these tasks and produce a structured briefing.

Tasks: ${JSON.stringify(tasks, null, 2)}

Generate a briefing in this exact JSON format:
{
  "greeting": "A personalized greeting based on the urgency level of today",
  "kairosScore": <number 0-100 representing today's productivity health>,
  "criticalItems": [
    {"icon": "<emoji>", "title": "<title>", "body": "<2-3 sentence analysis with specific time recommendations>"}
  ],
  "upcoming": [
    {"icon": "<emoji>", "title": "<title>", "body": "<preparation advice>"}
  ],
  "recommendation": "<1-2 sentence overall strategy for today>"
}

Be specific with times, costs, and consequences. Make it feel like a military intelligence briefing.`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
    },
  });

  try {
    return JSON.parse(result.response.text());
  } catch {
    return null;
  }
}

export async function decomposeTask(taskTitle, taskDescription, deadline) {
  const model = getGeminiModel();

  const prompt = `Break down this task into 4-6 specific, actionable sub-tasks with time estimates.

Task: ${taskTitle}
Description: ${taskDescription}
Deadline: ${deadline}

Return JSON array:
[{"title": "Sub-task name", "estimatedMinutes": <number>, "order": <number>}]

Be specific and practical. Each sub-task should be completable in one sitting.`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.5, maxOutputTokens: 1024, responseMimeType: 'application/json' },
  });

  try {
    return JSON.parse(result.response.text());
  } catch {
    return [];
  }
}
