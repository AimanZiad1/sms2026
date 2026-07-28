import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Building2, 
  MessageSquare, 
  Send, 
  FolderSearch, 
  Wifi, 
  Volume2, 
  CheckCircle2, 
  Info,
  Sparkles
} from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  onResetToDefault: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onResetToDefault,
}) => {
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const insertTokenIntoSms = (token: string) => {
    setFormData(prev => ({
      ...prev,
      smsTemplate: prev.smsTemplate + ` ${token}`,
    }));
  };

  const insertTokenIntoWhatsapp = (token: string) => {
    setFormData(prev => ({
      ...prev,
      whatsappTemplate: prev.whatsappTemplate + ` ${token}`,
    }));
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">إعدادات النظام وتخصيص قوالب الرسائل</h2>
            <p className="text-xs text-slate-400">تخصيص اسم المستشفى، مسار مجلد المراقبة، إعدادات الشبكة المحلية وقوالب الـ SMS والواتساب</p>
          </div>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            تم حفظ الإعدادات بنجاح في التخزين المحلي!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Hospital & Lab Info Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-700 pb-3">
            <Building2 className="w-5 h-5 text-teal-400" />
            بيانات المستشفى والمختبر
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                اسم المستشفى العربي
              </label>
              <input
                type="text"
                value={formData.hospitalName}
                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                نص الشعار الإنجليزي (English Subtitle)
              </label>
              <input
                type="text"
                value={formData.hospitalLogoText}
                onChange={(e) => setFormData({ ...formData, hospitalLogoText: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-teal-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Network Bridge & Folder Settings */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-700 pb-3">
            <Wifi className="w-5 h-5 text-sky-400" />
            إعدادات المجلد والشبكة المحلية (Local Bridge)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1">
                <FolderSearch className="w-3.5 h-3.5 text-amber-400" />
                مسار مجلد مراقبة الـ PDF
              </label>
              <input
                type="text"
                value={formData.folderPath}
                onChange={(e) => setFormData({ ...formData, folderPath: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-amber-300 font-mono focus:border-amber-500 dir-ltr text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                عنوان IP هاتف أندرويد (Bridge IP)
              </label>
              <input
                type="text"
                value={formData.bridgeIp}
                onChange={(e) => setFormData({ ...formData, bridgeIp: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-sky-300 font-mono focus:border-sky-500 dir-ltr text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                مأخذ خادم الشبكة (Port)
              </label>
              <input
                type="number"
                value={formData.bridgePort}
                onChange={(e) => setFormData({ ...formData, bridgePort: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Templates Customization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* SMS Template Editor */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-400" />
                قالب رسالة SMS النصية
              </h3>

              {/* Tag Insert Chips */}
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => insertTokenIntoSms('{اسم المريض}')}
                  className="bg-slate-700 hover:bg-slate-600 text-sky-300 text-[11px] px-2 py-0.5 rounded-md"
                >
                  +{`{اسم المريض}`}
                </button>
                <button
                  type="button"
                  onClick={() => insertTokenIntoSms('{نوع الفحص}')}
                  className="bg-slate-700 hover:bg-slate-600 text-teal-300 text-[11px] px-2 py-0.5 rounded-md"
                >
                  +{`{نوع الفحص}`}
                </button>
              </div>
            </div>

            <textarea
              rows={6}
              value={formData.smsTemplate}
              onChange={(e) => setFormData({ ...formData, smsTemplate: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 rounded-xl p-3.5 text-sm text-white leading-relaxed font-sans"
            />
          </div>

          {/* WhatsApp Template Editor */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                قالب رسالة WhatsApp
              </h3>

              {/* Tag Insert Chips */}
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => insertTokenIntoWhatsapp('{اسم المريض}')}
                  className="bg-slate-700 hover:bg-slate-600 text-emerald-300 text-[11px] px-2 py-0.5 rounded-md"
                >
                  +{`{اسم المريض}`}
                </button>
                <button
                  type="button"
                  onClick={() => insertTokenIntoWhatsapp('{نوع الفحص}')}
                  className="bg-slate-700 hover:bg-slate-600 text-teal-300 text-[11px] px-2 py-0.5 rounded-md"
                >
                  +{`{نوع الفحص}`}
                </button>
              </div>
            </div>

            <textarea
              rows={6}
              value={formData.whatsappTemplate}
              onChange={(e) => setFormData({ ...formData, whatsappTemplate: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl p-3.5 text-sm text-white leading-relaxed font-sans"
            />
          </div>

        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
          <button
            type="button"
            onClick={onResetToDefault}
            className="text-xs text-rose-400 hover:text-rose-300 bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            استعادة الإعدادات الافتراضية
          </button>

          <button
            type="submit"
            className="bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-lg shadow-teal-600/20 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            حفظ التغييرات
          </button>
        </div>

      </form>

    </div>
  );
};
