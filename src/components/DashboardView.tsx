import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  FileText, 
  User, 
  Phone, 
  FolderGit2, 
  Eye, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  Paperclip, 
  Building2,
  FileSpreadsheet,
  Activity,
  Share2,
  Smartphone
} from 'lucide-react';
import { PatientResultNotification, AppSettings, BridgeStatus } from '../types';

interface DashboardViewProps {
  settings: AppSettings;
  bridgeStatus: BridgeStatus;
  notifications: PatientResultNotification[];
  onSendSms: (notif: Omit<PatientResultNotification, 'id' | 'sentAt' | 'status'>) => Promise<boolean>;
  onSendWhatsApp: (notif: Omit<PatientResultNotification, 'id' | 'sentAt' | 'status'>) => void;
  onOpenPdfModal: (fileName: string, patientName: string, testType: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  settings,
  bridgeStatus,
  notifications,
  onSendSms,
  onSendWhatsApp,
  onOpenPdfModal,
}) => {
  // Form State
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [fileNumber, setFileNumber] = useState('');
  const [testType, setTestType] = useState('فحص الدم الشامل (CBC)');
  const [customNotes, setCustomNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>({
    name: 'Ahmed_777123456.pdf',
    size: '420 KB',
  });
  
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Common Test Types for dropdown
  const commonTests = [
    'فحص الدم الشامل (CBC)',
    'وظائف الكبد والكلى (LFT & RFT)',
    'السكر التراكمي (HbA1c)',
    'تحليل الدهون الشامل (Lipid Profile)',
    'فحص الغدة الدرقية (TSH)',
    'فحص فيتامين د وباء 12 (Vitamin D & B12)',
    'فحص الفيروسات الشامل (Hepatitis & HIV)',
    'تحليل البول والراسب (General Urine Exam)',
    'باقة الفحص الطبي الشامل (Full Checkup)',
  ];

  // Helper to compile dynamic templates
  const compileSmsMessage = () => {
    let msg = settings.smsTemplate;
    msg = msg.replace(/\{اسم المريض\}/g, patientName || 'أحمد علي');
    msg = msg.replace(/\{نوع الفحص\}/g, testType);
    msg = msg.replace(/\{رقم الملف\}/g, fileNumber || 'LAB-2026-901');
    return msg;
  };

  const compileWhatsappMessage = () => {
    let msg = settings.whatsappTemplate;
    msg = msg.replace(/\{اسم المريض\}/g, patientName || 'أحمد علي');
    msg = msg.replace(/\{نوع الفحص\}/g, testType);
    msg = msg.replace(/\{رقم الملف\}/g, fileNumber || 'LAB-2026-901');
    return msg;
  };

  // Handlers
  const handleSmsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !phone.trim()) {
      setFeedback({ type: 'error', msg: 'يرجى كتابة اسم المريض ورقم الهاتف قبل الإرسال' });
      return;
    }

    setIsSending(true);
    setFeedback(null);

    const success = await onSendSms({
      patientName,
      phone,
      fileNumber: fileNumber || `LAB-${Math.floor(1000 + Math.random() * 9000)}`,
      testType,
      customNotes,
      pdfFileName: selectedFile?.name,
      pdfFileSize: selectedFile?.size,
      channel: 'sms',
    });

    setIsSending(false);
    if (success) {
      setFeedback({ type: 'success', msg: `تم إرسال SMS بنجاح إلى المريض (${patientName}) عبر شريحة أندرويد!` });
    } else {
      setFeedback({ type: 'error', msg: 'تعذر الاتصال بجسر أندرويد. يرجى التأكد من تشغيل تطبيق الأندرويد المساعد.' });
    }
  };

  const handleWhatsappSubmit = () => {
    if (!patientName.trim() || !phone.trim()) {
      setFeedback({ type: 'error', msg: 'يرجى كتابة اسم المريض ورقم الهاتف قبل فتح واتساب' });
      return;
    }

    onSendWhatsApp({
      patientName,
      phone,
      fileNumber: fileNumber || `LAB-${Math.floor(1000 + Math.random() * 9000)}`,
      testType,
      customNotes,
      pdfFileName: selectedFile?.name,
      pdfFileSize: selectedFile?.size,
      channel: 'whatsapp',
    });

    setFeedback({ type: 'success', msg: `تم تجهيز وفتح رابط واتساب للمريض (${patientName})` });
  };

  const handleResetForm = () => {
    setPatientName('');
    setPhone('');
    setFileNumber('');
    setTestType('فحص الدم الشامل (CBC)');
    setCustomNotes('');
    setSelectedFile(null);
    setFeedback(null);
  };

  // Quick autofill sample patient
  const autofillSample = (sampleName: string, samplePhone: string, sampleTest: string, sampleFile: string) => {
    setPatientName(sampleName);
    setPhone(samplePhone);
    setFileNumber(`LAB-${Math.floor(1000 + Math.random() * 9000)}`);
    setTestType(sampleTest);
    setSelectedFile({ name: sampleFile, size: '450 KB' });
    setFeedback(null);
  };

  // Stats calculation
  const totalSent = notifications.filter(n => n.status === 'sent').length;
  const smsCount = notifications.filter(n => n.channel === 'sms' && n.status === 'sent').length;
  const whatsappCount = notifications.filter(n => n.channel === 'whatsapp' && n.status === 'sent').length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Dashboard Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 relative overflow-hidden group hover:border-teal-500/50 transition-all shadow-lg">
          <div className="absolute top-0 right-0 w-2 h-full bg-teal-500" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">إجمالي نتائج الفحوصات المرسلة اليوم</p>
              <h3 className="text-3xl font-extrabold text-white mt-1 font-mono">{totalSent}</h3>
              <p className="text-xs text-teal-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                تحديث لحظي مدمج
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 relative overflow-hidden group hover:border-sky-500/50 transition-all shadow-lg">
          <div className="absolute top-0 right-0 w-2 h-full bg-sky-500" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">رسائل SMS عبر شريحة Android</p>
              <h3 className="text-3xl font-extrabold text-white mt-1 font-mono">{smsCount}</h3>
              <p className="text-xs text-sky-400 mt-1 flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" />
                SIM Gate Bridge
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Send className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/50 transition-all shadow-lg">
          <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">إشعارات WhatsApp المجهزة</p>
              <h3 className="text-3xl font-extrabold text-white mt-1 font-mono">{whatsappCount}</h3>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                Direct WhatsApp Web
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/50 transition-all shadow-lg">
          <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">مجلد المراقبة التلقائي</p>
              <h3 className="text-sm font-bold text-amber-300 mt-1 font-mono tracking-tight">{settings.folderPath}</h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <FolderGit2 className="w-3.5 h-3.5 text-amber-400" />
                جاهز لاكتشاف ملفات PDF
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FolderGit2 className="w-6 h-6" />
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Send Form + Live Preview Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Send Result Form (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">نموذج إرسال نتيجة فحص مخبري</h2>
                <p className="text-xs text-slate-400">أدخل بيانات المريض واختر وسيلة الإرسال المطلوبة</p>
              </div>
            </div>

            {/* Quick Fill Samples */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[11px] text-slate-400">ملء سريع:</span>
              <button 
                onClick={() => autofillSample('أحمد_العمودي', '777123456', 'فحص الدم الشامل (CBC)', 'Ahmed_777123456.pdf')}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-teal-300 px-2.5 py-1 rounded-lg transition-colors border border-slate-600"
              >
                أحمد (Yemen Mobile)
              </button>
              <button 
                onClick={() => autofillSample('فاطمة_الزهراني', '0501234567', 'وظائف الكبد والكلى', 'Fatima_0501234567.pdf')}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-sky-300 px-2.5 py-1 rounded-lg transition-colors border border-slate-600"
              >
                فاطمة (050...)
              </button>
            </div>
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm animate-fadeIn ${
              feedback.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              <div className="flex items-center gap-2">
                {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
                <span>{feedback.msg}</span>
              </div>
              <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white text-xs font-bold">×</button>
            </div>
          )}

          <form onSubmit={handleSmsSubmit} className="space-y-4">
            
            {/* Patient Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-400" />
                  اسم المريض <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="مثال: أحمد محمد العمودي"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-sky-400" />
                  رقم الهاتف (SMS / WhatsApp) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="مثال: 777123456 أو 0501234567"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 dir-ltr text-right transition-all"
                />
              </div>
            </div>

            {/* File No & Test Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  رقم الملف / السجل الطبي
                </label>
                <input
                  type="text"
                  value={fileNumber}
                  onChange={(e) => setFileNumber(e.target.value)}
                  placeholder="مثال: LAB-2026-941"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                  نوع الفحص المخبري
                </label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white transition-all"
                >
                  {commonTests.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                رسالة أو ملاحظات مخصصة للمريض (اختياري)
              </label>
              <textarea
                rows={2}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="مثال: يرجى مراجعة طبيب الباطنية لمتابعة نتيجة السكر..."
                className="w-full bg-slate-900/90 border border-slate-700 focus:border-teal-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-all"
              />
            </div>

            {/* PDF File Picker Box */}
            <div className="bg-slate-900/60 border-2 border-dashed border-slate-700 hover:border-teal-500/50 rounded-2xl p-4 transition-all">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">ملف تقرير الفحص المرفق (PDF)</span>
                    <span className="text-sm font-semibold text-slate-200">
                      {selectedFile ? selectedFile.name : 'لم يتم اختيار ملف PDF حتى الآن'}
                    </span>
                    {selectedFile && <span className="text-xs text-slate-500 font-mono block">{selectedFile.size}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-600 px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors">
                    <Paperclip className="w-3.5 h-3.5" />
                    تصفح اختيار PDF
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile({ name: file.name, size: `${(file.size / 1024).toFixed(0)} KB` });
                        }
                      }}
                    />
                  </label>

                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => onOpenPdfModal(selectedFile.name, patientName || 'أحمد العمودي', testType)}
                      className="bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      معاينة التقرير
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="pt-3 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Send SMS Button */}
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className={`w-4 h-4 ${isSending ? 'animate-bounce' : ''}`} />
                  {isSending ? 'جاري الإرسال عبر أندرويد...' : 'إرسال SMS عبر الهاتف'}
                </button>

                {/* Open WhatsApp Button */}
                <button
                  type="button"
                  onClick={handleWhatsappSubmit}
                  className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  فتح WhatsApp
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {/* Preview Message Modal Trigger */}
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-sky-400" />
                  معاينة الرسالة
                </button>

                {/* Reset Form */}
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 p-2.5 rounded-xl transition-colors"
                  title="مسح البيانات"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

            </div>

          </form>

        </div>

        {/* Live Message Preview Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* SMS Template Card */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-400" />
                <span className="text-sm font-bold text-white">معاينة نص القالب (SMS)</span>
              </div>
              <span className="text-[11px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-md font-mono">
                SIM Gateway
              </span>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-sm text-slate-200 whitespace-pre-wrap font-sans leading-relaxed text-right relative">
              <div className="absolute top-2 left-2 text-[10px] text-slate-500 font-mono">
                {compileSmsMessage().length} حرف
              </div>
              {compileSmsMessage()}
            </div>
            
            <p className="text-[11px] text-slate-400">
              * سيتم إرسال هذا النص تلقائياً عبر شريحة هاتف الأندرويد المربوط بنفس شبكة WiFi المستشفى.
            </p>
          </div>

          {/* WhatsApp Template Card */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-white">معاينة نص القالب (WhatsApp)</span>
              </div>
              <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                Direct Web App
              </span>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-sm text-slate-200 whitespace-pre-wrap font-sans leading-relaxed text-right border-r-4 border-r-emerald-500">
              {compileWhatsappMessage()}
            </div>

            <p className="text-[11px] text-slate-400">
              * يفتح وتساب مباشرة مع تجهيز الرقم والنص المطلوب دون الحاجة لحفظ رقم المريض في الجهاز.
            </p>
          </div>

          {/* Android Bridge Connection Status Quick Box */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${bridgeStatus.isConnected ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
              <div>
                <span className="text-xs font-bold text-slate-200 block">جسر الأندرويد Companion</span>
                <span className="text-[11px] text-slate-400">{bridgeStatus.simCarrier} ({bridgeStatus.simPhoneNumber})</span>
              </div>
            </div>

            <div className="text-left font-mono text-xs text-teal-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              {bridgeStatus.bridgeIp}:{bridgeStatus.bridgePort}
            </div>
          </div>

        </div>

      </div>

      {/* Full Message Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-teal-400 font-bold">
                <Sparkles className="w-5 h-5" />
                <h3>معاينة إشعار نتيجة الفحص قبل الإرسال</h3>
              </div>
              <button onClick={() => setShowPreviewModal(false)} className="text-slate-400 hover:text-white text-lg">×</button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1">
                <p className="text-xs text-slate-400">اسم المريض: <span className="text-white font-bold">{patientName || 'أحمد العمودي'}</span></p>
                <p className="text-xs text-slate-400">رقم الهاتف: <span className="text-sky-300 font-mono">{phone || '777123456'}</span></p>
                <p className="text-xs text-slate-400">نوع الفحص: <span className="text-teal-300">{testType}</span></p>
                <p className="text-xs text-slate-400">الملف المرفق: <span className="text-amber-300 font-mono">{selectedFile?.name || 'بدون مرفق'}</span></p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">نص رسالة SMS:</label>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap">
                  {compileSmsMessage()}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">نص رسالة WhatsApp:</label>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-emerald-300 whitespace-pre-wrap">
                  {compileWhatsappMessage()}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-medium"
              >
                إغلاق المعاينة
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
