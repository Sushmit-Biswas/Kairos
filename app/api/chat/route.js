import { generateChatResponse } from '@/lib/gemini';
import { mockTasks } from '@/lib/mock-data';

export async function POST(request) {
  try {
    const { messages, taskContext } = await request.json();

    if (!messages || messages.length === 0) {
      return Response.json(
        { error: 'No messages provided' },
        { status: 400 }
      );
    }

    // Clean the message history for Gemini
    // Gemini expects roles: 'user' and 'model'
    const chatHistory = messages
      .filter(m => m.role === 'user' || m.role === 'model')
      .map(m => ({
        role: m.role,
        content: m.content,
      }));

    if (chatHistory.length === 0) {
      return Response.json(
        { error: 'No valid messages in history' },
        { status: 400 }
      );
    }

    // Retry logic with exponential backoff (inspired by competitor best practices)
    let lastError = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await generateChatResponse(chatHistory, taskContext || mockTasks);
        return Response.json({ response });
      } catch (error) {
        lastError = error;
        const errMsg = error.message || '';
        const isRetryable = errMsg.includes('429') ||
          errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('503') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('quota');

        if (isRetryable && attempt < 2) {
          const delay = 1500 * Math.pow(2, attempt);
          console.warn(`Gemini API rate limited. Retrying in ${delay}ms (attempt ${attempt + 1}/3)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        break;
      }
    }

    console.error('Chat API error after retries:', lastError);
    return Response.json(
      { error: 'Failed to generate response', details: lastError?.message || 'Unknown error' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Failed to generate response', details: error.message },
      { status: 500 }
    );
  }
}
