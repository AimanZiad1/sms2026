import 'dart:io';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:yaman_lab_messenger/shared/models.dart';
import 'package:yaman_lab_messenger/windows_app/folder_watcher_service.dart';
import 'package:yaman_lab_messenger/windows_app/bridge_client_service.dart';

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
          content: Text('تم اكتشاف ملف جديد تلقائياً: $extractedName ($extractedPhone)'),
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

عزيزي ${_nameController.text}

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
    final msg = Uri.encodeComponent('''السلام عليكم $name

نتائج الفحوصات أصبحت جاهزة.
يمكنكم مراجعة التقرير المرفق.

مستشفى يمان فيوتشر''');

    final url = Uri.parse('https://api.whatsapp.com/send?phone=$phone&text=$msg');
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
            label: Text('الجسر: $_bridgeIp'),
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
                        label: Text(_selectedPdfPath == null ? 'اختيار ملف PDF للنتيجة' : 'الملف: ${_selectedPdfPath!.split(Platform.pathSeparator).last}'),
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
                                          subtitle: Text('${item.phone} • ${item.testType}'),
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
