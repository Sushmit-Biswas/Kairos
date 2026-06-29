import { google } from 'googleapis';
import { getOAuth2Client } from './calendar';

export async function getTaskLists(accessToken) {
  const auth = getOAuth2Client(accessToken);
  const tasks = google.tasks({ version: 'v1', auth });

  try {
    const response = await tasks.tasklists.list({ maxResults: 10 });
    return response.data.items || [];
  } catch (error) {
    console.error('Tasks API error:', error.message);
    return [];
  }
}

export async function getTasks(accessToken, taskListId = '@default') {
  const auth = getOAuth2Client(accessToken);
  const tasks = google.tasks({ version: 'v1', auth });

  try {
    const response = await tasks.tasks.list({
      tasklist: taskListId,
      maxResults: 20,
      showCompleted: true,
      showHidden: false,
    });

    return (response.data.items || []).map(task => ({
      id: task.id,
      title: task.title || 'Untitled Task',
      notes: task.notes || '',
      due: task.due || null,
      status: task.status, // 'needsAction' or 'completed'
      completed: task.completed || null,
      link: task.selfLink,
      updated: task.updated,
    }));
  } catch (error) {
    console.error('Tasks API error:', error.message);
    return [];
  }
}
