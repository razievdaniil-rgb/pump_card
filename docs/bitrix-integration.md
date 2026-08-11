# Подключение карточки в 1С-Битрикс

Карточка собирается как независимый React-виджет. Утверждённый standalone-дизайн сохраняется; для шаблона сайта используется `embedded`-режим.

## Контейнер в шаблоне элемента каталога

```php
<div
  id="apgs-product-card"
  data-mode="embedded"
  data-xml-id="<?= htmlspecialcharsbx($arResult['XML_ID']) ?>"
></div>
```

## Передача данных элемента

До подключения JS шаблон может передать нормализованный объект Bitrix:

```php
<script>
window.APGS_BITRIX_PRODUCT = <?= \Bitrix\Main\Web\Json::encode([
  'ID' => $arResult['ID'],
  'XML_ID' => $arResult['XML_ID'],
  'NAME' => $arResult['NAME'],
  'DETAIL_PICTURE' => $arResult['DETAIL_PICTURE']['SRC'] ?? null,
  'PRICE' => $arResult['MIN_PRICE']['VALUE'] ?? null,
  'QUANTITY' => $arResult['CATALOG_QUANTITY'] ?? null,
  'PROPERTIES' => $arResult['PROPERTIES'],
]) ?>;
</script>
```

Адаптер уже понимает канонические поля парсера `FLOW`, `HEAD`, `POWER`, а также `EFFICIENCY`, `SUCTION_DN`, `DISCHARGE_DN`, `PN`, `NPSHR`, `VOLTAGE`, `QH_CURVE`/`CURVE_QH` и стандартные поля товара. Неизвестные или ещё не заполненные значения безопасно заменяются моковыми до появления API.

`PMP_CURVES_JSON` читается как список идентификаторов кривых. Полные данные принимаются массивом `CURVES` (либо свойством `CURVES_JSON`/`PMP_CURVES_DATA`) с типами `QH`, `EFF`, `POWER`, `NPSH`. Кривые товара связываются по `product_id`, который равен XML_ID формата `RFZ-XXXXXX`. Отдельного `variant_id` нет; `variant.rpm` и `variant.impeller_diameter_mm` используются только как необязательные метаданные. BEP вычисляется на фронте как максимум `EFF`, а соответствующий напор интерполируется по `QH`. Пока Bitrix отдаёт только ID, карточка использует демонстрационные точки без изменения интерфейса.

## Подключение сборки

```php
<?php
use Bitrix\Main\Page\Asset;

Asset::getInstance()->addCss('/local/assets/apgs-card/apgs-product-card.css');
Asset::getInstance()->addJs('/local/assets/apgs-card/apgs-product-card.js');
?>
```

Файлы берутся из `dist/` после команды `npm run build`.

## Что остаётся на следующий этап

- реальные Verdict и Match Score;
- восемь серверных диагностик;
- расчёт рабочей точки и TCO;
- API аналогов;
- серверная отправка КП;
- production PDF/XLSX, если экспорт должен формироваться backend.
## Системные состояния

Состояние можно передать через `data-edge-state` контейнера или через `edgeState` в `mount`. Поддерживаются: `no-context`, `no-curve`, `insufficient-data`, `api-error`. Для кнопки повторной загрузки передаётся callback `onRetry`.

```php
<div id="apgs-product-card" data-mode="embedded" data-edge-state="no-curve"></div>
```