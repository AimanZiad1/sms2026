import React, { useState } from 'react';
import { 
  Smartphone, 
  Wifi, 
  Signal, 
  BatteryMedium, 
  Power, 
  CheckCircle2, 
  ShieldCheck, 
  Send, 
  Terminal, 
  RotateCcw, 
  Activity, 
  MessageSquare,
  Sparkles,
  Server,
  Play
} from 'lucide-react';
import { BridgeStatus, BridgeLog } from '../types';

interface AndroidBridgeSimulatorProps {
  bridgeStatus: BridgeStatus;
  bridgeLogs: BridgeLog[];
  onToggleService: () => void;
  onSendTestSmsFromPhone: (phone: string, msg: string) => void;
  onClearLogs: () => void;
}

export const AndroidBridgeSimulator: React.FC<AndroidBridgeSimulatorProps> = ({
  bridgeStatus,
  bridgeLogs,
  onToggleService,
  onSendTestSmsFromPhone,
  onClearLogs,
}) => {
  const [testPhoneInput, setTestPhoneInput] = useState('777123456');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner Overview */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/10">
              <Smartphone className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">تطبيق الأندرويد المساعد (Android Companion Bridge)</h2>
                <span className="text-xs bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-0.5 rounded-full font-medium">
                  SIM SMS Gateway
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                يعمل كخادم HTTP محلي داخل هاتف أندرويد لاستقبال أوامر الإرسال من حاسوب Windows وتحويلها إلى رسائل SMS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleService}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
                bridgeStatus.isServiceRunning
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
              }`}
            >
              <Power className="w-4 h-4" />
              {bridgeStatus.isServiceRunning ? 'خدمة الجسر اللاسلكي شغال' : 'إعادة تشغيل الخدمة'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Phone UI Frame + Real-time Terminal Server Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Simulated Android Device Frame (5 Cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm bg-slate-950 border-4 border-slate-800 rounded-[2.5rem] p-4 shadow-2xl space-y-4 relative overflow-hidden">
            
            {/* Phone Speaker & Camera Notch */}
            <div className="w-32 h-4 bg-slate-900 mx-auto rounded-b-xl flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-800" />
            </div>

            {/* Android Status Bar */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 font-mono">
              <span>12:45 PM</span>
              <div className="flex items-center gap-2">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <Signal className="w-3.5 h-3.5 text-sky-400" />
                <BatteryMedium className="w-3.5 h-3.5 text-slate-300" />
              </div>
            </div>

            {/* App Header inside Phone */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-tr from-sky-500 to-teal-500 text-white flex items-center justify-center shadow-md">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Yaman Lab Companion</h3>
              <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] text-teal-400 font-mono">http://{bridgeStatus.bridgeIp}:{bridgeStatus.bridgePort}</span>
                <span className="text-[9px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded font-mono">ws://</span>
              </div>
            </div>

            {/* Android Foreground Service Active Banner */}
            <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-3 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="font-bold text-emerald-300 text-[11px]">Android Foreground Service</span>
                </div>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-full">Background</span>
              </div>
              <p className="text-[10px] text-slate-400">
                يعمل تطبيق الأندرويد في الخلفية بدون انقطاع لتأمين استقبال طلبات SMS عبر WebSocket و HTTP
              </p>
            </div>

            {/* Service Toggle Switch in App */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-3 h-3 rounded-full ${bridgeStatus.isServiceRunning ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                <div>
                  <span className="text-xs font-bold text-slate-200 block">حالة الخدمة</span>
                  <span className="text-[10px] text-slate-400">{bridgeStatus.isServiceRunning ? 'جاهزة للاستقبال عبر WiFi' : 'متوقفة'}</span>
                </div>
              </div>

              <button
                onClick={onToggleService}
                className={`p-2 rounded-xl text-xs font-bold ${
                  bridgeStatus.isServiceRunning ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {bridgeStatus.isServiceRunning ? 'مفعلة' : 'إيقاف'}
              </button>
            </div>

            {/* SIM Card & Network Details Box */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>شريحة الهاتف:</span>
                <span className="text-slate-200 font-semibold">{bridgeStatus.simCarrier}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>رقم SIM المستخدم:</span>
                <span className="text-sky-300 font-mono font-bold">{bridgeStatus.simPhoneNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>إجمالي SMS المرسلة:</span>
                <span className="text-teal-400 font-mono font-bold">{bridgeStatus.totalSentCount} رسالة</span>
              </div>
            </div>

            {/* Permissions Checklist (Prompt Requirements) */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-2">
              <span className="text-xs font-bold text-slate-300 block mb-1">صلاحيات النظام المطلوبة:</span>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">SEND_SMS (إرسال الرسائل)</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3 h-3" /> ممنوحة
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">READ_PHONE_STATE (قراءة الشريحة)</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3 h-3" /> ممنوحة
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">INTERNET (شبكة WiFi المحلية)</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3 h-3" /> ممنوحة
                </span>
              </div>
            </div>

            {/* Test SMS Dispatch Button */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 space-y-2">
              <span className="text-[11px] text-slate-400 block font-medium">تجربة إرسال SMS مباشرة من الهاتف:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testPhoneInput}
                  onChange={(e) => setTestPhoneInput(e.target.value)}
                  placeholder="رقم الهاتف..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white dir-ltr text-right"
                />
                <button
                  onClick={() => onSendTestSmsFromPhone(testPhoneInput, 'تجربة إرسال SMS من تطبيق أندرويد المساعد لمستشفى يمان فيوتشر')}
                  className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  تجربة
                </button>
              </div>
            </div>

            {/* Bottom Home Indicator */}
            <div className="w-24 h-1 bg-slate-800 mx-auto rounded-full pt-1" />

          </div>
        </div>

        {/* Right Column: Live Terminal Server Console Logs (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-teal-400" />
              <h3 className="text-base font-bold text-white">سجل خادم الجسر اللاسلكي (WiFi Bridge Terminal Logs)</h3>
            </div>

            <button
              onClick={onClearLogs}
              className="text-xs text-slate-400 hover:text-slate-200 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              مسح السجل
            </button>
          </div>

          {/* Scrolling Terminal Output */}
          <div className="flex-1 bg-black rounded-xl p-4 border border-slate-800 font-mono text-xs overflow-y-auto max-h-[480px] space-y-2">
            {bridgeLogs.length === 0 ? (
              <div className="text-slate-600 text-center py-12">
                [SYSTEM READY] - بانتظار استقبال الأوامر والطلبات من تطبيق Windows عبر الشبكة...
              </div>
            ) : (
              bridgeLogs.map((log) => (
                <div key={log.id} className="space-y-0.5 border-b border-slate-900 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-bold">[{log.timestamp}]</span>
                    {log.type === 'connect' && <span className="text-sky-400 font-bold">[CONNECT]</span>}
                    {log.type === 'request' && <span className="text-amber-400 font-bold">[HTTP POST]</span>}
                    {log.type === 'sms' && <span className="text-emerald-400 font-bold">[SIM SMS]</span>}
                    {log.type === 'error' && <span className="text-rose-400 font-bold">[ERROR]</span>}
                    <span className="text-slate-200 font-medium">{log.message}</span>
                  </div>
                  {log.details && (
                    <p className="text-[11px] text-slate-500 pl-4">{log.details}</p>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Network Connection Guide */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 text-xs text-slate-300 space-y-1">
            <span className="font-bold text-teal-400 block">💡 كيف تعمل تقنية الجسر اللاسلكي بين الجهازين؟</span>
            <p className="text-slate-400">
              يقوم تطبيق الأندرويد بفتح خادم محلي على المأخذ <code className="text-sky-300 font-mono">8080</code> داخل شبكة الـ WiFi للمستشفى. يقوم برنامج Windows بإرسال طلبات HTTP JSON تحتوي رقم الهاتف والرسالة، ويقوم الأندرويد بتحويلها فوراً إلى شريحة الهاتف لإرسالها كرسالة SMS حقيقية.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
