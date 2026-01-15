import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
 
  // 言語が不正なら英語にする
  if (!locale || !['en', 'ja', 'vi', 'pt', 'es'].includes(locale)) {
    locale = 'en';
  }
 
  return {
    locale, // 👈【追加】ここです！これがないとエラーになります
    messages: (await import(`../messages/${locale}.json`)).default
  };
});