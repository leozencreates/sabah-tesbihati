// @Tesbihatbot webhook — /start ve /tesbihmatik komutlarına cevap verir.
// Gizli değerler (wrangler secret): BOT_TOKEN, WEBHOOK_SECRET
// Mesajlar kullanıcının Telegram diline göre (tr / en / ru) gönderilir.

const APP_URL = "https://leozencreates.github.io/sabah-tesbihati/";

const TEXT = {
  tr: {
    welcome:
      "Esselâmü aleyküm{name} 🌅\n\n" +
      "<b>Sabah Tesbihatı</b>'na hoş geldin. Sabah namazından sonraki tesbihatı " +
      "Arapça metin, okunuş ve meal ile adım adım okuyabilir, sayacı takip edebilirsin.\n\n" +
      "📿 <b>Tesbihmatik</b> ile 33'lük ya da 99'luk serbest zikir de çekebilirsin.\n\n" +
      "Başlamak için aşağıdaki butonlardan birine dokun.",
    app: "🌅 Sabah Tesbihatı",
    tsb: "📿 Tesbihmatik (33 / 99)",
    tsbOpen: "📿 Tesbihmatik'i açmak için dokun:",
    fallback: "Uygulamayı açmak için aşağıdaki butonları kullanabilirsin.",
  },
  en: {
    welcome:
      "Assalamu alaykum{name} 🌅\n\n" +
      "Welcome to <b>Morning Tasbihat</b>. Recite the dhikr after the Fajr prayer step by step " +
      "with Arabic text, transliteration and meaning, and keep track with the counter.\n\n" +
      "📿 With <b>Tesbihmatik</b> you can also do free dhikr in sets of 33 or 99.\n\n" +
      "Tap one of the buttons below to begin.",
    app: "🌅 Morning Tasbihat",
    tsb: "📿 Tesbihmatik (33 / 99)",
    tsbOpen: "📿 Tap to open Tesbihmatik:",
    fallback: "Use the buttons below to open the app.",
  },
  ru: {
    welcome:
      "Ассаляму алейкум{name} 🌅\n\n" +
      "Добро пожаловать в <b>Утренний тасбихат</b>. Читай зикры после утреннего намаза шаг за шагом — " +
      "с арабским текстом, транскрипцией и переводом смысла, и следи за счётчиком.\n\n" +
      "📿 В <b>Тесбихматике</b> можно также свободно читать зикр по 33 или 99.\n\n" +
      "Нажми одну из кнопок ниже, чтобы начать.",
    app: "🌅 Утренний тасбихат",
    tsb: "📿 Тесбихматик (33 / 99)",
    tsbOpen: "📿 Нажми, чтобы открыть Тесбихматик:",
    fallback: "Открой приложение кнопками ниже.",
  },
};

function pickLang(code) {
  code = (code || "").toLowerCase();
  if (code.startsWith("tr")) return "tr";
  if (/^(ru|uk|be|kk|ky)/.test(code)) return "ru";
  return code ? "en" : "tr";
}

function keyboard(t) {
  return {
    inline_keyboard: [
      [{ text: t.app, web_app: { url: APP_URL } }],
      [{ text: t.tsb, web_app: { url: APP_URL + "#tesbih" } }],
    ],
  };
}

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

    const t = TEXT[pickLang(msg.from && msg.from.language_code)];
    const kb = keyboard(t);
    const cmd = msg.text.trim().split(/[\s@]/)[0].toLowerCase();
    if (cmd === "/start") {
      const first = msg.from && msg.from.first_name;
      await tg(env, "sendMessage", {
        chat_id: msg.chat.id,
        text: t.welcome.replace("{name}", first ? ", " + escapeHtml(first) : ""),
        parse_mode: "HTML",
        reply_markup: kb,
      });
    } else if (cmd === "/tesbihmatik") {
      await tg(env, "sendMessage", {
        chat_id: msg.chat.id,
        text: t.tsbOpen,
        reply_markup: { inline_keyboard: [kb.inline_keyboard[1]] },
      });
    } else {
      await tg(env, "sendMessage", {
        chat_id: msg.chat.id,
        text: t.fallback,
        reply_markup: kb,
      });
    }
    return new Response("ok");
  },
};
