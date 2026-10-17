import { ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <MotionConfig reducedMotion="user">
    <div className="public-site min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
    </MotionConfig>
  );
};
