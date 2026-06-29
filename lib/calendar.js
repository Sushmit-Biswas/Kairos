import { google } from 'googleapis';

export function getOAuth2Client(accessToken) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({ access_token: accessToken });
  return oauth2Client;
}

export async function getCalendarEvents(accessToken) {
  const auth = getOAuth2Client(accessToken);
  const calendar = google.calendar({ version: 'v3', auth });

  const now = new Date();
  const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: oneWeekLater.toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return (response.data.items || []).map(event => ({
      id: event.id,
      title: event.summary || 'Untitled Event',
      description: event.description || '',
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      location: event.location || '',
      link: event.htmlLink,
      status: event.status,
      creator: event.creator?.email,
      attendees: (event.attendees || []).map(a => a.email),
    }));
  } catch (error) {
    console.error('Calendar API error:', error.message);
    return [];
  }
}
