# APGS Product Card

Живая инженерная карточка насосного оборудования на React 18 + TypeScript.

## Запуск

```bash
npm install
npm run dev
npm run build
```

## Архитектура

- `src/domain` — типы, моки и инженерные расчёты.
- `src/components` — независимые UI-компоненты карточки.
- `src/store` — спецификация Zustand с сохранением в localStorage.
- `src/services` — экспорт спецификации PDF/XLSX.
- `src/styles` — токены, базовые стили и адаптив карточки.
- `src/main.tsx` — единственная точка монтирования виджета.

## Интеграция с 1С-Битрикс

Подключите файлы из `dist` и подготовьте контейнер:

```html
<link rel="stylesheet" href="/local/assets/apgs-product-card.css">
<div id="apgs-product-card"></div>
<script type="module" src="/local/assets/apgs-product-card.js"></script>
<script>
  window.APGSProductCard.mount(
    document.getElementById('apgs-product-card'),
    {
      product: window.__APGS_PRODUCT__,
      context: window.__APGS_CONTEXT__,
      onOpenSelector: function (context) {
        window.location.href = '/pumpselect/?q=' + context.q + '&h=' + context.h;
      },
      onQuoteSubmit: async function (payload) {
        await fetch('/api/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
    }
  );
</script>
```

В production данные насоса и Q/H передаются в `mount`; компоненты не обращаются к Bitrix напрямую.

## Уже реализовано

- три уровня Verdict и вторичный Match Score;
- редактируемый сквозной Context Q/H;
- интерактивный Q-H график и полноэкранный режим;
- восемь диагностических проверок с OK/Warn/Danger;
- TCO на 3/5 лет с тарифом и часами работы;
- спецификация localStorage с Context на каждой позиции;
- экспорт PDF/XLSX;
- форма КП;
- адаптив и мобильные sticky CTA;
- отдельная модель edge states.

## Проверка

```bash
npm run build
node scripts/smoke.mjs
```
