# Sabah Tesbihatı — Telegram Mini App

Sabah namazı sonrası tesbihatı adım adım okutan, sayaçlı bir Telegram Mini App.
Tek dosya (`index.html`), sunucu tarafı kod gerekmez.

## Özellikler
- 15 adımlık sabah tesbihatı: Arapça metin, okunuş ve meal
- Sabaha özel zikirler işaretli (10× tevhid, 7× "Allâhümme ecirnâ mine'n-nâr", Haşr son 3 âyet, 7× Hasbiyallâh)
- Büyük dokunmatik sayaç, hedefe ulaşınca otomatik sonraki adıma geçiş
- Telegram titreşim (haptic), tema renkleri, geri tuşu desteği
- İlerleme Telegram CloudStorage'a kaydedilir (cihazlar arası senkron), günlük seri (🔥) takibi
- Her gün otomatik sıfırlanır
- Ayarlar: Arapça / okunuş / meal göster-gizle, titreşim, otomatik geçiş

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
{ title, ar, tr, mean, n, special?, long?, pre? }
```
`n` tekrar sayısıdır. Adım ekleyip çıkarmak, sırayı değiştirmek için diziyi düzenlemen yeterli.

> Not: Sıra ve sayılar yaygın uygulamaya göre hazırlanmıştır; geleneğe göre farklılık gösterebilir. Metinleri bir hocaya/mushafa göre kontrol etmen tavsiye edilir.
