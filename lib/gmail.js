import { google } from 'googleapis';
import { getOAuth2Client } from './calendar';

export async function getRecentEmails(accessToken, maxResults = 15) {
  const auth = getOAuth2Client(accessToken);
  const gmail = google.gmail({ version: 'v1', auth });

  try {
    // Get list of recent message IDs
    const listResponse = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      q: 'is:inbox',
    });

    const messageIds = listResponse.data.messages || [];
    if (messageIds.length === 0) return [];

    // Fetch each message's metadata
    const emails = await Promise.all(
      messageIds.map(async ({ id }) => {
        try {
          const msg = await gmail.users.messages.get({
            userId: 'me',
            id,
            format: 'metadata',
            metadataHeaders: ['Subject', 'From', 'Date'],
          });

          const headers = msg.data.payload?.headers || [];
          const getHeader = (name) => headers.find(h => h.name === name)?.value || '';

          return {
            id: msg.data.id,
            threadId: msg.data.threadId,
            subject: getHeader('Subject'),
            from: getHeader('From'),
            date: getHeader('Date'),
            snippet: msg.data.snippet || '',
            labels: msg.data.labelIds || [],
            isUnread: (msg.data.labelIds || []).includes('UNREAD'),
          };
        } catch {
          return null;
        }
      })
    );

    return emails.filter(Boolean);
  } catch (error) {
    console.error('Gmail API error:', error.message);
    return [];
  }
}

export async function getEmailsWithDeadlineKeywords(accessToken) {
  const auth = getOAuth2Client(accessToken);
  const gmail = google.gmail({ version: 'v1', auth });

  try {
    // Search for emails containing deadline-related keywords
    const listResponse = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10,
      q: 'is:inbox (deadline OR "due by" OR "by EOD" OR ASAP OR urgent OR "submit before" OR "don\'t forget" OR reminder)',
    });

    const messageIds = listResponse.data.messages || [];
    if (messageIds.length === 0) return [];

    const emails = await Promise.all(
      messageIds.map(async ({ id }) => {
        try {
          const msg = await gmail.users.messages.get({
            userId: 'me',
            id,
            format: 'metadata',
            metadataHeaders: ['Subject', 'From', 'Date'],
          });

          const headers = msg.data.payload?.headers || [];
          const getHeader = (name) => headers.find(h => h.name === name)?.value || '';

          return {
            id: msg.data.id,
            subject: getHeader('Subject'),
            from: getHeader('From'),
            date: getHeader('Date'),
            snippet: msg.data.snippet || '',
            isUnread: (msg.data.labelIds || []).includes('UNREAD'),
          };
        } catch {
          return null;
        }
      })
    );

    return emails.filter(Boolean);
  } catch (error) {
    console.error('Gmail deadline search error:', error.message);
    return [];
  }
}
