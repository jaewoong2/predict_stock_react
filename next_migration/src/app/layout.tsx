import { Metadata } from 'next';
import { Suspense } from 'react';

import '@/app/globals.css';
import Footer from '@/components/atoms/Footer';
import ActionToolbar from '@/components/blocks/ActionToolbar';
import FloatingButtons from '@/components/blocks/FloatingButtons';
import GoogleAnalytics from '@/components/blocks/GoogleAnalytics';
import Providers from '@/components/providers/JotaiProvider';
import ReactQueryProviders from '@/components/providers/ReactQueryProvider';
import { SiteHeader } from '@/components/site-header';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { siteConfig, siteMetadata } from '@/config/site';
import { cn } from '@/lib/utils';

import Freesentation from './fonts';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // themeColor: [
  //   { media: '(prefers-color-scheme: light)', color: 'white' },
  //   { media: '(prefers-color-scheme: dark)', color: 'black' },
  // ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  ...siteMetadata,
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <>
      <html lang='ko' suppressHydrationWarning>
        <head>
          <link rel='icon' href='/icon.png' type='image/png' />
        </head>
        <body className={cn('min-h-screen w-full bg-muted/50 antialiased', Freesentation.className)}>
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ?? ''} />
          <Providers>
            <ReactQueryProviders>
              <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
                <Suspense>
                  <div className='relative flex min-h-screen flex-col'>
                    <SiteHeader />
                    <div className='flex-1 dark:bg-zinc-800'>{children}</div>
                    <Footer />
                    <Toaster />
                  </div>
                  {modal}
                  <FloatingButtons />
                </Suspense>
                <TailwindIndicator />
              </ThemeProvider>
            </ReactQueryProviders>
          </Providers>
        </body>
      </html>
    </>
  );
}
