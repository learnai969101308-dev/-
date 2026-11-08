import React, { useState } from 'react';
import {
  Calendar,
  BookOpen,
  CalendarCheck,
  Share2,
  Settings,
  Sparkles,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  FileSpreadsheet,
  Download,
  Printer,
  Code2,
  Layers,
  School,
  PlusCircle,
  RotateCcw,
  PanelLeftClose,
  PanelLeft,
  X,
  FileText,
  BookmarkCheck,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { ActiveTab, SubjectDisplayMode, SubjectKey } from '../types';
import { GRADE_PRESETS } from '../data/curricula';
import { toKhmerNum } from '../data/holidays';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedGradeKey: string;
  onGradeChange: (key: string) => void;
  subjectDisplayMode: SubjectDisplayMode;
  onSubjectDisplayModeChange: (mode: SubjectDisplayMode) => void;
  academicYear: string;
  gradeLabel: string;
  onCopyGoogleSheets: () => void;
  onDownloadExcel: () => void;
  onDownloadCSV: () => void;
  onPrint: () => void;
  onOpenAIModal: () => void;
  onShareApp: () => void;
  onSelectLessonSubject?: (subj: SubjectKey) => void;
  onOpenBulkImport?: () => void;
  onResetLessons?: () => void;
  onResetHolidays?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  activeTab,
  setActiveTab,
  selectedGradeKey,
  onGradeChange,
  subjectDisplayMode,
  onSubjectDisplayModeChange,
  academicYear,
  gradeLabel,
  onCopyGoogleSheets,
  onDownloadExcel,
  onDownloadCSV,
  onPrint,
  onOpenAIModal,
  onShareApp,
  onSelectLessonSubject,
  onOpenBulkImport,
  onResetLessons,
  onResetHolidays
}) => {
  // Accordion state for Submenus
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    schedule: true,
    lessons: false,
    grades: false,
    holidays: false,
    export: false,
    settings: false,
    ai: false
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 text-slate-100 border-r border-slate-800 transition-all duration-300 ease-in-out no-print ${
          isOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-moul font-bold shrink-0 shadow-md shadow-amber-500/20 ring-2 ring-amber-400/30 text-sm">
              MoE
            </div>
            {isOpen && (
              <div className="min-w-0 transition-opacity duration-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300 truncate">
                  MoEYS Cambodia
                </div>
                <div className="font-moul text-xs text-white truncate">
                  កម្មវិធីសិក្សាស្វ័យប្រវត្តិ
                </div>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title={isOpen ? 'បង្រួម Menu (Collapse)' : 'ពង្រីក Menu (Expand)'}
          >
            {isOpen ? (
              <PanelLeftClose className="w-5 h-5" />
            ) : (
              <PanelLeft className="w-5 h-5 hidden lg:block" />
            )}
          </button>
        </div>

        {/* Current Grade Badge (when expanded) */}
        {isOpen && (
          <div className="p-3 bg-slate-800/50 border-b border-slate-800/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-semibold text-emerald-300 truncate">
                {gradeLabel}
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 px-2 py-0.5 rounded bg-slate-800">
              ឆ្នាំ {toKhmerNum(academicYear)}
            </span>
          </div>
        )}

        {/* Sidebar Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
          {/* MENU 1: Schedule & Submenus */}
          <div>
            <button
              onClick={() => {
                setActiveTab('schedule');
                toggleSection('schedule');
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title="កាលវិភាគសិក្សា"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Calendar className="w-4 h-4 shrink-0 text-amber-300" />
                {isOpen && <span className="truncate">កាលវិភាគសិក្សា</span>}
              </div>
              {isOpen && (
                <div>
                  {openSections.schedule ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              )}
            </button>

            {/* Submenu for Schedule */}
            {isOpen && openSections.schedule && (
              <div className="ml-5 mt-1 pl-3 border-l-2 border-slate-800 space-y-1 text-xs py-1">
                <button
                  onClick={() => {
                    setActiveTab('schedule');
                    onSubjectDisplayModeChange('all');
                  }}
                  className={`w-full text-left py-1.5 px-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'schedule' && subjectDisplayMode === 'all'
                      ? 'bg-blue-500/20 text-blue-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  <span className="truncate">គ្រប់មុខវិជ្ជា (តារាងរួម)</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('schedule');
                    onSubjectDisplayModeChange('khmer_only');
                  }}
                  className={`w-full text-left py-1.5 px-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'schedule' && subjectDisplayMode === 'khmer_only'
                      ? 'bg-blue-500/20 text-blue-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                  <span className="truncate">ភាសាខ្មែរ (ស្តង់ដារលម្អិត)</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('schedule');
                    onSubjectDisplayModeChange('math_only');
                  }}
                  className={`w-full text-left py-1.5 px-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'schedule' && subjectDisplayMode === 'math_only'
                      ? 'bg-blue-500/20 text-blue-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="truncate">គណិតវិទ្យា (ស្តង់ដារលម្អិត)</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('schedule');
                    onSubjectDisplayModeChange('science_only');
                  }}
                  className={`w-full text-left py-1.5 px-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'schedule' && subjectDisplayMode === 'science_only'
                      ? 'bg-blue-500/20 text-blue-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span className="truncate">វិទ្យាសាស្ត្រ (ស្តង់ដារលម្អិត)</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('schedule');
                    onSubjectDisplayModeChange('social_only');
                  }}
                  className={`w-full text-left py-1.5 px-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'schedule' && subjectDisplayMode === 'social_only'
                      ? 'bg-blue-500/20 text-blue-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  <span className="truncate">សិក្សាសង្គម (ស្តង់ដារលម្អិត)</span>
                </button>
              </div>
            )}
          </div>

          {/* MENU 2: Lesson Management & Submenus */}
          <div>
            <button
              onClick={() => {
                setActiveTab('lessons');
                toggleSection('lessons');
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'lessons'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title="គ្រប់គ្រងមេរៀន"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <BookOpen className="w-4 h-4 shrink-0 text-emerald-400" />
                {isOpen && <span className="truncate">គ្រប់គ្រងមេរៀន</span>}
              </div>
              {isOpen && (
                <div>
                  {openSections.lessons ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              )}
            </button>

            {/* Submenu for Lessons */}
            {isOpen && openSections.lessons && (
              <div className="ml-5 mt-1 pl-3 border-l-2 border-slate-800 space-y-1 text-xs py-1">
                <button
                  onClick={() => {
                    setActiveTab('lessons');
                    if (onSelectLessonSubject) onSelectLessonSubject('khmer');
                  }}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                  <span>មេរៀនភាសាខ្មែរ</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('lessons');
                    if (onSelectLessonSubject) onSelectLessonSubject('math');
                  }}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>មេរៀនគណិតវិទ្យា</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('lessons');
                    if (onSelectLessonSubject) onSelectLessonSubject('science');
                  }}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>មេរៀនវិទ្យាសាស្ត្រ</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('lessons');
                    if (onSelectLessonSubject) onSelectLessonSubject('social');
                  }}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  <span>មេរៀនសិក្សាសង្គម</span>
                </button>

                {onOpenBulkImport && (
                  <button
                    onClick={() => {
                      setActiveTab('lessons');
                      onOpenBulkImport();
                    }}
                    className="w-full text-left py-1.5 px-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
                    <span>នាំចូលជាក្រុម (Bulk Import)</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* MENU 3: Grade Selector & Submenus */}
          <div>
            <button
              onClick={() => toggleSection('grades')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition cursor-pointer"
              title="ប្តូរថ្នាក់បឋមសិក្សា"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <GraduationCap className="w-4 h-4 shrink-0 text-amber-400" />
                {isOpen && <span className="truncate">ថ្នាក់បឋមសិក្សា (១ ដល់ ៦)</span>}
              </div>
              {isOpen && (
                <div>
                  {openSections.grades ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              )}
            </button>

            {/* Submenu for Grades */}
            {isOpen && openSections.grades && (
              <div className="ml-5 mt-1 pl-3 border-l-2 border-slate-800 space-y-1 text-xs py-1">
                {GRADE_PRESETS.map((g) => (
                  <button
                    key={g.key}
                    onClick={() => onGradeChange(g.key)}
                    className={`w-full text-left py-1.5 px-2 rounded-lg transition cursor-pointer flex items-center justify-between ${
                      selectedGradeKey === g.key
                        ? 'bg-amber-400/20 text-amber-300 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <span>{g.label}</span>
                    {selectedGradeKey === g.key && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* MENU 4: Holidays & Calendar & Submenus */}
          <div>
            <button
              onClick={() => {
                setActiveTab('holidays');
                toggleSection('holidays');
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'holidays'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title="ថ្ងៃឈប់សម្រាកបុណ្យជាតិ"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <CalendarCheck className="w-4 h-4 shrink-0 text-rose-400" />
                {isOpen && <span className="truncate">ថ្ងៃឈប់សម្រាកបុណ្យជាតិ</span>}
              </div>
              {isOpen && (
                <div>
                  {openSections.holidays ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              )}
            </button>

            {/* Submenu for Holidays */}
            {isOpen && openSections.holidays && (
              <div className="ml-5 mt-1 pl-3 border-l-2 border-slate-800 space-y-1 text-xs py-1">
                <button
                  onClick={() => setActiveTab('holidays')}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition cursor-pointer"
                >
                  បញ្ជីបុណ្យជាតិផ្លូវការ
                </button>
                {onResetHolidays && (
                  <button
                    onClick={onResetHolidays}
                    className="w-full text-left py-1.5 px-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-400" />
                    <span>កំណត់បញ្ជីដើមឡើងវិញ</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* MENU 5: Export & Submenus */}
          <div>
            <button
              onClick={() => {
                setActiveTab('export');
                toggleSection('export');
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'export'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title="នាំចេញ និងស្វ័យប្រវត្តិកម្ម"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Share2 className="w-4 h-4 shrink-0 text-sky-400" />
                {isOpen && <span className="truncate">នាំចេញ & ស្វ័យប្រវត្តិកម្ម</span>}
              </div>
              {isOpen && (
                <div>
                  {openSections.export ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              )}
            </button>

            {/* Submenu for Export */}
            {isOpen && openSections.export && (
              <div className="ml-5 mt-1 pl-3 border-l-2 border-slate-800 space-y-1 text-xs py-1">
                <button
                  onClick={onCopyGoogleSheets}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-emerald-400 hover:bg-emerald-950/40 transition cursor-pointer flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>ចម្លងដាក់ Google Sheet</span>
                </button>
                <button
                  onClick={onDownloadExcel}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-blue-400 hover:bg-blue-950/40 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ទាញយក Excel (.xls)</span>
                </button>
                <button
                  onClick={onDownloadCSV}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-slate-300 hover:bg-slate-800/40 transition cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>ទាញយក CSV</span>
                </button>
                <button
                  onClick={onPrint}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-slate-300 hover:bg-slate-800/40 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>បោះពុម្ព / Save PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* MENU 6: AI Lesson Planner */}
          <div>
            <button
              onClick={onOpenAIModal}
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-purple-900/60 to-indigo-900/60 hover:from-purple-800/70 hover:to-indigo-800/70 text-purple-200 border border-purple-700/40 transition cursor-pointer shadow-xs"
              title="ជំនួយការ AI កិច្ចតែងការ"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-300 animate-pulse" />
                {isOpen && <span className="truncate">ជំនួយការ AI កិច្ចតែងការ</span>}
              </div>
              {isOpen && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-700 text-purple-100 font-bold">
                  Gemini
                </span>
              )}
            </button>
          </div>

          {/* MENU 7: Settings & Submenus */}
          <div>
            <button
              onClick={() => {
                setActiveTab('settings');
                toggleSection('settings');
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title="ការកំណត់ទូទៅ"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Settings className="w-4 h-4 shrink-0 text-slate-400" />
                {isOpen && <span className="truncate">ការកំណត់ទូទៅ</span>}
              </div>
              {isOpen && (
                <div>
                  {openSections.settings ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              )}
            </button>

            {/* Submenu for Settings */}
            {isOpen && openSections.settings && (
              <div className="ml-5 mt-1 pl-3 border-l-2 border-slate-800 space-y-1 text-xs py-1">
                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition cursor-pointer"
                >
                  ព័ត៌មានសាលា & គ្រូបង្រៀន
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition cursor-pointer"
                >
                  កាលបរិច្ឆេទ & វិស្សមកាល
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full text-left py-1.5 px-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition cursor-pointer"
                >
                  លក្ខខណ្ឌថ្ងៃព្រហស្បតិ៍
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Footer with Share / Publish Link */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <button
            onClick={onShareApp}
            className={`w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-md ${
              !isOpen ? 'px-2' : ''
            }`}
            title="ចែករំលែកតំណលីង (Share / Publish Link)"
          >
            <Share2 className="w-4 h-4 shrink-0" />
            {isOpen && <span className="truncate">ចែករំលែកលីង (Share)</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
