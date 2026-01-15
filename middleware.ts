import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // 対応する言語のリスト
  locales: ['en', 'ja','vi', 'pt', 'es'],
 
  // デフォルトの言語（迷ったら英語）
  defaultLocale: 'en'
});
 
export const config = {
  // 以下のパス以外はすべてミドルウェアを通す（画像やAPIは除外）
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};