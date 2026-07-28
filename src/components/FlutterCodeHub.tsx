import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  Terminal, 
  FolderTree, 
  Sparkles, 
  Laptop, 
  Smartphone, 
  BookOpen, 
  ExternalLink,
  Layers,
  Cloud,
  Cpu,
  CheckCircle2
} from 'lucide-react';
import { flutterCodeFiles } from '../data/flutterCodebase';
import { FlutterCodeFile } from '../types';

export const FlutterCodeHub: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>('main.dart');
  const [copiedFileId, setCopiedFileId] = useState<string | null>(null);

  const activeFile = flutterCodeFiles.find(f => f.id === selectedFileId) || flutterCodeFiles[0];

  const handleCopyCode = (file: FlutterCodeFile) => {
    navigator.clipboard.writeText(file.code);
    setCopiedFileId(file.id);
    setTimeout(() => setCopiedFileId(null), 2000);
  };

  const handleDownloadFile = (file: FlutterCodeFile) => {
    const element = document.createElement('a');
    const blob = new Blob([file.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(blob);
    element.download = file.fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/10">
              <Code2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">مركز كود مشروع الفلوتر الكامل (EXE & APK)</h2>
                <span className="text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2.5 py-0.5 rounded-full font-medium">
                  Flutter Material 3 RTL
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                الكود المصدري الكامل والمقسّم لتطبيقي Windows Desktop و Android Companion جاهز للبناء المباشر
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyCode(activeFile)}
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-teal-600/20"
            >
              {copiedFileId === activeFile.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedFileId === activeFile.id ? 'تم النسخ!' : 'نسخ الكود الحالي'}</span>
            </button>

            <button
              onClick={() => handleDownloadFile(activeFile)}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4 text-sky-400" />
              تحميل الملف
            </button>
          </div>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar File Tree (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl space-y-4">
          
          <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
            <FolderTree className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">هيكل مشروع الفلوتر المصدري</h3>
          </div>

          <div className="space-y-1">
            {flutterCodeFiles.map((f) => {
              const isSelected = f.id === selectedFileId;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFileId(f.id)}
                  className={`w-full text-right p-3 rounded-xl transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-teal-600/20 border border-teal-500/40 text-teal-300 font-bold'
                      : 'hover:bg-slate-700/50 text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-teal-400' : 'text-slate-500'}`} />
                    <div className="truncate text-right">
                      <span className="block text-xs font-mono">{f.fileName}</span>
                      <span className="block text-[10px] text-slate-500 font-sans truncate">{f.path}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono shrink-0 ${
                    f.category === 'windows' ? 'bg-sky-500/10 text-sky-400' :
                    f.category === 'android' ? 'bg-emerald-500/10 text-emerald-400' :
                    f.category === 'shared' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {f.category}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Build Commands Box */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-3.5 space-y-2 text-xs">
            <span className="font-bold text-amber-300 block">⚡ أوامر البناء السريعة (Terminal):</span>
            
            <div className="space-y-1 font-mono text-[11px] dir-ltr text-left">
              <p className="text-slate-400"># Windows EXE Build:</p>
              <p className="text-sky-300 bg-slate-950 p-1.5 rounded border border-slate-800">flutter build windows --release</p>
              
              <p className="text-slate-400 pt-1"># Android APK Build:</p>
              <p className="text-emerald-300 bg-slate-950 p-1.5 rounded border border-slate-800">flutter build apk --release</p>
            </div>
          </div>

          {/* Codemagic Cloud Build Card */}
          <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-500/30 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-purple-300">البناء السحابي عبر Codemagic</span>
              </div>
              <span className="bg-purple-500/20 text-purple-300 text-[9px] px-1.5 py-0.5 rounded font-mono">CI/CD</span>
            </div>

            <p className="text-[11px] text-slate-300">
              يمكنك بناء ملفات <strong className="text-sky-300">EXE</strong> و <strong className="text-emerald-300">APK</strong> مجاناً بدون كمبيوتر قوي باستخدام ملف <code className="text-purple-300 bg-slate-950 px-1 py-0.5 rounded font-mono">codemagic.yaml</code> الجاهز.
            </p>

            <button
              onClick={() => setSelectedFileId('codemagic.yaml')}
              className="w-full bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 p-2 rounded-lg text-center font-bold transition-all flex items-center justify-center gap-1.5 text-[11px]"
            >
              <FileCode className="w-3.5 h-3.5 text-purple-300" />
              عرض وتنسيق ملف codemagic.yaml
            </button>
          </div>

        </div>

        {/* Right Code Viewer & Instructions (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs text-teal-400 font-mono font-bold">{activeFile.path}</span>
              <h3 className="text-base font-bold text-white mt-0.5">{activeFile.fileName}</h3>
              <p className="text-xs text-slate-400">{activeFile.description}</p>
            </div>

            <button
              onClick={() => handleCopyCode(activeFile)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
            >
              {copiedFileId === activeFile.id ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFileId === activeFile.id ? 'تم النسخ!' : 'نسخ الكود'}</span>
            </button>
          </div>

          {/* Syntax Highlighted Code Viewer */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto max-h-[500px] leading-relaxed dir-ltr text-left">
            <pre><code>{activeFile.code}</code></pre>
          </div>

        </div>

      </div>

    </div>
  );
};
