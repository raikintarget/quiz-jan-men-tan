// ═══════════════════════════════════════════════════════
// ЖАН МЕН ТӘН — Google Sheets Webhook
// Бұл кодты Google Apps Script-ке қосыңыз:
// script.google.com → New Project → осы кодты қойыңыз
// Deploy → Web App → "Anyone" → URL-ді алыңыз
// ═══════════════════════════════════════════════════════

const SHEET_NAME = 'Лидтер';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    sheet.appendRow([
      data.date || new Date().toLocaleString('ru-RU'),
      data.name || '',
      data.phone || '',
      data.q1 || '',
      data.q2 || '',
      data.q3 || '',
      data.q4 || '',
      data.q5 || '',
      data.q6 || '',
      data.q7 || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Күні', 'Аты', 'Телефон',
      '1. Мәселе', '2. Уақыт', '3. Белгі',
      '4. Анализ', '5. Ем', '6. Нәтиже', '7. Табиғи ем'
    ]);
    // Header styles
    const header = sheet.getRange(1, 1, 1, 10);
    header.setBackground('#3B6B4A');
    header.setFontColor('#ffffff');
    header.setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 140);
    sheet.setColumnWidth(2, 130);
    sheet.setColumnWidth(3, 130);
    for (let i = 4; i <= 10; i++) sheet.setColumnWidth(i, 160);
  }

  return sheet;
}
