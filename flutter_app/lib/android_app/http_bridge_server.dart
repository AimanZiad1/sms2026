import 'dart:convert';
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
      print('Error getting IP: $e');
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
      print('Serving at http://${_server!.address.host}:${_server!.port}');
      return true;
    } catch (e) {
      print('Server launch error: $e');
      return false;
    }
  }

  void stopServer() {
    _server?.close(force: true);
  }
}
