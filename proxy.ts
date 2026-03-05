import { NextRequest, NextResponse } from 'next/server';

const supportedLocales = ['en', 'es', 'ja', 'zh'];
const defaultLocale = 'en';

export function proxy(request: NextRequest) {
  // 检查是否已经有语言前缀
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = supportedLocales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 从 Accept-Language 头获取用户首选语言
  const acceptLanguage = request.headers.get('accept-language');
  let locale = defaultLocale;

  if (acceptLanguage) {
    const languages = acceptLanguage.split(',').map((lang) => {
      const [code] = lang.split(';');
      return code.trim();
    });

    // 找到第一个支持的语言
    for (const lang of languages) {
      const localeCode = lang.split('-')[0];
      if (supportedLocales.includes(localeCode)) {
        locale = localeCode;
        break;
      }
    }
  }

  // 重定向到带有语言前缀的路由
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|serwist|favicon.ico|manifest.webmanifest).*)',
};

