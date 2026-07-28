import 'dart:async';
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
        print('Error creating directory: $e');
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
