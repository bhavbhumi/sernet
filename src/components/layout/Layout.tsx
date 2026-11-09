import { ReactNode, useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { Header } from './Header';
import { Footer } from './Footer';
import { captureAttribution } from '@/lib/leadAttribution';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  useEffect(() => { captureAttribution(); }, []);
  return (
    <MotionConfig reducedMotion="user">
    <div className="public-site min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-x-clip">{children}</main>
      <Footer />
    </div>
    </MotionConfig>
  );
};
