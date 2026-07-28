import React from 'react';
import { FileText, X, Printer, Download, Activity, CheckCircle2, ShieldCheck, Building2 } from 'lucide-react';

interface PdfPreviewModalProps {
  fileName: string;
  patientName: string;
  testType: string;
  onClose: () => void;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  fileName,
  patientName,
  testType,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-scaleUp">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">معاينة تقرير النتيجة المخبرية (PDF Report)</h3>
              <p className="text-xs text-slate-400 font-mono">{fileName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5 text-teal-400" />
              طباعة
            </button>
            
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Simulated PDF Document Page */}
        <div className="bg-white text-slate-900 p-8 rounded-xl shadow-inner space-y-6 font-sans">
          
          {/* Hospital Letterhead */}
          <div className="flex items-center justify-between border-b-2 border-teal-700 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold text-xl">
                Y
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-teal-900">مستشفى يمان فيوتشر</h2>
                <p className="text-xs text-teal-700 font-medium">قسم المختبرات والتشخيص الطبي المتقدم</p>
              </div>
            </div>

            <div className="text-left dir-ltr text-xs text-slate-500">
              <p className="font-bold text-slate-800">YAMAN FUTURE HOSPITAL</p>
              <p>Central Clinical Laboratory</p>
              <p>Ref: LAB-2026-9921</p>
            </div>
          </div>

          {/* Patient Details Table */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-500">اسم المريض (Patient Name):</p>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{patientName}</p>
            </div>
            <div>
              <p className="text-slate-500">نوع الفحص (Test Requested):</p>
              <p className="font-bold text-teal-800 text-sm mt-0.5">{testType}</p>
            </div>
            <div>
              <p className="text-slate-500">تاريخ وساعة الفحص:</p>
              <p className="font-semibold text-slate-800 dir-ltr text-right">2026-07-28 11:30 AM</p>
            </div>
            <div>
              <p className="text-slate-500">حالة التقرير:</p>
              <p className="font-bold text-emerald-700">معتمد وقابل للتسليم (FINAL RELEASED)</p>
            </div>
          </div>

          {/* Test Parameters Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-teal-900 border-b border-teal-200 pb-1">نتائج الفحوصات المخبرية التفصيلية:</h4>
            
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <th className="p-2">اسم التحليل (Parameter)</th>
                  <th className="p-2">النتيجة (Result)</th>
                  <th className="p-2">الوحدة (Unit)</th>
                  <th className="p-2">المعدل الطبيعي (Reference Range)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2 font-medium">Hemoglobin (Hb)</td>
                  <td className="p-2 font-bold text-emerald-700">14.2</td>
                  <td className="p-2 font-mono">g/dL</td>
                  <td className="p-2 text-slate-500">13.0 - 17.5</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">WBC Count</td>
                  <td className="p-2 font-bold text-emerald-700">6.8</td>
                  <td className="p-2 font-mono">x10^3 / µL</td>
                  <td className="p-2 text-slate-500">4.5 - 11.0</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Platelet Count</td>
                  <td className="p-2 font-bold text-emerald-700">250</td>
                  <td className="p-2 font-mono">x10^3 / µL</td>
                  <td className="p-2 text-slate-500">150 - 450</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Fasting Blood Sugar</td>
                  <td className="p-2 font-bold text-emerald-700">92</td>
                  <td className="p-2 font-mono">mg/dL</td>
                  <td className="p-2 text-slate-500">70 - 99</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Hospital Stamp & Signature */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              <p className="font-bold text-slate-800">توقيع أخصائي المختبر والمعاينة:</p>
              <p className="italic text-teal-800">د. عبدالكريم اليماني - رئيس قسم المختبرات</p>
            </div>

            <div className="border-2 border-teal-700/30 text-teal-800 px-3 py-1.5 rounded-lg text-center font-bold text-[10px]">
              ختم مستشفى يمان فيوتشر<br/>
              OFFICIAL LAB STAMP
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2 rounded-xl text-xs font-medium"
          >
            إغلاق التقرير
          </button>
        </div>

      </div>
    </div>
  );
};
