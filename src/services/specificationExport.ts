import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { strToU8, zipSync } from 'fflate';
import { formatMoney } from '../domain/calculations';
import type { SpecificationItem } from '../domain/types';

const rows = (items: SpecificationItem[]) => items.map((item, index) => ({
  number: index + 1,
  model: item.product.name,
  sku: item.product.sku,
  quantity: item.quantity,
  context: `Q ${item.context.q.toFixed(1)} м³/ч · H ${item.context.h.toFixed(1)} м · DN${item.context.dn}`,
  price: item.product.price,
  total: item.product.price * item.quantity,
  comment: item.comment,
}));

export function exportSpecificationXlsx(items: SpecificationItem[]) {
  const headers = ['№', 'Модель', 'Артикул', 'Количество', 'Контекст подбора', 'Цена, ₽', 'Сумма, ₽', 'Комментарий'];
  const values = rows(items).map((row) => [row.number, row.model, row.sku, row.quantity, row.context, row.price, row.total, row.comment]);
  const xmlEscape = (value: unknown) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const columnName = (index: number) => String.fromCharCode(65 + index);
  const sheetRows = [headers, ...values].map((row, rowIndex) => `<row r="${rowIndex + 1}">${row.map((cell, columnIndex) => {
    const ref = `${columnName(columnIndex)}${rowIndex + 1}`;
    return typeof cell === 'number' ? `<c r="${ref}"><v>${cell}</v></c>` : `<c r="${ref}" t="inlineStr"><is><t>${xmlEscape(cell)}</t></is></c>`;
  }).join('')}</row>`).join('');
  const files = {
    '[Content_Types].xml': strToU8('<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>'),
    '_rels/.rels': strToU8('<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'),
    'xl/workbook.xml': strToU8('<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Спецификация" sheetId="1" r:id="rId1"/></sheets></workbook>'),
    'xl/_rels/workbook.xml.rels': strToU8('<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'),
    'xl/worksheets/sheet1.xml': strToU8(`<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols><col min="1" max="1" width="6" customWidth="1"/><col min="2" max="2" width="32" customWidth="1"/><col min="3" max="3" width="24" customWidth="1"/><col min="4" max="4" width="12" customWidth="1"/><col min="5" max="5" width="40" customWidth="1"/><col min="6" max="8" width="18" customWidth="1"/></cols><sheetData>${sheetRows}</sheetData></worksheet>`),
  };
  const blob = new Blob([zipSync(files)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'APGS-спецификация.xlsx';
  link.click();
  URL.revokeObjectURL(url);
}

export function exportSpecificationPdf(items: SpecificationItem[]) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  doc.setFontSize(16);
  doc.text('APGS Specification', 14, 16);
  doc.setFontSize(9);
  doc.text(`Created: ${new Date().toLocaleDateString('ru-RU')}`, 14, 22);
  autoTable(doc, {
    startY: 28,
    head: [['#', 'Model', 'SKU', 'Qty', 'Selection context', 'Price', 'Total', 'Comment']],
    body: rows(items).map((row) => [
      row.number, row.model, row.sku, row.quantity,
      row.context.replace('м³/ч', 'm3/h').replace('м', 'm'),
      formatMoney(row.price), formatMoney(row.total), row.comment,
    ]),
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: [47, 111, 237] },
  });
  doc.save('APGS-спецификация.pdf');
}
