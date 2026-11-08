import React from 'react';
import {
  Menu,
  PanelLeft,
  Calendar,
  FileSpreadsheet,
  Download,
  Printer,
  Sparkles,
  Layers,
  Settings,
  BookOpen,
  CalendarCheck,
  Share2
} from 'lucide-react';
import { ActiveTab, SubjectDisplayMode } from '../types';
import { GRADE_PRESETS } from '../data/curricula';
import { toKhmerNum } from '../data/holidays';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedGradeKey: string;
  onGradeChange: (key: string) => void;
  academicYear: string;
  gradeLabel: string;
  subjectDisplayMode: SubjectDisplayMode;
  onSubjectDisplayModeChange: (mode: SubjectDisplayMode) => void;
  onCopyGoogleSheets: () => void;
  onDownloadExcel: () => void;
  onDownloadCSV: () => void;
  onPrint: () => void;
  onOpenAIModal: () => void;
  onShareApp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  activeTab,
  setActiveTab,
  selectedGradeKey,
  onGradeChange,
  academicYear,
  gradeLabel,
  subjectDisplayMode,
  onSubjectDisplayModeChange,
  onCopyGoogleSheets,
  onDownloadExcel,
  onDownloadCSV,
  onPrint,
  onOpenAIModal,
  onShareApp
}) => {
  return (
    <header className="bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900 text-white shadow-xl no-print border-b border-blue-800/60 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Top bar with Toggle Sidebar button, Branding and Quick Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 pb-2.5 border-b border-blue-800/40">
          <div className="flex items-center gap-3">
            {/* Toggle Sidebar Button */}
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-amber-300 border border-white/15 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              title={isSidebarOpen ? 'បិទ/បង្រួម Sidebar Menu' : 'បើក/ពង្រីក Sidebar Menu'}
            >
              <Menu className="w-5 h-5" />
              <span className="text-xs font-bold text-white hidden sm:inline">
                Menu
              </span>
            </button>

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-blue-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/30 font-moul text-sm">
              MoE
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30">
                  MoEYS Cambodia • ថ្នាក់ទី១ ដល់ ទី៦
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-700/60 text-blue-100 border border-blue-500/40">
                  ឆ្នាំ {toKhmerNum(academicYear)}
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-700/60 text-emerald-100 border border-emerald-500/40">
                  {gradeLabel}
                </span>
              </div>
              <h1 className="text-sm sm:text-lg font-bold mt-0.5 text-white tracking-wide font-moul truncate max-w-[280px] sm:max-w-none">
                កម្មវិធីបង្កើតបំណែងចែកកម្មវិធីសិក្សាស្វ័យប្រវត្តិ
              </h1>
            </div>
          </div>

          {/* Quick Actions Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={onCopyGoogleSheets}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-medium shadow-md shadow-emerald-900/30 transition cursor-pointer"
              title="ចម្លងតារាងសម្រាប់បិទភ្ជាប់ក្នុង Google Sheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">ចម្លងដាក់</span> Google Sheet
            </button>

            <button
              onClick={onDownloadExcel}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-medium shadow-md shadow-blue-950/40 transition cursor-pointer"
              title="ទាញយកជាឯកសារ Excel (.xls)"
            >
              <Download className="w-3.5 h-3.5 text-blue-200" />
              <span>Excel</span>
            </button>

            <button
              onClick={onPrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium shadow-md transition cursor-pointer"
              title="បោះពុម្ព ឬរក្សាទុកជា PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span>បោះពុម្ព</span>
            </button>

            <button
              onClick={onShareApp}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 text-xs font-bold shadow-md shadow-amber-950/20 transition cursor-pointer"
              title="ចម្លងតំណលីងចែករំលែក (Share Publish URL)"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-950" />
              <span>ចែករំលែក (Share)</span>
            </button>

            <button
              onClick={onOpenAIModal}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-900/40 transition cursor-pointer ring-1 ring-purple-400/40"
              title="បង្កើតកិច្ចតែងការបង្រៀន ឬលំហាត់សិស្សជាមួយ Gemini AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">AI កិច្ចតែងការ</span>
            </button>
          </div>
        </div>

        {/* Bottom bar: Navigation Tabs & Grade Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2">
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                activeTab === 'schedule'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>កាលវិភាគសិក្សា</span>
            </button>

            <button
              onClick={() => setActiveTab('lessons')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                activeTab === 'lessons'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>គ្រប់គ្រងមេរៀន</span>
            </button>

            <button
              onClick={() => setActiveTab('holidays')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                activeTab === 'holidays'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>ថ្ងៃឈប់បុណ្យជាតិ</span>
            </button>

            <button
              onClick={() => setActiveTab('export')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                activeTab === 'export'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>នាំចេញ</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                activeTab === 'settings'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>ការកំណត់</span>
            </button>
          </nav>

          {/* Grade Preset Quick Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-blue-200 hidden md:inline">ថ្នាក់៖</span>
            <div className="relative">
              <select
                value={selectedGradeKey}
                onChange={(e) => onGradeChange(e.target.value)}
                className="appearance-none bg-blue-900/90 border border-blue-600/70 text-white text-xs rounded-lg pl-3 pr-8 py-1.5 font-medium hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-inner"
              >
                {GRADE_PRESETS.map((g) => (
                  <option key={g.key} value={g.key} className="bg-slate-900 text-white">
                    {g.label}
                  </option>
                ))}
              </select>
              <Layers className="w-3.5 h-3.5 text-blue-300 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
