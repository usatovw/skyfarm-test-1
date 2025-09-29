# 📱 App Directory Documentation

Основная папка приложения Next.js 14 с архитектурой App Router.

## 🏗️ Структура

```
app/
├── components/          # React компоненты (34 компонента)
│   ├── dashboard/       # Dashboard компоненты (1 компонент)
│   ├── farm/           # Farm компоненты (9 компонентов)
│   ├── shared/         # Shared компоненты (3 компонента)
│   ├── ui/             # UI библиотека (22 компонента)
│   └── index.ts        # Главный экспорт
├── data/               # Данные и mock API (1 файл)
│   └── mockData.ts     # Моковые данные фермы
├── farm/               # Страница управления фермой
│   └── page.tsx        # Farm management interface
├── lib/                # Утилиты и константы (2 файла)
│   ├── constants.ts    # Константы приложения
│   └── utils.ts        # Tailwind utilities
├── types/              # TypeScript типы (2 файла)
│   ├── farming.ts      # Основные типы фермы
│   └── index.ts        # UI типы и экспорт
├── globals.css         # Глобальные стили
├── layout.tsx          # Root layout приложения
└── page.tsx            # Главная страница (Dashboard)
```

## 📄 Основные файлы

### 🏠 Страницы (Pages)
- **`page.tsx`** - Главная страница с Dashboard
- **`layout.tsx`** - Root layout с метаданными
- **`farm/page.tsx`** - Страница управления фермой

### 🎨 Стили
- **`globals.css`** - CSS переменные, Tailwind imports, темизация

## 📊 Статистика

- **Всего файлов**: 53 файла
- **React компонентов**: 34 компонента
- **TypeScript файлов**: 48 файлов
- **Строки кода**: ~2000+ строк

## 🔗 Детальная документация

- [📦 Components](./components/) - Документация всех компонентов
- [📝 Types](./types/) - Система типов TypeScript
- [🗄️ Data](./data/) - Данные и API функции
- [🔧 Lib](./lib/) - Утилиты и константы