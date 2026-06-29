import { generateChatResponse } from '@/lib/gemini';
import { mockTasks } from '@/lib/mock-data';

export async function POST(request) {
  try {
    const { messages, taskContext } = await request.json();

    // Filter to only user/model messages for Gemini
    const chatHistory = messages
      .filter(m => m.role === 'user' || m.role === 'model' || m.role === 'ai')
      .map(m => ({
        role: m.role === 'ai' ? 'model' : m.role,
        content: m.content,
      }));

    const response = await generateChatResponse(chatHistory, taskContext || mockTasks);

    return Response.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Failed to generate response', details: error.message },
      { status: 500 }
    );
  }
}
