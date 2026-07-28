import React from 'react';
import { 
  LayoutDashboard, 
  FolderSearch, 
  Smartphone, 
  History, 
  Settings, 
  Code2, 
  Activity, 
  Wifi, 
  WifiOff, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun,
  ShieldCheck
} from 'lucide-react';
import { BridgeStatus, AppSettings } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  bridgeStatus: BridgeStatus;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  unsentCount: number;
  detectedFilesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  bridgeStatus,
  settings,
  updateSettings,
  unsentCount,
  detectedFilesCount,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'الرئيسية والإرسال',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'folder',
      label: 'مراقبة المجلد C:\\LabResults',
      icon: FolderSearch,
      badge: detectedFilesCount > 0 ? detectedFilesCount : null,
      badgeColor: 'bg-amber-500',
    },
    {
      id: 'android',
      label: 'جسر أندرويد Companion',
      icon: Smartphone,
      badge: bridgeStatus.isConnected ? 'متصل' : 'غير متصل',
      badgeColor: bridgeStatus.isConnected ? 'bg-emerald-500' : 'bg-rose-500',
    },
    {
      id: 'logs',
      label: 'سجل العمليات',
      icon: History,
      badge: unsentCount > 0 ? `${unsentCount} معلق` : null,
      badgeColor: 'bg-sky-500',
    },
    {
      id: 'settings',
      label: 'الإعدادات والقوالب',
      icon: Settings,
      badge: null,
    },
    {
      id: 'flutter_code',
      label: 'مشروع الفلوتر (Code Hub)',
      icon: Code2,
      badge: 'EXE + APK',
      badgeColor: 'bg-teal-500',
    },
  ];

  return (
    <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-40">
      {/* Top Branding Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Hospital Branding */}
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-600 via-sky-600 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 ring-1 ring-white/20">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 via-sky-300 to-white bg-clip-text text-transparent">
                {settings.hospitalName}
              </h1>
              <span className="text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Lab Messenger v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">
              نظام إدارة وترحيل نتائج فحوصات المختبر لسطح المكتب والأندرويد
            </p>
          </div>
        </div>

        {/* Live Bridge & System Status Indicators */}
        <div className="flex items-center space-x-3 space-x-reverse">
          
          {/* Bridge Status Indicator */}
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            {bridgeStatus.isConnected ? (
              <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
            ) : (
              <WifiOff className="w-4 h-4 text-rose-400" />
            )}
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-400 leading-none">جسر أندرويد اللاسلكي</span>
              <span className="font-mono font-medium text-slate-200">
                {bridgeStatus.bridgeIp}:{bridgeStatus.bridgePort}
              </span>
            </div>
            <span className={`w-2 h-2 rounded-full ${bridgeStatus.isConnected ? 'bg-emerald-400 ring-4 ring-emerald-500/20' : 'bg-rose-500'}`} />
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => updateSettings({ soundEffects: !settings.soundEffects })}
            className={`p-2 rounded-xl border transition-all ${
              settings.soundEffects
                ? 'bg-slate-800 border-slate-700 text-teal-400 hover:bg-slate-700'
                : 'bg-slate-800/50 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={settings.soundEffects ? 'مؤثرات الصوت مفعلة' : 'مؤثرات الصوت معطلة'}
          >
            {settings.soundEffects ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => updateSettings({ darkMode: !settings.darkMode })}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
            title="تبديل المظهر"
          >
            {settings.darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <nav className="flex space-x-1 space-x-reverse overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-600 to-sky-600 text-white shadow-lg shadow-teal-600/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[11px] text-white px-2 py-0.5 rounded-full font-sans ${item.badgeColor || 'bg-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
