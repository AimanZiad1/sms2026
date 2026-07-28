import { AppSettings, BridgeStatus, PatientResultNotification, WatchedFolderFile, BridgeLog } from '../types';

export const defaultSettings: AppSettings = {
  hospitalName: 'مستشفى يمان فيوتشر',
  hospitalLogoText: 'YAMAN FUTURE HOSPITAL',
  folderPath: 'C:\\LabResults',
  smsTemplate: `مستشفى يمان فيوتشر

عزيزي {اسم المريض}

تم تجهيز نتائج الفحوصات الخاصة بكم.

نتمنى لكم دوام الصحة والعافية.`,
  whatsappTemplate: `السلام عليكم {اسم المريض}

نتائج الفحوصات أصبحت جاهزة.
يمكنكم مراجعة التقرير المرفق.

مستشفى يمان فيوتشر`,
  bridgeIp: '192.168.1.105',
  bridgePort: 8080,
  autoSendOnDetect: false,
  soundEffects: true,
  darkMode: true,
  simSlot: 1,
  autoConnectOnStartup: true,
};

export const initialBridgeStatus: BridgeStatus = {
  isConnected: true,
  bridgeIp: '192.168.1.105',
  bridgePort: 8080,
  wifiSsid: 'Yaman_Hospital_Lab_WiFi',
  batteryLevel: 92,
  simCarrier: 'Yemen Mobile 4G LTE',
  simPhoneNumber: '+967 777 123 456',
  signalStrength: 94,
  sendSmsPermission: true,
  readStatePermission: true,
  internetPermission: true,
  isServiceRunning: true,
  totalSentCount: 142,
  failedCount: 2,
  lastPing: 'منذ ثوانٍ',
};

export const initialNotifications: PatientResultNotification[] = [
  {
    id: 'NOTIF-101',
    patientName: 'أحمد صالح العمودي',
    phone: '0501234567',
    fileNumber: 'LAB-2026-881',
    testType: 'فحص الدم الشامل (CBC)',
    customNotes: 'النتيجة طبيعية وممتازة',
    pdfFileName: 'Ahmed_0501234567.pdf',
    pdfFileSize: '420 KB',
    status: 'sent',
    channel: 'sms',
    sentAt: '2026-07-28 12:45 PM',
  },
  {
    id: 'NOTIF-102',
    patientName: 'فاطمة محمد الزهراني',
    phone: '777123456',
    fileNumber: 'LAB-2026-882',
    testType: 'وظائف الكبد والكلى',
    pdfFileName: 'Fatima_777123456.pdf',
    pdfFileSize: '510 KB',
    status: 'sent',
    channel: 'whatsapp',
    sentAt: '2026-07-28 01:10 PM',
  },
  {
    id: 'NOTIF-103',
    patientName: 'خالد عبدالله الحضرمي',
    phone: '770112233',
    fileNumber: 'LAB-2026-883',
    testType: 'السكر التراكمي (HbA1c)',
    pdfFileName: 'Khaled_770112233.pdf',
    pdfFileSize: '380 KB',
    status: 'sent',
    channel: 'sms',
    sentAt: '2026-07-28 01:30 PM',
  },
  {
    id: 'NOTIF-104',
    patientName: 'سارة عبدالمجيد السقاف',
    phone: '0559876543',
    fileNumber: 'LAB-2026-884',
    testType: 'تحليل الدهون الشامل (Lipid Profile)',
    pdfFileName: 'Sara_0559876543.pdf',
    pdfFileSize: '495 KB',
    status: 'pending',
    channel: 'sms',
    sentAt: '2026-07-28 02:05 PM',
  },
];

export const initialWatchedFiles: WatchedFolderFile[] = [
  {
    id: 'FILE-01',
    fileName: 'Ahmed_777123456.pdf',
    filePath: 'C:\\LabResults\\Ahmed_777123456.pdf',
    detectedAt: '12:40 PM',
    extractedName: 'Ahmed',
    extractedPhone: '777123456',
    extractedFileNo: 'LAB-AUTO-101',
    processed: true,
    autoSent: false,
    status: 'processed',
  },
  {
    id: 'FILE-02',
    fileName: 'Mohammed_055112233.pdf',
    filePath: 'C:\\LabResults\\Mohammed_055112233.pdf',
    detectedAt: '01:55 PM',
    extractedName: 'Mohammed',
    extractedPhone: '055112233',
    extractedFileNo: 'LAB-AUTO-102',
    processed: false,
    autoSent: false,
    status: 'new',
  },
  {
    id: 'FILE-03',
    fileName: 'Sami_773445566.pdf',
    filePath: 'C:\\LabResults\\Sami_773445566.pdf',
    detectedAt: '02:10 PM',
    extractedName: 'Sami',
    extractedPhone: '773445566',
    extractedFileNo: 'LAB-AUTO-103',
    processed: false,
    autoSent: false,
    status: 'queue',
  },
];

export const initialBridgeLogs: BridgeLog[] = [
  {
    id: 'LOG-001',
    timestamp: '12:45:02 PM',
    type: 'connect',
    message: 'تم تأسيس اتصال الجسر اللاسلكي مع Windows App',
    details: 'IP: 192.168.1.105:8080 | Protocol: HTTP REST & WebSocket',
  },
  {
    id: 'LOG-002',
    timestamp: '12:45:10 PM',
    type: 'request',
    message: 'طلب إرسال SMS جديد من التطبيق',
    details: 'إلى: 0501234567 | المريض: أحمد صالح العمودي',
  },
  {
    id: 'LOG-003',
    timestamp: '12:45:12 PM',
    type: 'sms',
    message: 'تم تسليم الرسالة النصية بنجاح عبر شريحة Yemen Mobile',
    details: 'Status: SENT_OK | MessageID: SMS-88412',
  },
  {
    id: 'LOG-004',
    timestamp: '01:30:05 PM',
    type: 'sms',
    message: 'تم تسليم رسالة SMS إلى خالد عبدالله الحضرمي (770112233)',
    details: 'Status: SENT_OK | MessageID: SMS-88415',
  },
];
