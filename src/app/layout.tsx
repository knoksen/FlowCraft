import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import '@fontsource/inter/variable.css';

export const metadata: Metadata = {
  title: 'FlowCraft',
  description: 'Visually build, automate, and manage your workflows with AI-powered suggestions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-background text-foreground antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
