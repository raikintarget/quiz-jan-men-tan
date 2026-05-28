const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;
const SHEETS_WEBHOOK_URL = process.env.SHEETS_WEBHOOK_URL || '';
const LEADS_FILE = path.join(__dirname, 'leads.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/lead', async (req, res) => {
  const { name, phone, answers } = req.body;
  if (!name || !phone) return res.status(400).json({ ok: false, error: 'name and phone required' });

  const lead = {
    date: new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' }),
    name,
    phone,
    q1: answers?.[0] || '',
    q2: answers?.[1] || '',
    q3: answers?.[2] || '',
    q4: answers?.[3] || '',
    q5: answers?.[4] || '',
    q6: answers?.[5] || '',
    q7: answers?.[6] || '',
  };

  // Save locally
  try {
    const existing = fs.existsSync(LEADS_FILE)
      ? JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'))
      : [];
    existing.push(lead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(existing, null, 2));
  } catch (e) {
    console.error('Local save error:', e.message);
  }

  // Forward to Google Sheets webhook
  if (SHEETS_WEBHOOK_URL) {
    try {
      await postJSON(SHEETS_WEBHOOK_URL, lead);
    } catch (e) {
      console.error('Sheets webhook error:', e.message);
    }
  }

  res.json({ ok: true });
});

function postJSON(url, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const lib = url.startsWith('https') ? https : http;
    const parsed = new URL(url);
    const req = lib.request(
      { hostname: parsed.hostname, path: parsed.pathname + parsed.search, method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
      (res) => { res.resume(); resolve(); }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
