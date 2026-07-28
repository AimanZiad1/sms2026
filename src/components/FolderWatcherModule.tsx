import React, { useState } from 'react';
import { 
  FolderSearch, 
  FolderPlus, 
  FileText, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  UserCheck, 
  Sparkles, 
  Clock, 
  Search, 
  ArrowRight,
  UploadCloud,
  Eye
} from 'lucide-react';
import { WatchedFolderFile, AppSettings } from '../types';

interface FolderWatcherModuleProps {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  watchedFiles: WatchedFolderFile[];
  onSimulateNewPdfDrop: (fileName: string) => void;
  onDispatchFromWatcher: (file: WatchedFolderFile) => void;
  onOpenPdfModal: (fileName: string, patientName: string, testType: string) => void;
}

export const FolderWatcherModule: React.FC<FolderWatcherModuleProps> = ({
  settings,
  updateSettings,
  watchedFiles,
  onSimulateNewPdfDrop,
  onDispatchFromWatcher,
  onOpenPdfModal,
}) => {
  const [customFileNameInput, setCustomFileNameInput] = useState('');
  const [isWatching, setIsWatching] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Dropdown options for quick sample files
  const samplePdfGenerators = [
    { name: 'Ahmed_777123456.pdf', label: 'أحمد (777123456)' },
    { name: 'Khaled_770112233.pdf', label: 'خالد (770112233)' },
    { name: 'Fatima_0501234567.pdf', label: 'فاطمة (0501234567)' },
    { name: 'Sara_LAB2026_0559876543.pdf', label: 'سارة (0559876543)' },
  ];

  const handleSimulateDrop = (fileName: string) => {
    if (!fileName) return;
    onSimulateNewPdfDrop(fileName);
    setCustomFileNameInput('');
  };

  const filteredFiles = watchedFiles.filter(f => 
    f.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.extractedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.extractedPhone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* Folder Header Banner */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <FolderSearch className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">مراقبة مجلد نتائج الفحوصات التلقائي</h2>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  isWatching ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700 text-slate-400'
                }`}>
                  {isWatching ? 'نشط ومستعد للاكتشاف' : 'المراقبة متوقفة'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                مسار المجلد المحدد: <span className="font-mono text-amber-300 font-semibold">{settings.folderPath}</span>
              </p>
            </div>
          </div>

          {/* Toggle Watching Switch */}
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700 rounded-xl p-2 px-4">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-300">خدمة الفحص التلقائي (File Watcher)</span>
              <span className="text-[10px] text-slate-500">يقوم باكتشاف إضافة ملفات PDF جديدة فوراً</span>
            </div>
            <button
              onClick={() => setIsWatching(!isWatching)}
              className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                isWatching
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {isWatching ? (
                <>
                  <Pause className="w-4 h-4" />
                  إيقاف مؤقت
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  تشغيل المراقبة
                </>
              )}
            </button>
          </div>
        </div>

        {/* How it works info strip */}
        <div className="mt-6 pt-4 border-t border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-amber-400 font-mono font-bold text-[11px]">1</div>
            <span>إضافة تقرير PDF إلى المجلد <code className="text-amber-300 font-mono">C:\LabResults</code></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-sky-400 font-mono font-bold text-[11px]">2</div>
            <span>استخراج الاسم ورقم الهاتف تلقائياً من اسم الملف</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-teal-400 font-mono font-bold text-[11px]">3</div>
            <span>تجهيز وإرسال الإشعار بنقرة واحدة عبر SMS أو WhatsApp</span>
          </div>
        </div>
      </div>

      {/* File Drop & Simulation Bar */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-amber-400" />
            محاكاة إضافة ملف PDF جديد للمجلد (C:\LabResults)
          </h3>
          <span className="text-xs text-slate-400">صيغة الملف: <code className="text-teal-300 font-mono">اسم المريض_رقم الهاتف.pdf</code></span>
        </div>

        {/* Quick Drop Preset Buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          {samplePdfGenerators.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSimulateDrop(sample.name)}
              className="bg-slate-900/80 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-500/50 px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all group"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>إضافة: <strong className="text-amber-300 font-mono">{sample.name}</strong></span>
            </button>
          ))}
        </div>

        {/* Custom Filename Input Drop */}
        <div className="flex gap-2 pt-2">
          <input
            type="text"
            value={customFileNameInput}
            onChange={(e) => setCustomFileNameInput(e.target.value)}
            placeholder="أدخل اسم ملف مخصص مثل: Mohammed_0509876543.pdf"
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 dir-ltr text-right"
          />
          <button
            onClick={() => handleSimulateDrop(customFileNameInput)}
            disabled={!customFileNameInput.trim()}
            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-600/20"
          >
            <FolderPlus className="w-4 h-4" />
            إسقاط الملف في C:\LabResults
          </button>
        </div>
      </div>

      {/* Watched Files List Table */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-400" />
              الملفات المكتشفة تلقائياً في مجلد C:\LabResults
            </h3>
            <p className="text-xs text-slate-400">قائمة تقارير الفحوصات الجاهزة للإرسال</p>
          </div>

          {/* Search filter */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث باسم الملف أو المريض..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:border-teal-500"
            />
          </div>
        </div>

        {/* Files Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs text-slate-400 uppercase border-b border-slate-800 font-medium">
              <tr>
                <th className="px-4 py-3">اسم الملف (PDF)</th>
                <th className="px-4 py-3">اسم المريض المستخرج</th>
                <th className="px-4 py-3">رقم الهاتف المستخرج</th>
                <th className="px-4 py-3">وقت الاكتشاف</th>
                <th className="px-4 py-3">الحالة</th>
                <th className="px-4 py-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500 text-xs">
                    لا توجد ملفات مكتشفة في المجلد حتى الآن
                  </td>
                </tr>
              ) : (
                filteredFiles.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-800/50 transition-colors">
                    
                    {/* File Name */}
                    <td className="px-4 py-3 font-mono text-xs text-amber-300 font-semibold flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                      {f.fileName}
                    </td>

                    {/* Extracted Name */}
                    <td className="px-4 py-3 font-medium text-white">
                      {f.extractedName}
                    </td>

                    {/* Extracted Phone */}
                    <td className="px-4 py-3 font-mono text-sky-300 dir-ltr text-right">
                      {f.extractedPhone || 'غير مستخرج'}
                    </td>

                    {/* Timestamp */}
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">
                      {f.detectedAt}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {f.processed ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          تم الإرسال
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-medium animate-pulse">
                          <Clock className="w-3.5 h-3.5" />
                          جديد بانتظار الإرسال
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        
                        <button
                          onClick={() => onDispatchFromWatcher(f)}
                          className="bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          تعبئة وإرسال
                        </button>

                        <button
                          onClick={() => onOpenPdfModal(f.fileName, f.extractedName, 'فحص مخبري أوتوماتيكي')}
                          className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-2.5 py-1.5 rounded-xl text-xs transition-colors"
                          title="معاينة تقرير PDF"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
