import {
  init,
  isTMA,
  mountMiniApp,
  bindMiniAppCssVars,
  miniAppReady,
  mountThemeParams,
  bindThemeParamsCssVars,
  mountViewport,
  bindViewportCssVars,
  expandViewport,
} from '@telegram-apps/sdk-react';

/**
 * Boots the Telegram SDK when the app is actually running inside Telegram.
 * Outside Telegram (plain browser preview) this is a safe no-op so the app
 * still renders using regular light/dark CSS instead of Telegram theme vars.
 */
export function initTelegram(): boolean {
  let runningInTelegram: boolean;
  try {
    runningInTelegram = isTMA();
  } catch {
    runningInTelegram = false;
  }
  if (!runningInTelegram) return false;

  try {
    init();

    if (mountMiniApp.isAvailable()) {
      mountMiniApp();
      bindMiniAppCssVars();
    }
    if (mountThemeParams.isAvailable()) {
      mountThemeParams();
      bindThemeParamsCssVars();
    }
    if (mountViewport.isAvailable()) {
      mountViewport().then(() => {
        bindViewportCssVars();
        if (expandViewport.isAvailable()) expandViewport();
      }).catch(() => {});
    }
    if (miniAppReady.isAvailable()) miniAppReady();

    document.documentElement.classList.add('in-telegram');
    return true;
  } catch (e) {
    console.warn('Telegram SDK init failed, falling back to web mode', e);
    return false;
  }
}
