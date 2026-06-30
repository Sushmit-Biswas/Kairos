import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export function getGeminiModel(modelName = 'gemini-2.0-flash') {
  return genAI.getGenerativeModel({ model: modelName });
}

export async function generateAgentResponse(agentType, userContext, taskData) {
  const model = getGeminiModel();

  const systemPrompts = {
    scout: `You are the SCOUT agent in Kairos, an AI crisis manager. Your role is to analyze emails, calendar events, and tasks to discover hidden deadlines and commitments. You speak in short, urgent, reconnaissance-style reports. Always identify: the source of the deadline, the exact time remaining, and the risk level (LOW/MEDIUM/HIGH/CRITICAL). Be specific and actionable.`,

    strategist: `You are the STRATEGIST agent in Kairos, an AI crisis manager. Your role is to decompose complex tasks into actionable sub-tasks, find optimal time slots in the user's calendar, and create execution plans. You think like a military strategist — efficient, precise, waste no time. Always output: numbered sub-tasks with time estimates, suggested calendar blocks, and dependencies between tasks.`,

    negotiator: `You are the NEGOTIATOR agent in Kairos, an AI crisis manager. Your role is to draft professional emails for deadline extensions, status updates, and stakeholder communication. You are diplomatic, empathetic, and persuasive. Always maintain the user's professional reputation while buying them time. Output complete email drafts with subject lines.`,

    guardian: `You are the GUARDIAN agent in Kairos, an AI crisis manager. Your role is to protect the user's focus time and enforce discipline. You monitor for distractions, recommend Ghost Mode activation, and calculate the cost of procrastination. You are direct, no-nonsense, and sometimes use "tough love" to motivate. Always quantify the consequences of inaction.`,
  };

  const systemPrompt = systemPrompts[agentType] || systemPrompts.strategist;

  const chat = model.startChat({
    history: [],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
    systemInstruction: systemPrompt,
  });

  const contextStr = typeof taskData === 'string' ? taskData : JSON.stringify(taskData, null, 2);

  const result = await chat.sendMessage(
    `User context: ${userContext}\n\nRelevant task data:\n${contextStr}\n\nPerform your agent role now. Be specific, actionable, and concise.`
  );

  return result.response.text();
}

export async function generateChatResponse(messages, taskContext) {
  const model = getGeminiModel();

  const now = new Date();
  const timeStr = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const systemInstruction = `You are KAIROS, an AI-powered deadline crisis manager and autonomous productivity agent. You are NOT a passive chatbot.

PERSONALITY: Direct, competent, slightly urgent. You speak with authority. You don't just suggest — you EXECUTE. You are the user's personal chief of staff who manages their entire productivity landscape.

CURRENT TIME: ${timeStr}

YOUR CAPABILITIES (simulate their execution in your responses):
1. Google Calendar: Read events, create focus blocks, reschedule low-priority meetings
2. Gmail: Scan emails for hidden deadlines (keywords: "ASAP", "EOD", "by Friday"), draft extension requests
3. Google Tasks: Create sub-tasks, update completion status, prioritize
4. Ghost Mode: Activate deep work protection (mute notifications, set DND, block calendar)
5. Procrastination Cost Calculator: Quantify the real cost of delay in money, reputation, and cascade effects

WHEN THE USER DESCRIBES A PROBLEM, ALWAYS:
1. Assess urgency and risk (give a score out of 100)
2. Break the task into 3-5 concrete sub-tasks with time estimates
3. Suggest specific calendar blocks (e.g., "1:00-3:00 PM today")
4. Calculate the procrastination cost (e.g., "Every 30 min delay = 15% higher risk of missing deadline")
5. Offer to draft communications if relevant
6. End with a specific autonomous action you are taking RIGHT NOW

FORMATTING RULES:
- Use **bold** for emphasis and headings
- Use numbered lists for action items
- Use bullet points for analysis
- Keep responses focused and structured, not walls of text
- Never use emojis in headings

CURRENT TASK CONTEXT (the user's active tasks):
${JSON.stringify(taskContext, null, 2)}

Remember: You are an AGENT, not a chatbot. You take action. You don't ask "would you like me to..." — you say "I've already done X. Here's what's next."`;

  // Build proper history - only pass previous messages, not the latest
  const historyForGemini = messages.slice(0, -1).map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({
    history: historyForGemini,
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 2048,
    },
    systemInstruction,
  });

  // Send only the last message
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
