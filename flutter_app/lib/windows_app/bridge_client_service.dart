import 'dart:convert';
import 'package:http/http.dart' as http;

class BridgeClientService {
  Future<bool> sendSms({
    required String bridgeIp,
    required String phone,
    required String message,
  }) async {
    try {
      final url = Uri.parse('http://$bridgeIp/api/send-sms');
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
      print('Bridge connection error: $e');
      return false;
    }
  }
}
