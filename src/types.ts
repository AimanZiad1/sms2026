export type SendStatus = 'sent' | 'pending' | 'failed';
export type ChannelType = 'sms' | 'whatsapp';

export interface PatientResultNotification {
  id: string;
  patientName: string;
  phone: string;
  fileNumber: string;
  testType: string;
  customNotes?: string;
  pdfFileName?: string;
  pdfFileDataUrl?: string;
  pdfFileSize?: string;
  status: SendStatus;
  channel: ChannelType;
  sentAt: string;
  bridgeLogId?: string;
  errorMessage?: string;
}

export interface WatchedFolderFile {
  id: string;
  fileName: string;
  filePath: string;
  detectedAt: string;
  extractedName: string;
  extractedPhone: string;
  extractedFileNo?: string;
  processed: boolean;
  autoSent: boolean;
  status: 'new' | 'queue' | 'processed' | 'error';
}

export interface BridgeStatus {
  isConnected: boolean;
  bridgeIp: string;
  bridgePort: number;
  wifiSsid: string;
  batteryLevel: number;
  simCarrier: string;
  simPhoneNumber: string;
  signalStrength: number;
  sendSmsPermission: boolean;
  readStatePermission: boolean;
  internetPermission: boolean;
  isServiceRunning: boolean;
  totalSentCount: number;
  failedCount: number;
  lastPing: string;
}

export interface BridgeLog {
  id: string;
  timestamp: string;
  type: 'request' | 'sms' | 'system' | 'error' | 'connect';
  message: string;
  details?: string;
  payload?: any;
}

export interface AppSettings {
  hospitalName: string;
  hospitalLogoText: string;
  folderPath: string;
  smsTemplate: string;
  whatsappTemplate: string;
  bridgeIp: string;
  bridgePort: number;
  autoSendOnDetect: boolean;
  soundEffects: boolean;
  darkMode: boolean;
  simSlot: number;
  autoConnectOnStartup: boolean;
}

export interface FlutterCodeFile {
  id: string;
  fileName: string;
  path: string;
  category: 'windows' | 'android' | 'shared' | 'config' | 'docs';
  description: string;
  code: string;
}
