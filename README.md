# Мои расходы — Telegram Mini App

Личный трекер расходов, встроенный в Telegram. React + TypeScript + Vite,
без бэкенда: данные хранятся в [Telegram CloudStorage](https://core.telegram.org/bots/webapps#cloudstorage)
(синхронизируются между устройствами пользователя) с резервной копией в
`localStorage` на случай, если приложение открыто вне Telegram.

## Разработка

```bash
npm install
npm run dev
```

Вне Telegram приложение работает в обычном браузерном режиме (без
CloudStorage, только `localStorage`) — так проще разрабатывать и проверять UI.

## Сборка и деплой

Пуш в ветку `main` автоматически собирает и публикует приложение на
GitHub Pages через `.github/workflows/deploy.yml`. Вручную собрать:

```bash
npm run build
```

Если репозиторий называется не `tg-expense-tracker`, поправьте `base` в
[vite.config.ts](vite.config.ts) на `/<имя-репозитория>/`.

## Как связать с ботом в Telegram

1. Включить GitHub Pages: **Settings → Pages → Source: GitHub Actions**
   (появится после первого прогона workflow).
2. Создать бота через [@BotFather](https://t.me/BotFather): `/newbot`.
3. Привязать мини-апп: `/newapp`, выбрать своего бота, указать URL страницы
   на GitHub Pages (`https://<username>.github.io/tg-expense-tracker/`).
4. Открыть бота в Telegram и нажать кнопку запуска мини-аппа.

## Известные ограничения MVP

- CloudStorage хранит расходы пачками по месяцам (по 4096 символов на ключ и
  1024 ключа на пользователя — ограничение Telegram), этого хватит на годы
  обычного использования.
- Категории и валюта (₽) зашиты в код — при желании их легко поменять в
  [src/data/categories.ts](src/data/categories.ts).
