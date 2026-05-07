export const ROUTES = {
  LOGIN: 'login',
  MENU: 'menu',
  USER_DETAIL: 'userDetail',
} as const;

export type ScreenRoute = (typeof ROUTES)[keyof typeof ROUTES];
