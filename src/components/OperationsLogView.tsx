import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Trash2, 
  RotateCcw,
  FileText,
  Eye,
  Check
} from 'lucide-react';
import { PatientResultNotification } from '../types';

interface OperationsLogViewProps {
  notifications: PatientResultNotification[];
  onResendNotification: (notif: PatientResultNotification) => void;
  onClearHistory: () => void;
  onDeleteNotification: (id: string) => void;
  onOpenPdfModal: (fileName: string, patientName: string, testType: string) => void;
}

export const OperationsLogView: React.FC<OperationsLogViewProps> = ({
  notifications,
  onResendNotification,
  onClearHistory,
  onDeleteNotification,
  onOpenPdfModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChannel, setFilterChannel] = useState<'all' | 'sms' | 'whatsapp'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'sent' | 'pending' | 'failed'>('all');

  const filtered = notifications.filter(n => {
    const matchesSearch = 
      n.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.phone.includes(searchTerm) ||
      n.fileNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.testType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesChannel = filterChannel === 'all' || n.channel === filterChannel;
    const matchesStatus = filterStatus === 'all' || n.status === filterStatus;

    return matchesSearch && matchesChannel && matchesStatus;
  });

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'اسم المريض', 'رقم الهاتف', 'رقم الملف', 'نوع الفحص', 'قناة الإرسال', 'حالة الإرسال', 'تاريخ الإرسال'];
    const rows = filtered.map(n => [
      n.id,
      `"${n.patientName}"`,
      `"${n.phone}"`,
      `"${n.fileNumber}"`,
      `"${n.testType}"`,
      n.channel === 'sms' ? 'SMS SIM' : 'WhatsApp',
      n.status === 'sent' ? 'نجاح' : n.status === 'pending' ? 'قيد الإرسال' : 'فشل',
      `"${n.sentAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Yaman_Lab_Operations_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Report
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">سجل عمليات إرسال النتائج للمرضى</h2>
            <p className="text-xs text-slate-400">تتبع جميع عمليات الإرسال عبر SMS و WhatsApp مع حالة النجاح والفشل</p>
          </div>
        </div>

        {/* Export & Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-teal-400" />
            تصدير CSV
          </button>

          <button
            onClick={handlePrint}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            طباعة تقرير
          </button>

          <button
            onClick={onClearHistory}
            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            مسح السجل
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث باسم المريض، رقم الهاتف، نوع الفحص..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:border-teal-500"
          />
        </div>

        {/* Channel Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">وسيلة الإرسال:</span>
          <select
            value={filterChannel}
            onChange={(e) => setFilterChannel(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-3 py-2"
          >
            <option value="all">الكل (SMS + WhatsApp)</option>
            <option value="sms">SMS عبر الهاتف</option>
            <option value="whatsapp">WhatsApp مباشر</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">حالة الإرسال:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-3 py-2"
          >
            <option value="all">جميع الحالات</option>
            <option value="sent">نجاح الإرسال</option>
            <option value="pending">قيد الإرسال</option>
            <option value="failed">فشل الإرسال</option>
          </select>
        </div>

      </div>

      {/* Operations Log Table */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs text-slate-400 uppercase border-b border-slate-800 font-medium">
              <tr>
                <th className="px-4 py-3">معرف السجل</th>
                <th className="px-4 py-3">اسم المريض</th>
                <th className="px-4 py-3">رقم الهاتف</th>
                <th className="px-4 py-3">رقم الملف / نوع الفحص</th>
                <th className="px-4 py-3">وسيلة الإرسال</th>
                <th className="px-4 py-3">وقت الإرسال</th>
                <th className="px-4 py-3">حالة الإرسال</th>
                <th className="px-4 py-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500 text-xs">
                    لا توجد سجلات مطابقة للبحث أو التصفية
                  </td>
                </tr>
              ) : (
                filtered.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-800/50 transition-colors">
                    
                    {/* ID */}
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">
                      {n.id}
                    </td>

                    {/* Patient Name */}
                    <td className="px-4 py-3 font-bold text-white">
                      {n.patientName}
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3 font-mono text-sky-300 dir-ltr text-right">
                      {n.phone}
                    </td>

                    {/* File & Test */}
                    <td className="px-4 py-3">
                      <span className="block font-mono text-xs text-amber-300">{n.fileNumber}</span>
                      <span className="text-xs text-slate-400">{n.testType}</span>
                    </td>

                    {/* Channel */}
                    <td className="px-4 py-3">
                      {n.channel === 'sms' ? (
                        <span className="inline-flex items-center gap-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-1 rounded-full text-xs">
                          <Send className="w-3 h-3" /> SMS SIM
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs">
                          <MessageSquare className="w-3 h-3" /> WhatsApp
                        </span>
                      )}
                    </td>

                    {/* Sent At */}
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">
                      {n.sentAt}
                    </td>

                    {/* Status (Prompt Requirement: نجاح أو فشل) */}
                    <td className="px-4 py-3">
                      {n.status === 'sent' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> ناجح
                        </span>
                      )}
                      {n.status === 'failed' && (
                        <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                          <XCircle className="w-3.5 h-3.5" /> فشل الإرسال
                        </span>
                      )}
                      {n.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-bold animate-pulse">
                          <Clock className="w-3.5 h-3.5" /> قيد الإرسال
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* Resend button */}
                        <button
                          onClick={() => onResendNotification(n)}
                          className="bg-slate-700 hover:bg-slate-600 text-teal-300 p-1.5 rounded-lg transition-colors"
                          title="إعادة الإرسال"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        {/* PDF View */}
                        {n.pdfFileName && (
                          <button
                            onClick={() => onOpenPdfModal(n.pdfFileName!, n.patientName, n.testType)}
                            className="bg-slate-700 hover:bg-slate-600 text-sky-300 p-1.5 rounded-lg transition-colors"
                            title="معاينة PDF"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => onDeleteNotification(n.id)}
                          className="bg-slate-700 hover:bg-slate-600 text-rose-400 p-1.5 rounded-lg transition-colors"
                          title="حذف السجل"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
