# شیش و چیمەنتۆ - ڕێنمایی

## ١. فایلێک بگۆڕە: `src/config.js`
- `apiKey`: لە Firebase ← ⚙️ Project settings ← General ← Your apps
- `CLOUD_NAME` و `UPLOAD_PRESET`: لە cloudinary.com (Upload preset دەبێت **Unsigned** بێت)
- ئیمەیڵی ئەدمین لە `ADMIN_EMAIL` و لە `firestore.rules` (ئێستا: mohsin.khallid@gmail.com)

## ٢. Firebase
1. Authentication ← Users ← Add user: ئیمەیڵ و پاسوۆردی ئەدمین زیاد بکە.
2. Firestore ← Rules: ناوەڕۆکی `firestore.rules` لێ کۆپی بکە و Publish بکە.

## ٣. GitHub بۆ Firebase (خۆکار)
1. لە github.com repository ێکی نوێ دروست بکە (Private).
2. **Add file ← Upload files**: هەموو فایلەکانی ناو ئەم زیپە (نەک خودی زیپەکە) ڕایبکێشە. دڵنیابە فۆڵدەری `.github` یش دەچێت.
3. Service Account:
   - Firebase ← ⚙️ Project settings ← Service accounts ← Generate new private key (فایلێکی JSON دادەبەزێت)
4. GitHub ← Settings ← Secrets and variables ← Actions ← New repository secret:
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: هەموو ناوەڕۆکی فایلی JSON
5. لە تابی **Actions** چاودێری بکە. هەر جارێک فایل بگۆڕیت و Commit بکەیت، خۆکار بڵاو دەبێتەوە.

ماڵپەڕ: https://shish-chimanto.web.app  |  ئەدمین: /admin

## ڕاکردن لە کۆمپیوتەر (ئارەزوومەندانە)
npm install ، npm run dev ، npm run build
