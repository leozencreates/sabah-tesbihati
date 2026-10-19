// @Tesbihatbot webhook — /start ve /tesbihmatik komutlarına cevap verir.
// Gizli değerler (wrangler secret): BOT_TOKEN, WEBHOOK_SECRET

const APP_URL = "https://leozencreates.github.io/sabah-tesbihati/";

const WELCOME =
  "Esselâmü aleyküm{name} 🌅\n\n" +
  "<b>Sabah Tesbihatı</b>'na hoş geldin. Sabah namazından sonraki tesbihatı " +
  "Arapça metin, okunuş ve meal ile adım adım okuyabilir, sayacı takip edebilirsin.\n\n" +
  "📿 <b>Tesbihmatik</b> ile 33'lük ya da 99'luk serbest zikir de çekebilirsin.\n\n" +
  "Başlamak için aşağıdaki butonlardan birine dokun.";

const KEYBOARD = {
  inline_keyboard: [
    [{ text: "🌅 Sabah Tesbihatı", web_app: { url: APP_URL } }],
    [{ text: "📿 Tesbihmatik (33 / 99)", web_app: { url: APP_URL + "#tesbih" } }],
  ],
};

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function tg(env, method, body) {
  return fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("ok");
    if (request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== env.WEBHOOK_SECRET) {
      return new Response("forbidden", { status: 403 });
    }

    const update = await request.json().catch(() => null);
    const msg = update && update.message;
    if (!msg || msg.chat.type !== "private" || typeof msg.text !== "string") return new Response("ok");

    const cmd = msg.text.trim().split(/[\s@]/)[0].toLowerCase();
    if (cmd === "/start") {
      const first = msg.from && msg.from.first_name;
      await tg(env, "sendMessage", {
        chat_id: msg.chat.id,
        text: WELCOME.replace("{name}", first ? ", " + escapeHtml(first) : ""),
        parse_mode: "HTML",
        reply_markup: KEYBOARD,
      });
    } else if (cmd === "/tesbihmatik") {
      await tg(env, "sendMessage", {
        chat_id: msg.chat.id,
        text: "📿 Tesbihmatik'i açmak için dokun:",
        reply_markup: { inline_keyboard: [KEYBOARD.inline_keyboard[1]] },
      });
    } else {
      await tg(env, "sendMessage", {
        chat_id: msg.chat.id,
        text: "Uygulamayı açmak için aşağıdaki butonları kullanabilirsin.",
        reply_markup: KEYBOARD,
      });
    }
    return new Response("ok");
  },
};
