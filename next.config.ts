import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

// プラグインの作成
const withNextIntl = createNextIntlPlugin();

// Next.jsの基本設定
const nextConfig: NextConfig = {
  /* ここに将来的な設定が入ります */
};

// プラグインで設定を包んでエクスポート
export default withNextIntl(nextConfig);