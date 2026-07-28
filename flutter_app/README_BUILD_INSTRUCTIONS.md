# دليل بناء وتشغيل تطبيق Yaman Future Lab Messenger (Flutter)

هذا المجلد `flutter_app` يحتوي على تطبيق Flutter الأصلي الكامل الجاهز للبناء على جهازك أو عبر منصة Codemagic.

## كيفية البناء عبر Codemagic:
1. عند رفع المستودع إلى GitHub، قم بربطه بـ Codemagic.
2. اختر بناء سير العمل المسجل في `codemagic.yaml`.
3. سيقوم Codemagic ببناء ملفات `app-release.apk` و `yaman_lab_messenger.exe` تلقائياً!

## البناء المحلي عبر Flutter CLI:
```bash
cd flutter_app
flutter pub get
flutter build apk --release
flutter build windows --release
```
