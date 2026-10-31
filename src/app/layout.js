import './globals.css';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'NEXORA AI — Next Generation AI Ecosystem',
  description: 'Multi-model AI workspace: chat, images, documents, coding, voice, research.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className="min-h-screen" suppressHydrationWarning>
        {children}
        <Toaster 
          theme="dark" 
          position="top-center" 
          richColors 
          closeButton 
          toastOptions={{
            className: 'glass-panel border-white/10 shadow-2xl',
            style: { backdropFilter: 'blur(20px)' },
          }}
        />
      </body>
    </html>
  );
}
