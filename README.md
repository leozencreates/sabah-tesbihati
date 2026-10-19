# Sabah Tesbihatı — Telegram Mini App

Sabah namazı sonrası tesbihatı adım adım okutan, sayaçlı bir Telegram Mini App.
Tek dosya (`index.html`), sunucu tarafı kod gerekmez.

## Release — Kullanım
Hiçbir şey kurmana gerek yok: Telegram'da **[@Tesbihatbot](https://t.me/Tesbihatbot)**'u açıp **Başlat**'a dokunman yeterli.
Botun gönderdiği butonlarla Sabah Tesbihatı, 📿 Tesbihmatik ve 📖 Kur'ân-ı Kerîm / Esmâü'l-Hüsnâ açılır.

## Özellikler
- 15 adımlık sabah tesbihatı: Arapça metin, okunuş ve meal
- Sabaha özel zikirler işaretli (10× tevhid, 7× "Allâhümme ecirnâ mine'n-nâr", Haşr son 3 âyet, 7× Hasbiyallâh)
- Büyük dokunmatik sayaç, hedefe ulaşınca otomatik sonraki adıma geçiş
- Telegram titreşim (haptic), tema renkleri, geri tuşu desteği
- İlerleme Telegram CloudStorage'a kaydedilir (cihazlar arası senkron), günlük seri (🔥) takibi
- Her gün otomatik sıfırlanır
- Ayarlar: dil (Türkçe / English / Русский), Arapça / okunuş / meal göster-gizle, titreşim, otomatik geçiş
- Dil, Telegram dil ayarından otomatik seçilir; bot da kullanıcının dilinde cevap verir
- 📿 Tesbihmatik: 33'lük / 99'luk serbest zikir sayacı (tur ve toplam takibi, 99'da 33 ve 66'da titreşim). Doğrudan açmak için adresin sonuna `#tesbih` ekle
- 📖 Kur'ân-ı Kerîm: 114 sûre, Arapça metin + meal (tr: Diyanet, en: Saheeh International, ru: Kuliev); kaldığın âyet kaydedilir. Metin çalışma anında [alquran.cloud](https://alquran.cloud) API'sinden çekilir (internet gerekir). Doğrudan açmak için `#kuran`
- 📖 Esmâü'l-Hüsnâ: Allah'ın 99 ismi Arapça, okunuş ve anlamlarıyla. Doğrudan açmak için `#esma`

## Bot (/start karşılama mesajı)
`bot/` klasöründeki Cloudflare Worker, `/start` ve `/tesbihmatik` komutlarına butonlu mesajla cevap verir.
Token ve webhook sırrı `wrangler secret` olarak saklanır, repoda yer almaz.
```
cd bot
npx wrangler login
npx wrangler secret put BOT_TOKEN
npx wrangler secret put WEBHOOK_SECRET
npx wrangler deploy
```
Sonra Telegram'a webhook'u bildir: `setWebhook?url=<worker adresi>&secret_token=<WEBHOOK_SECRET>`

## Yayınlama

Mini App'ler HTTPS üzerinden sunulmalı. En kolay yol:

1. **Barındırma** — klasörü şunlardan birine yükle:
   - GitHub Pages: yeni repo → `index.html` yükle → Settings › Pages › Deploy from branch
   - Netlify Drop: https://app.netlify.com/drop adresine klasörü sürükle-bırak
   - Vercel / Cloudflare Pages da olur
2. **Bot oluştur** — Telegram'da [@BotFather](https://t.me/BotFather):
   - `/newbot` → isim ve kullanıcı adı ver
3. **Mini App'i bağla** (ikisinden biri ya da ikisi):
   - Menü butonu: `/mybots` → botun → *Bot Settings* → *Menu Button* → URL'yi gir, buton adı: `Tesbihat`
   - Doğrudan link: `/newapp` → botu seç → URL'yi gir → kısa ad ver (ör. `sabah`) → link `t.me/<bot>/sabah`

## Yerel test
`index.html`'i tarayıcıda aç. Telegram dışında: **Boşluk/Enter** = say, **Backspace** = geri al, **← / →** = adım değiştir.
İlerleme bu durumda localStorage'a kaydedilir.

## Tesbihatı düzenleme
`index.html` içindeki `STEPS` dizisinde her adım:
```js
{ title: {tr,en,ru}, ar, tl: {tr,en,ru}, mean: {tr,en,ru}, n, special?, long?, pre?: {tr,en,ru} }
```
`n` tekrar sayısıdır. Adım ekleyip çıkarmak, sırayı değiştirmek için diziyi düzenlemen yeterli.

> Not: Sıra ve sayılar yaygın uygulamaya göre hazırlanmıştır; geleneğe göre farklılık gösterebilir. Metinleri bir hocaya/mushafa göre kontrol etmen tavsiye edilir.
