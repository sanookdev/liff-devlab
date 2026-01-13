import { pushText, multicastText } from "../services/line.service.js";

export async function pushTextApi(req, res, next) {
  try {
    const { to, text } = req.body || {};
    if (!to || !text) return res.status(400).json({ error: "to,text required" });
    await pushText(to, text);
    res.json({ ok: true });
  } catch (e) {
    return res.json({ error: e?.message || e });
    // next(e);
  }
}

export async function multicastTextApi(req, res, next) {
  try {
    const { to, text } = req.body || {};
    if (!Array.isArray(to) || !to.length || !text) return res.status(400).json({ error: "to(array),text required" });
    await multicastText(to, text);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
