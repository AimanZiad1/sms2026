import 'package:telephony/telephony.dart';
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
            print('SMS Status: $status');
          },
        );
        return true;
      }
      return false;
    } catch (e) {
      print('SMS Send error: $e');
      return false;
    }
  }
}
