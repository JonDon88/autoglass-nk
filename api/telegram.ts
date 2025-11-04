import type { VercelRequest, VercelResponse } from 'vercel';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  try {
    const { lang, name, phone, msg } = req.body || {};
    if (!phone) return res.status(400).send('phone required');
    const token = process.env.TG_BOT_TOKEN;
    const chatId = process.env.TG_CHAT_ID;
    if (!token || !chatId) return res.status(500).send('Missing TG env');
    const title = lang === 'ua' ? 'Нова заявка з сайту Autoglass NK' : 'Новая заявка с сайта Autoglass NK';
    const nameL = lang === 'ua' ? "Ім'я" : 'Имя';
    const phoneL = lang === 'ua' ? 'Телефон' : 'Телефон';
    const msgL = lang === 'ua' ? 'Коментар' : 'Комментарий';
    const text = `<b>${title}</b>\n${nameL}: ${name||''}\n${phoneL}: ${phone}\n${msgL}: ${msg||''}`;
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });
    const j = await r.text();
    if (!r.ok) return res.status(r.status).send(j);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(j);
  } catch (e:any) {
    return res.status(500).send(e?.message || 'Unknown error');
  }
}
