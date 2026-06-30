import './globals.css';
import { Providers } from './providers';
import SidebarClient from '@/components/SidebarClient';

export const metadata = {
  title: 'Kairos — AI Crisis Manager',
  description: 'Your AI-powered deadline crisis manager that doesn\'t just remind — it rescues. Multi-agent productivity system with autonomous task planning, calendar optimization, and stakeholder management.',
  keywords: ['AI', 'productivity', 'deadline', 'crisis manager', 'autonomous agent', 'Google Gemini'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var saved = localStorage.getItem('kairos-theme') || 'system';
              var theme;
              if (saved === 'system') {
                theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              } else {
                theme = saved;
              }
              document.documentElement.setAttribute('data-theme', theme);
            } catch(e) {
              document.documentElement.setAttribute('data-theme', 'dark');
            }
          })();
        `}} />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <div className="app-layout">
            <SidebarClient />
            <main className="main-content">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
