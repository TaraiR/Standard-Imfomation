import type { Metadata } from 'next';
import '../styles/global.css';
import Navbar from '@/components/Navbar';
import { Analytics } from '@vercel/analytics/react';

const SITE_URL = 'https://standard-information.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '基本情報技術者試験 完全対策 | 図解でわかる無料学習サイト',
    template: '%s | 基本情報技術者試験 学習サイト',
  },
  description: '基本情報技術者試験（FE）を図解でわかりやすく解説。科目A・科目B両対応。2進数・ネットワーク・セキュリティ・アルゴリズムなど全13章・100問以上の練習問題付き。完全無料。',
  keywords: ['基本情報技術者試験', '基本情報', 'FE試験', '科目A', '科目B', 'IT資格', '勉強', '無料', '図解', 'アルゴリズム'],
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: SITE_URL,
    siteName: '基本情報技術者試験 学習サイト',
  },
  twitter: { card: 'summary' },
  verification: { google: '4qDlChGpmLa1t3TavfRDA-2LIvsEczGg-enqS8oCCJA' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Navbar />
        <div className="page-wrapper">
          {children}
        </div>
        <footer className="site-footer">
          <p>基本情報技術者試験 学習サイト — 無料で学べる教材</p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
