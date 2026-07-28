import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { FolderWatcherModule } from './components/FolderWatcherModule';
import { AndroidBridgeSimulator } from './components/AndroidBridgeSimulator';
import { OperationsLogView } from './components/OperationsLogView';
import { SettingsView } from './components/SettingsView';
import { FlutterCodeHub } from './components/FlutterCodeHub';
import { PdfPreviewModal } from './components/PdfPreviewModal';

import { 
  AppSettings, 
  BridgeStatus, 
  PatientResultNotification, 
  WatchedFolderFile, 
  BridgeLog 
} from './types';

import { 
  defaultSettings, 
  initialBridgeStatus, 
  initialNotifications, 
  initialWatchedFiles, 
  initialBridgeLogs 
} from './data/initialData';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // App Settings State (Persisted in localStorage)
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('yaman_lab_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // Bridge Status State
  const [bridgeStatus, setBridgeStatus] = useState<BridgeStatus>(initialBridgeStatus);

  // Bridge Logs Terminal
  const [bridgeLogs, setBridgeLogs] = useState<BridgeLog[]>(initialBridgeLogs);

  // Notifications Operations History
  const [notifications, setNotifications] = useState<PatientResultNotification[]>(() => {
    const saved = localStorage.getItem('yaman_lab_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Watched Folder Files State
  const [watchedFiles, setWatchedFiles] = useState<WatchedFolderFile[]>(initialWatchedFiles);

  // PDF Preview Modal State
  const [pdfModalData, setPdfModalData] = useState<{
    isOpen: boolean;
    fileName: string;
    patientName: string;
    testType: string;
  }>({
    isOpen: false,
    fileName: '',
    patientName: '',
    testType: '',
  });

  // Save Settings Effect
  useEffect(() => {
    localStorage.setItem('yaman_lab_settings', JSON.stringify(settings));
  }, [settings]);

  // Save Notifications Effect
  useEffect(() => {
    localStorage.setItem('yaman_lab_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Play subtle sound effect
  const playBeepSound = () => {
    if (!settings.soundEffects) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // Audio context ignored if blocked
    }
  };

  // Handler for Sending SMS via Android Companion Bridge
  const handleSendSms = async (
    notifData: Omit<PatientResultNotification, 'id' | 'sentAt' | 'status'>
  ): Promise<boolean> => {
    playBeepSound();

    if (!bridgeStatus.isServiceRunning) {
      const errLog: BridgeLog = {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('ar-SA'),
        type: 'error',
        message: 'فشل إرسال SMS - خدمة الجسر اللاسلكي متوقفة',
        details: 'يرجى تفعيل خادم الأندرويد المساعد في تبويب Android Companion',
      };
      setBridgeLogs(prev => [errLog, ...prev]);
      return false;
    }

    // Simulate WiFi network latency (400ms)
    await new Promise(res => setTimeout(res, 400));

    const newNotifId = `NOTIF-${Math.floor(100 + Math.random() * 900)}`;
    const nowStr = new Date().toLocaleString('ar-SA');

    const newNotif: PatientResultNotification = {
      ...notifData,
      id: newNotifId,
      status: 'sent',
      sentAt: nowStr,
    };

    // Update notifications history
    setNotifications(prev => [newNotif, ...prev]);

    // Add Terminal Logs in Bridge
    const reqLog: BridgeLog = {
      id: `LOG-${Date.now()}-1`,
      timestamp: new Date().toLocaleTimeString('ar-SA'),
      type: 'request',
      message: `طلب HTTP POST وارد من Windows App لإرسال SMS`,
      details: `إلى: ${notifData.phone} | المريض: ${notifData.patientName} | نوع الفحص: ${notifData.testType}`,
    };

    const smsLog: BridgeLog = {
      id: `LOG-${Date.now()}-2`,
      timestamp: new Date().toLocaleTimeString('ar-SA'),
      type: 'sms',
      message: `تم تسليم رسالة SMS حقيقية عبر شريحة ${bridgeStatus.simCarrier}`,
      details: `Status: SENT_OK | Phone: ${notifData.phone} | MessageID: SMS-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    setBridgeLogs(prev => [smsLog, reqLog, ...prev]);

    // Update Bridge total counters
    setBridgeStatus(prev => ({
      ...prev,
      totalSentCount: prev.totalSentCount + 1,
    }));

    return true;
  };

  // Handler for opening WhatsApp Web link
  const handleSendWhatsApp = (
    notifData: Omit<PatientResultNotification, 'id' | 'sentAt' | 'status'>
  ) => {
    playBeepSound();

    const cleanPhone = notifData.phone.replace(/\s+/g, '');
    let msg = settings.whatsappTemplate;
    msg = msg.replace(/\{اسم المريض\}/g, notifData.patientName);
    msg = msg.replace(/\{نوع الفحص\}/g, notifData.testType);
    msg = msg.replace(/\{رقم الملف\}/g, notifData.fileNumber);

    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');

    const nowStr = new Date().toLocaleString('ar-SA');
    const newNotif: PatientResultNotification = {
      ...notifData,
      id: `NOTIF-${Math.floor(100 + Math.random() * 900)}`,
      status: 'sent',
      sentAt: nowStr,
      channel: 'whatsapp',
    };

    setNotifications(prev => [newNotif, ...prev]);
  };

  // Handler for PDF File Drop in Folder Watcher C:\LabResults
  const handleSimulateNewPdfDrop = (fileName: string) => {
    playBeepSound();

    // RegEx parsing for filename like "Ahmed_777123456.pdf"
    const nameWithoutExt = fileName.replace(/\.pdf$/i, '');
    const parts = nameWithoutExt.split('_');

    let extractedName = 'مريض جديد';
    let extractedPhone = '';

    if (parts.length >= 2) {
      extractedName = parts[0];
      extractedPhone = parts[1];
    } else {
      extractedName = nameWithoutExt;
    }

    const newFile: WatchedFolderFile = {
      id: `FILE-${Date.now()}`,
      fileName: fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`,
      filePath: `${settings.folderPath}\\${fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`}`,
      detectedAt: new Date().toLocaleTimeString('ar-SA'),
      extractedName: extractedName,
      extractedPhone: extractedPhone,
      extractedFileNo: `LAB-AUTO-${Math.floor(100 + Math.random() * 900)}`,
      processed: false,
      autoSent: false,
      status: 'new',
    };

    setWatchedFiles(prev => [newFile, ...prev]);
  };

  // Dispatch directly from Folder Watcher
  const handleDispatchFromWatcher = (file: WatchedFolderFile) => {
    setActiveTab('dashboard');
    // Pre-fill
    // We update state via notifications or directly trigger SMS
    handleSendSms({
      patientName: file.extractedName,
      phone: file.extractedPhone || '777123456',
      fileNumber: file.extractedFileNo || 'LAB-AUTO-881',
      testType: 'فحص مخبري أوتوماتيكي (Folder PDF)',
      pdfFileName: file.fileName,
      pdfFileSize: '480 KB',
      channel: 'sms',
    });

    // Mark file as processed
    setWatchedFiles(prev => prev.map(f => f.id === file.id ? { ...f, processed: true } : f));
  };

  // Modal handler
  const handleOpenPdfModal = (fileName: string, patientName: string, testType: string) => {
    setPdfModalData({
      isOpen: true,
      fileName,
      patientName,
      testType,
    });
  };

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleResetSettings = () => {
    setSettings(defaultSettings);
  };

  const handleClearHistory = () => {
    setNotifications([]);
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleResendNotification = (notif: PatientResultNotification) => {
    if (notif.channel === 'sms') {
      handleSendSms({
        patientName: notif.patientName,
        phone: notif.phone,
        fileNumber: notif.fileNumber,
        testType: notif.testType,
        customNotes: notif.customNotes,
        pdfFileName: notif.pdfFileName,
        channel: 'sms',
      });
    } else {
      handleSendWhatsApp({
        patientName: notif.patientName,
        phone: notif.phone,
        fileNumber: notif.fileNumber,
        testType: notif.testType,
        customNotes: notif.customNotes,
        pdfFileName: notif.pdfFileName,
        channel: 'whatsapp',
      });
    }
  };

  return (
    <div className={`min-h-screen ${settings.darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bridgeStatus={bridgeStatus}
        settings={settings}
        updateSettings={handleUpdateSettings}
        unsentCount={notifications.filter(n => n.status === 'pending').length}
        detectedFilesCount={watchedFiles.filter(f => !f.processed).length}
      />

      {/* Main Tab Views Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Tab 1: Dashboard & Direct Send */}
        {activeTab === 'dashboard' && (
          <DashboardView
            settings={settings}
            bridgeStatus={bridgeStatus}
            notifications={notifications}
            onSendSms={handleSendSms}
            onSendWhatsApp={handleSendWhatsApp}
            onOpenPdfModal={handleOpenPdfModal}
          />
        )}

        {/* Tab 2: C:\LabResults Folder Watcher Module */}
        {activeTab === 'folder' && (
          <FolderWatcherModule
            settings={settings}
            updateSettings={handleUpdateSettings}
            watchedFiles={watchedFiles}
            onSimulateNewPdfDrop={handleSimulateNewPdfDrop}
            onDispatchFromWatcher={handleDispatchFromWatcher}
            onOpenPdfModal={handleOpenPdfModal}
          />
        )}

        {/* Tab 3: Android Companion Bridge Simulator */}
        {activeTab === 'android' && (
          <AndroidBridgeSimulator
            bridgeStatus={bridgeStatus}
            bridgeLogs={bridgeLogs}
            onToggleService={() => setBridgeStatus(prev => ({ ...prev, isServiceRunning: !prev.isServiceRunning }))}
            onSendTestSmsFromPhone={(phone, msg) => handleSendSms({
              patientName: 'اختبار شريحة الهاتف',
              phone: phone,
              fileNumber: 'TEST-001',
              testType: 'فحص تجريبي',
              channel: 'sms',
            })}
            onClearLogs={() => setBridgeLogs([])}
          />
        )}

        {/* Tab 4: Operations Log */}
        {activeTab === 'logs' && (
          <OperationsLogView
            notifications={notifications}
            onResendNotification={handleResendNotification}
            onClearHistory={handleClearHistory}
            onDeleteNotification={handleDeleteNotification}
            onOpenPdfModal={handleOpenPdfModal}
          />
        )}

        {/* Tab 5: Settings */}
        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onSaveSettings={(s) => setSettings(s)}
            onResetToDefault={handleResetSettings}
          />
        )}

        {/* Tab 6: Flutter Source Code Exporter */}
        {activeTab === 'flutter_code' && (
          <FlutterCodeHub />
        )}

      </main>

      {/* PDF Report Modal Preview */}
      {pdfModalData.isOpen && (
        <PdfPreviewModal
          fileName={pdfModalData.fileName}
          patientName={pdfModalData.patientName}
          testType={pdfModalData.testType}
          onClose={() => setPdfModalData(prev => ({ ...prev, isOpen: false }))}
        />
      )}

    </div>
  );
}
