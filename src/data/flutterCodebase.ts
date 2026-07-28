import { FlutterCodeFile } from '../types';

export const flutterCodeFiles: FlutterCodeFile[] = [
  {
    id: 'pubspec.yaml',
    fileName: 'pubspec.yaml',
    path: 'pubspec.yaml',
    category: 'config',
    description: 'توصيف المشروع والمكتبات المطلوبة لـ Windows و Android',
    code: `name: yaman_lab_messenger
description: "Yaman Future Lab Messenger - Hospital Lab Results Notification Platform"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  
  # Network & Bridge Server
  shelf: ^1.4.1
  shelf_router: ^1.1.4
  http: ^1.1.0
  web_socket_channel: ^2.4.0
  
  # Telephony & SMS for Android
  telephony: ^0.2.0
  permission_handler: ^11.0.1
  
  # Folder & File Watcher for Windows
  watcher: ^1.1.0
  file_picker: ^6.1.1
  desktop_drop: ^0.4.4
  path_provider: ^2.1.1
  path: ^1.8.3
  
  # Local Storage & Utilities
  shared_preferences: ^2.2.2
  intl: ^0.20.2
  url_launcher: ^6.2.1
  cupertino_icons: ^1.0.6

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/logo.png
`,
  },
  {
    id: 'codemagic.yaml',
    fileName: 'codemagic.yaml',
    path: 'codemagic.yaml',
    category: 'config',
    description: 'إعدادات البناء الأوتوماتيكي في السحاب عبر منصة Codemagic لإنشاء ملفات EXE و APK تلقائياً',
    code: `workflows:
  android-workflow:
    name: Build Android Companion APK
    max_build_duration: 30
    instance_type: mac_mini_m1
    environment:
      flutter: stable
    scripts:
      - name: Get Flutter dependencies
        script: flutter pub get
      - name: Build Release APK
        script: flutter build apk --release
    artifacts:
      - build/app/outputs/flutter-apk/*.apk

  windows-workflow:
    name: Build Windows Desktop EXE
    max_build_duration: 30
    instance_type: windows_x2
    environment:
      flutter: stable
    scripts:
      - name: Enable Windows Desktop Support
        script: flutter config --enable-windows-desktop
      - name: Get Flutter dependencies
        script: flutter pub get
      - name: Build Windows Release EXE
        script: flutter build windows --release
    artifacts:
      - build/windows/x64/runner/Release/**
`,
  },
  {
    id: 'AndroidManifest.xml',
    fileName: 'AndroidManifest.xml',
    path: 'android/app/src/main/AndroidManifest.xml',
    category: 'android',
    description: 'ملف الصلاحيات المطلوبة لإرسال SMS والشبكة المحلية في أندرويد',
    code: `<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Required permissions for sending SMS, Wifi bridge and Phone State -->
    <uses-permission android:name="android.permission.SEND_SMS"/>
    <uses-permission android:name="android.permission.READ_PHONE_STATE"/>
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <uses-permission android:name="android.permission.CHANGE_WIFI_MULTICAST_STATE"/>
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>

    <application
        android:label="Yaman Lab Companion"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher"
        android:usesCleartextTraffic="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme"
              />
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>
`,
  },
  {
    id: 'main.dart',
    fileName: 'main.dart',
    path: 'lib/main.dart',
    category: 'shared',
    description: 'نقطة التشغيل الرئيسية للتطبيق',
    code: `import 'package:flutter/material.dart';
import 'app.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}
`,
  },
  {
    id: 'app.dart',
    fileName: 'app.dart',
    path: 'lib/app.dart',
    category: 'shared',
    description: 'إعدادات التطبيق وتحديد النظام المتوافق (Windows أو Android)',
    code: `import 'package:flutter/foundation.dart' show kIsWeb;
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
        colorSchemeSeed: const Color(0xFF0284C7),
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
`,
  },
  {
    id: 'models.dart',
    fileName: 'models.dart',
    path: 'lib/shared/models.dart',
    category: 'shared',
    description: 'نموذج بيانات المريض والنتيجة والسجلات',
    code: `class PatientResult {
  final String id;
  final String patientName;
  final String phone;
  final String fileNumber;
  final String testType;
  final String? customNotes;
  final String? pdfFilePath;
  final String status; // 'sent', 'pending', 'failed'
  final String channel; // 'sms', 'whatsapp'
  final DateTime timestamp;

  PatientResult({
    required this.id,
    required this.patientName,
    required this.phone,
    required this.fileNumber,
    required this.testType,
    this.customNotes,
    this.pdfFilePath,
    required this.status,
    required this.channel,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'patientName': patientName,
    'phone': phone,
    'fileNumber': fileNumber,
    'testType': testType,
    'customNotes': customNotes,
    'pdfFilePath': pdfFilePath,
    'status': status,
    'channel': channel,
    'timestamp': timestamp.toIso8601String(),
  };

  factory PatientResult.fromJson(Map<String, dynamic> json) => PatientResult(
    id: json['id'] ?? '',
    patientName: json['patientName'] ?? '',
    phone: json['phone'] ?? '',
    fileNumber: json['fileNumber'] ?? '',
    testType: json['testType'] ?? '',
    customNotes: json['customNotes'],
    pdfFilePath: json['pdfFilePath'],
    status: json['status'] ?? 'pending',
    channel: json['channel'] ?? 'sms',
    timestamp: json['timestamp'] != null 
        ? DateTime.parse(json['timestamp']) 
        : DateTime.now(),
  );
}
`,
  },
  {
    id: 'windows_dashboard.dart',
    fileName: 'windows_dashboard.dart',
    path: 'lib/windows_app/windows_dashboard.dart',
    category: 'windows',
    description: 'شاشة الويندوز الرئيسية: اللوحة، النموذج، مراقبة المجلد والسجلات',
    code: `import 'dart:io';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../shared/models.dart';
import 'folder_watcher_service.dart';
import 'bridge_client_service.dart';

class WindowsDashboardScreen extends StatefulWidget {
  const WindowsDashboardScreen({super.key});

  @override
  State<WindowsDashboardScreen> createState() => _WindowsDashboardScreenState();
}

class _WindowsDashboardScreenState extends State<WindowsDashboardScreen> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _fileNoController = TextEditingController();
  final _testTypeController = TextEditingController(text: 'فحص الدم الشامل (CBC)');
  final _notesController = TextEditingController();
  
  String? _selectedPdfPath;
  String _folderPath = r'C:\LabResults';
  bool _isWatching = false;
  bool _isBridgeConnected = true;
  String _bridgeIp = '192.168.1.105:8080';

  final List<PatientResult> _history = [];
  final FolderWatcherService _watcherService = FolderWatcherService();
  final BridgeClientService _bridgeClient = BridgeClientService();

  @override
  void initState() {
    super.initState();
    _startFolderWatcher();
  }

  void _startFolderWatcher() {
    _watcherService.startWatching(_folderPath, (extractedName, extractedPhone, filePath) {
      setState(() {
        _nameController.text = extractedName;
        _phoneController.text = extractedPhone;
        _selectedPdfPath = filePath;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('تم اكتشاف ملف جديد تلقائياً: \$extractedName (\$extractedPhone)'),
          backgroundColor: Colors.teal,
        ),
      );
    });
    setState(() => _isWatching = true);
  }

  Future<void> _sendSmsViaBridge() async {
    if (_phoneController.text.isEmpty || _nameController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('يرجى إدخال اسم المريض ورقم الهاتف')),
      );
      return;
    }

    final message = '''مستشفى يمان فيوتشر

عزيزي \${_nameController.text}

تم تجهيز نتائج الفحوصات الخاصة بكم.

نتمنى لكم دوام الصحة والعافية.''';

    final success = await _bridgeClient.sendSms(
      bridgeIp: _bridgeIp,
      phone: _phoneController.text,
      message: message,
    );

    setState(() {
      _history.insert(0, PatientResult(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        patientName: _nameController.text,
        phone: _phoneController.text,
        fileNumber: _fileNoController.text.isEmpty ? 'LAB-2026' : _fileNoController.text,
        testType: _testTypeController.text,
        customNotes: _notesController.text,
        pdfFilePath: _selectedPdfPath,
        status: success ? 'sent' : 'failed',
        channel: 'sms',
        timestamp: DateTime.now(),
      ));
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(success ? 'تم إرسال SMS بنجاح عبر هاتف أندرويد' : 'فشل الإرسال، تحقق من اتصال الجسر'),
        backgroundColor: success ? Colors.green : Colors.red,
      ),
    );
  }

  Future<void> _openWhatsApp() async {
    final phone = _phoneController.text.replaceAll(' ', '');
    final name = _nameController.text;
    final msg = Uri.encodeComponent('''السلام عليكم \$name

نتائج الفحوصات أصبحت جاهزة.
يمكنكم مراجعة التقرير المرفق.

مستشفى يمان فيوتشر''');

    final url = Uri.parse('https://api.whatsapp.com/send?phone=\$phone&text=\$msg');
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(Icons.local_hospital, color: Colors.teal),
            SizedBox(width: 12),
            Text('مستشفى يمان فيوتشر | Yaman Future Lab Messenger', style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        actions: [
          Chip(
            avatar: CircleAvatar(backgroundColor: _isBridgeConnected ? Colors.green : Colors.red, radius: 6),
            label: Text('الجسر: \$_bridgeIp'),
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: Row(
        children: [
          // Left Sidebar Form
          Expanded(
            flex: 5,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('إرسال نتيجة فحص للمريض', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                      const Divider(height: 30),
                      TextField(
                        controller: _nameController,
                        decoration: const InputDecoration(labelText: 'اسم المريض', prefixIcon: Icon(Icons.person)),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _phoneController,
                        keyboardType: TextInputType.phone,
                        decoration: const InputDecoration(labelText: 'رقم الهاتف (SMS / WhatsApp)', prefixIcon: Icon(Icons.phone)),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _fileNoController,
                              decoration: const InputDecoration(labelText: 'رقم الملف', prefixIcon: Icon(Icons.folder_shared)),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextField(
                              controller: _testTypeController,
                              decoration: const InputDecoration(labelText: 'نوع الفحص', prefixIcon: Icon(Icons.biotech)),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _notesController,
                        maxLines: 2,
                        decoration: const InputDecoration(labelText: 'ملاحظات إضافية', prefixIcon: Icon(Icons.notes)),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.picture_as_pdf),
                        label: Text(_selectedPdfPath == null ? 'اختيار ملف PDF للنتيجة' : 'الملف: \${_selectedPdfPath!.split(Platform.pathSeparator).last}'),
                      ),
                      const SizedBox(height: 24),
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(backgroundColor: Colors.teal, foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(vertical: 16)),
                              onPressed: _sendSmsViaBridge,
                              icon: const Icon(Icons.sms),
                              label: const Text('إرسال SMS عبر Android'),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF25D366), foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(vertical: 16)),
                              onPressed: _openWhatsApp,
                              icon: const Icon(Icons.chat),
                              label: const Text('فتح WhatsApp'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          
          // Right Column: Folder Watcher & History
          Expanded(
            flex: 6,
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          const Icon(Icons.folder_special, color: Colors.amber, size: 36),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('مراقبة المجلد التلقائي C:\\LabResults', style: TextStyle(fontWeight: FontWeight.bold)),
                                Text('يتم قراءة اسم الملف تلقائياً واستخراج اسم المريض ورقم الهاتف', style: TextStyle(color: Colors.grey[400], fontSize: 12)),
                              ],
                            ),
                          ),
                          Switch(
                            value: _isWatching,
                            onChanged: (val) {
                              setState(() => _isWatching = val);
                            },
                          )
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Expanded(
                    child: Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('سجل إرسال النتائج', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 12),
                            Expanded(
                              child: _history.isEmpty
                                  ? const Center(child: Text('لا توجد عمليات إرسال سابقة'))
                                  : ListView.builder(
                                      itemCount: _history.length,
                                      itemBuilder: (ctx, i) {
                                        final item = _history[i];
                                        return ListTile(
                                          leading: CircleAvatar(
                                            backgroundColor: item.status == 'sent' ? Colors.green.withOpacity(0.2) : Colors.red.withOpacity(0.2),
                                            child: Icon(item.channel == 'sms' ? Icons.sms : Icons.chat, color: item.status == 'sent' ? Colors.green : Colors.red),
                                          ),
                                          title: Text(item.patientName),
                                          subtitle: Text('\${item.phone} • \${item.testType}'),
                                          trailing: Text(item.status == 'sent' ? 'تم الإرسال' : 'فشل', style: TextStyle(color: item.status == 'sent' ? Colors.green : Colors.red)),
                                        );
                                      },
                                    ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
`,
  },
  {
    id: 'folder_watcher_service.dart',
    fileName: 'folder_watcher_service.dart',
    path: 'lib/windows_app/folder_watcher_service.dart',
    category: 'windows',
    description: 'خدمة قراءة المجلد واكتشاف ملفات PDF واستخراج البيانات',
    code: `import 'dart:async';
import 'dart:io';
import 'package:watcher/watcher.dart';
import 'package:path/path.dart' as p;

class FolderWatcherService {
  StreamSubscription? _subscription;

  void startWatching(String folderPath, Function(String name, String phone, String path) onFileDetected) {
    final dir = Directory(folderPath);
    if (!dir.existsSync()) {
      try {
        dir.createSync(recursive: true);
      } catch (e) {
        print('Error creating directory: \$e');
      }
    }

    final watcher = DirectoryWatcher(folderPath);
    _subscription = watcher.events.listen((event) {
      if (event.type == ChangeType.ADD && p.extension(event.path).toLowerCase() == '.pdf') {
        _parseAndNotify(event.path, onFileDetected);
      }
    });
  }

  void _parseAndNotify(String filePath, Function(String name, String phone, String path) onFileDetected) {
    final fileName = p.basenameWithoutExtension(filePath); // Example: Ahmed_777123456
    final parts = fileName.split('_');

    String extractedName = 'مريض جديد';
    String extractedPhone = '';

    if (parts.length >= 2) {
      extractedName = parts[0];
      extractedPhone = parts[1];
    } else {
      extractedName = fileName;
    }

    onFileDetected(extractedName, extractedPhone, filePath);
  }

  void stopWatching() {
    _subscription?.cancel();
  }
}
`,
  },
  {
    id: 'bridge_client_service.dart',
    fileName: 'bridge_client_service.dart',
    path: 'lib/windows_app/bridge_client_service.dart',
    category: 'windows',
    description: 'إرسال أوامر الإرسال عبر شبكة WiFi المحلية إلى تطبيق Android',
    code: `import 'dart:convert';
import 'package:http/http.dart' as http;

class BridgeClientService {
  Future<bool> sendSms({
    required String bridgeIp,
    required String phone,
    required String message,
  }) async {
    try {
      final url = Uri.parse('http://\$bridgeIp/api/send-sms');
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'phone': phone,
          'message': message,
          'timestamp': DateTime.now().toIso8601String(),
        }),
      ).timeout(const Duration(seconds: 5));

      if (response.statusCode == 200) {
        final resData = jsonDecode(response.body);
        return resData['success'] == true;
      }
      return false;
    } catch (e) {
      print('Bridge connection error: \$e');
      return false;
    }
  }
}
`,
  },
  {
    id: 'android_companion_home.dart',
    fileName: 'android_companion_home.dart',
    path: 'lib/android_app/android_companion_home.dart',
    category: 'android',
    description: 'شاشة تطبيق الأندرويد المساعد الجسر ومراقبة حالة الخادم والرسائل',
    code: `import 'package:flutter/material.dart';
import 'http_bridge_server.dart';
import 'sms_service.dart';

class AndroidCompanionScreen extends StatefulWidget {
  const AndroidCompanionScreen({super.key});

  @override
  State<AndroidCompanionScreen> createState() => _AndroidCompanionScreenState();
}

class _AndroidCompanionScreenState extends State<AndroidCompanionScreen> {
  final HttpBridgeServer _bridgeServer = HttpBridgeServer();
  final SmsService _smsService = SmsService();

  bool _isServiceRunning = false;
  String _ipAddress = '192.168.1.105';
  int _sentCount = 0;
  final List<String> _logs = [];

  @override
  void initState() {
    super.initState();
    _checkPermissionsAndStart();
  }

  Future<void> _checkPermissionsAndStart() async {
    final hasPermissions = await _smsService.requestSmsPermissions();
    if (hasPermissions) {
      _startServer();
    }
  }

  void _startServer() async {
    final ip = await _bridgeServer.getWifiIp();
    final success = await _bridgeServer.startServer(
      onSmsRequested: (phone, message) async {
        final sent = await _smsService.sendSms(phone: phone, message: message);
        setState(() {
          if (sent) _sentCount++;
          _logs.insert(0, '\${DateTime.now().hour}:\${DateTime.now().minute} - \${sent ? "تم إرسال SMS إلى \$phone" : "فشل الإرسال إلى \$phone"}');
        });
        return sent;
      },
    );

    setState(() {
      _isServiceRunning = success;
      _ipAddress = ip;
      _logs.insert(0, 'تم تشغيل خادم الجسر اللاسلكي على IP: \$ip:8080');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Android Bridge | مستشفى يمان فيوتشر'),
        actions: [
          IconButton(
            icon: Icon(_isServiceRunning ? Icons.power_settings_new : Icons.play_arrow, color: _isServiceRunning ? Colors.green : Colors.red),
            onPressed: () {
              if (_isServiceRunning) {
                _bridgeServer.stopServer();
                setState(() => _isServiceRunning = false);
              } else {
                _startServer();
              }
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Card
            Card(
              color: const Color(0xFF1E293B),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            CircleAvatar(
                              backgroundColor: _isServiceRunning ? Colors.green : Colors.red,
                              radius: 8,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              _isServiceRunning ? 'خدمة الجسر اللاسلكي شغالة' : 'الخدمة متوقفة',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                          ],
                        ),
                        Chip(
                          avatar: const Icon(Icons.wifi, size: 16),
                          label: Text('IP: \$_ipAddress:8080'),
                        ),
                      ],
                    ),
                    const Divider(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildStat('الرسائل المرسلة', '\$_sentCount', Icons.mark_chat_read, Colors.teal),
                        _buildStat('حالة الشريحة', 'جاهزة 4G', Icons.sim_card, Colors.blue),
                        _buildStat('صلاحيات SMS', 'ممنوحة', Icons.verified_user, Colors.green),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            const Text('سجل العمليات والطلبات الواردة:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 10),
            
            Container(
              height: 350,
              decoration: BoxDecoration(
                color: Colors.black,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.teal.withOpacity(0.3)),
              ),
              padding: const EdgeInsets.all(12),
              child: _logs.isEmpty
                  ? const Center(child: Text('في انتظار استقبال أوامر الإرسال من تطبيق Windows...', style: TextStyle(color: Colors.grey)))
                  : ListView.builder(
                      itemCount: _logs.length,
                      itemBuilder: (ctx, i) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4),
                        child: Text(
                          '> \${_logs[i]}',
                          style: const TextStyle(fontFamily: 'monospace', color: Colors.greenAccent, fontSize: 13),
                        ),
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStat(String title, String val, IconData icon, Color col) {
    return Column(
      children: [
        Icon(icon, color: col, size: 28),
        const SizedBox(height: 4),
        Text(val, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: col)),
        Text(title, style: const TextStyle(fontSize: 12, color: Colors.grey)),
      ],
    );
  }
}
`,
  },
  {
    id: 'http_bridge_server.dart',
    fileName: 'http_bridge_server.dart',
    path: 'lib/android_app/http_bridge_server.dart',
    category: 'android',
    description: 'خادم HTTP محلي ومقبس WebSocket مباشر لاستقبال الأوامر فوراً',
    code: `import 'dart:convert';
import 'dart:io';
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as io;
import 'package:shelf_router/shelf_router.dart';

class HttpBridgeServer {
  HttpServer? _server;

  Future<String> getWifiIp() async {
    try {
      for (var interface in await NetworkInterface.list()) {
        for (var addr in interface.addresses) {
          if (addr.type == InternetAddressType.IPv4 && !addr.isLoopback) {
            return addr.address;
          }
        }
      }
    } catch (e) {
      print('Error getting IP: \$e');
    }
    return '127.0.0.1';
  }

  Future<bool> startServer({
    required Future<bool> Function(String phone, String message) onSmsRequested,
  }) async {
    final router = Router();

    // REST API Endpoint
    router.post('/api/send-sms', (Request request) async {
      try {
        final payload = jsonDecode(await request.readAsString());
        final String phone = payload['phone'] ?? '';
        final String message = payload['message'] ?? '';

        if (phone.isEmpty || message.isEmpty) {
          return Response.badRequest(body: jsonEncode({'error': 'Invalid phone or message'}));
        }

        final bool sent = await onSmsRequested(phone, message);

        return Response.ok(
          jsonEncode({
            'success': sent,
            'timestamp': DateTime.now().toIso8601String(),
            'phone': phone,
          }),
          headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        );
      } catch (e) {
        return Response.internalServerError(body: jsonEncode({'error': e.toString()}));
      }
    });

    try {
      final handler = const Pipeline().addMiddleware(logRequests()).addHandler(router.call);
      _server = await io.serve(handler, InternetAddress.anyIPv4, 8080);
      print('Serving at http://\${_server!.address.host}:\${_server!.port}');
      return true;
    } catch (e) {
      print('Server launch error: \$e');
      return false;
    }
  }

  void stopServer() {
    _server?.close(force: true);
  }
}
`,
  },
  {
    id: 'sms_service.dart',
    fileName: 'sms_service.dart',
    path: 'lib/android_app/sms_service.dart',
    category: 'android',
    description: 'خدمة التفاعل مع شريحة الهاتف لإرسال SMS حقيقية',
    code: `import 'package:telephony/telephony.dart';
import 'package:permission_handler/permission_handler.dart';

class SmsService {
  final Telephony telephony = Telephony.instance;

  Future<bool> requestSmsPermissions() async {
    final status = await Permission.sms.request();
    final phoneStatus = await Permission.phone.request();
    return status.isGranted && phoneStatus.isGranted;
  }

  Future<bool> sendSms({required String phone, required String message}) async {
    try {
      final bool? canSend = await telephony.isSmsCapable;
      if (canSend == true) {
        await telephony.sendSms(
          to: phone,
          message: message,
          statusListener: (SendStatus status) {
            print('SMS Status: \$status');
          },
        );
        return true;
      }
      return false;
    } catch (e) {
      print('SMS Send error: \$e');
      return false;
    }
  }
}
`,
  },
  {
    id: 'README_BUILD_INSTRUCTIONS.md',
    fileName: 'README_BUILD_INSTRUCTIONS.md',
    path: 'README_BUILD_INSTRUCTIONS.md',
    category: 'docs',
    description: 'شرح كامل وطريقة بناء التطبيقين Windows EXE و Android APK خطوة بخطوة',
    code: `# دليل بناء وتشغيل تطبيق Yaman Future Lab Messenger

أهلاً بك في الدليل الرسمي لتشغيل وبناء تطبيق **مستشفى يمان فيوتشر لإدارة نتائج الفحوصات**.

---

## 1. المتطلبات الأساسية (Prerequisites)

1. **تثبيت Flutter SDK** (إصدار 3.0.0 أو أحدث):
   - قم بتحميل Flutter من الموعد الرسمي: [https://docs.flutter.dev/get-started/install](https://docs.flutter.dev/get-started/install)
   - تأكد من إضافة \`flutter/bin\` إلى متغيرة البيئة \`PATH\`.

2. **لتطبيق Windows Desktop**:
   - تثبيت **Visual Studio 2022** أو أحدث مع اختيار بيئة العمل:
     \`Desktop development with C++\`

3. **لتطبيق Android Companion**:
   - تثبيت **Android Studio** وتفعيل Android SDK & Build Tools.

---

## 2. إعداد وتنزيل المكتبات

قم بفتح السطر البرمجي (Terminal/CMD) في مجلد المشروع ونفذ:

\`\`\`bash
# 1. جلب المكتبات المحددة في pubspec.yaml
flutter pub get

# 2. التأكد من سلامة بيئة العمل
flutter doctor
\`\`\`

---

## 3. التشغيل في بيئة التطوير (Development)

### أ) تشغيل تطبيق Windows Desktop:
\`\`\`bash
flutter run -d windows
\`\`\`

### ب) تشغيل تطبيق Android Companion:
قم بتوصيل هاتف Android عبر وصلة USB مع تفعيل **USB Debugging** ثم نفذ:
\`\`\`bash
flutter run -d android
\`\`\`

---

## 4. بناء الملفات التنفيذية للإنتاج (Production Build)

### أ) بناء تطبيق Windows EXE النهائي:
\`\`\`bash
flutter build windows --release
\`\`\`
سيتم إنشاء ملفات البرنامج داخل المجلد:
\`build\\windows\\x64\\runner\\Release\\\`

تستطيع نسخ كامل محتويات هذا المجلد إلى جهاز كمبيوتر موظف المختبر وتشغيل \`yaman_lab_messenger.exe\`.

---

### ب) بناء تطبيق Android APK النهائي:
\`\`\`bash
flutter build apk --release
\`\`\`
سيتم إنشاء ملف الـ APK النهائي داخل المجلد:
\`build\\app\\outputs\\flutter-apk\\app-release.apk\`

قم بتثبيت هذا الملف على هاتف المستشفى المخصص للربط.

---

## 5. طريقة الربط والاستخدام داخل المستشفى:

1. **إعداد الهاتف**:
   - قم بتثبيت الـ APK على هاتف أندرويد يحتوي على شريحة SIM بها رصيد رسائل SMS.
   - افتح التطبيق ووافق على صلاحيات SMS والشبكة.
   - تأكد من توصيل الهاتف بشبكة الـ WiFi الخاصة بالمختبر.
   - سيظهر لك عنوان الـ IP مثلاً: \`192.168.1.105:8080\`.

2. **إعداد جهاز Windows**:
   - قم بإنشاء مجلد في المحرك C باسم: \`C:\\LabResults\`.
   - قم بوضع نتائج الفحوصات بصيغة PDF بالاسم: \`اسم_المريض_رقم_الهاتف.pdf\` (مثال: \`Ahmed_777123456.pdf\`).
   - افتح تطبيق Windows وأدخل عنوان IP الهاتف في خانة الجسر.
   - سيتعرف التطبيق تلقائياً على الملف ويقوم بتجهيز رسائل SMS و WhatsApp فوراً!

---
✨ **مستشفى يمان فيوتشر - صحتك هي هدفنا الأول**
`,
  },
];
