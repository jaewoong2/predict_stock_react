import type { Metadata } from 'next';
import './globals.css';
import Freesentation from './fonts';
import Header from '@/components/header';
import { SignalSearchParamsProvider } from '@/hooks/useSignalSearchParams';
import ReactQueryProvider from '@/components/providers/ReactQueryProvider';

export const metadata: Metadata = {
  title: 'Stock Predict AI LLM',
  description: 'Predict stock prices with AI models',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={Freesentation.className}>
        <ReactQueryProvider>
          <SignalSearchParamsProvider>
            <Header />
            {children}
          </SignalSearchParamsProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
