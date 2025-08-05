
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import '@fontsource/inter/index.css';
import { AuthProvider } from '@/auth/auth-provider';

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
      <body className="font-sans bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
