import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:io' show Platform;
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'windows_app/windows_dashboard.dart';
import 'android_app/android_companion_home.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    bool isDesktop = false;
    if (!kIsWeb) {
      isDesktop = Platform.isWindows || Platform.isLinux || Platform.isMacOS;
    }

    return MaterialApp(
      title: 'Yaman Future Lab Messenger',
      debugShowCheckedModeBanner: false,
      locale: const Locale('ar', 'SA'),
      supportedLocales: const [
        Locale('ar', 'SA'),
        Locale('en', 'US'),
      ],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      themeMode: ThemeMode.dark,
      darkTheme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        fontFamily: 'Tajawal',
        colorSchemeSeed: const Color(0xFF0284C7), // Teal / Medical Blue
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        cardTheme: CardTheme(
          color: const Color(0xFF1E293B),
          elevation: 2,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
      ),
      home: isDesktop 
          ? const WindowsDashboardScreen() 
          : const AndroidCompanionScreen(),
    );
  }
}
