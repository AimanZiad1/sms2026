import 'package:flutter/material.dart';
import 'package:yaman_lab_messenger/android_app/http_bridge_server.dart';
import 'package:yaman_lab_messenger/android_app/sms_service.dart';

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
          _logs.insert(0, '${DateTime.now().hour}:${DateTime.now().minute} - ${sent ? "تم إرسال SMS إلى $phone" : "فشل الإرسال إلى $phone"}');
        });
        return sent;
      },
    );

    setState(() {
      _isServiceRunning = success;
      _ipAddress = ip;
      _logs.insert(0, 'تم تشغيل خادم الجسر اللاسلكي على IP: $ip:8080');
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
                          label: Text('IP: $_ipAddress:8080'),
                        ),
                      ],
                    ),
                    const Divider(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildStat('الرسائل المرسلة', '$_sentCount', Icons.mark_chat_read, Colors.teal),
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
                          '> ${_logs[i]}',
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
