class PatientResult {
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
