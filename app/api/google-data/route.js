import { getServerSession } from 'next-auth';
import { getCalendarEvents } from '@/lib/calendar';
import { getRecentEmails, getEmailsWithDeadlineKeywords } from '@/lib/gmail';
import { getTasks } from '@/lib/tasks';

export async function GET(request) {
  // Get the access token from the Authorization header
  const authHeader = request.headers.get('authorization');
  const accessToken = authHeader?.replace('Bearer ', '');

  if (!accessToken) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Fetch all data in parallel for speed
    const [calendarEvents, recentEmails, deadlineEmails, tasks] = await Promise.all([
      getCalendarEvents(accessToken),
      getRecentEmails(accessToken, 15),
      getEmailsWithDeadlineKeywords(accessToken),
      getTasks(accessToken),
    ]);

    return Response.json({
      calendar: calendarEvents,
      emails: recentEmails,
      deadlineEmails,
      tasks,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Google data fetch error:', error);
    return Response.json(
      { error: 'Failed to fetch Google data', details: error.message },
      { status: 500 }
    );
  }
}
