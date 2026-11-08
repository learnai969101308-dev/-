/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { ScheduleTable } from './components/ScheduleTable';
import { LessonManager } from './components/LessonManager';
import { HolidayManager } from './components/HolidayManager';
import { SettingsPanel } from './components/SettingsPanel';
import { ExportPanel } from './components/ExportPanel';
import { AILessonPlannerModal } from './components/AILessonPlannerModal';
import { ShareModal } from './components/ShareModal';
import { Sidebar } from './components/Sidebar';

import {
  ActiveTab,
  ConfigState,
  HolidayItem,
  LessonItem,
  SubjectDisplayMode,
  SubjectKey,
  SubjectLessons
} from './types';
import { getCurriculumForGrade, GRADE_PRESETS, PRESET_CURRICULA } from './data/curricula';
import { getHolidaysForAcademicYear } from './data/holidays';
import { calculateScheduleStats, generateSchedule } from './utils/scheduleEngine';
import {
  copyScheduleAsTSVForGoogleSheets,
  downloadScheduleCSV,
  downloadScheduleFormattedXLS
} from './utils/exportUtils';
import { CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'moeys_curriculum_app_state_v1';

const DEFAULT_CONFIG: ConfigState = {
  academicYear: '2025-2026',
  province: 'មន្ទីរអប់រំ យុវជន និងកីឡាខេត្តតាកែវ',
  district: 'ស្រុកគិរីវង់ • កម្រងសោម',
  schoolName: 'សាលាបឋមសិក្សា សិរីវង្ស',
  gradeLabel: 'ថ្នាក់ទី៦ (ក)',
  teacherName: 'ងៀង សំណាង',
  principalName: '............................................',
  startDate: '2025-11-01',
  endDate: '2026-08-31',
  smallVacStart: '2026-04-06',
  smallVacEnd: '2026-04-20',
  bigVacStart: '2026-09-01',
  bigVacEnd: '2026-10-31',
  diagnosticDays: 3,
  studyDaysPerWeek: 6,
  fourthThuMode: 'calendar_4th',
  otherThuMode: 'review_only'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('schedule');
  const [selectedGradeKey, setSelectedGradeKey] = useState<string>('grade6');
  const [subjectDisplayMode, setSubjectDisplayMode] =
    useState<SubjectDisplayMode>('all');

  const [config, setConfig] = useState<ConfigState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.config) return { ...DEFAULT_CONFIG, ...parsed.config };
      }
    } catch (e) {
      console.error('Failed to load local storage state:', e);
    }
    return DEFAULT_CONFIG;
  });

  const [lessons, setLessons] = useState<SubjectLessons>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lessons) return parsed.lessons;
      }
    } catch (e) {
      console.error(e);
    }
    return getCurriculumForGrade('grade6');
  });

  const [holidays, setHolidays] = useState<HolidayItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.holidays) return parsed.holidays;
      }
    } catch (e) {
      console.error(e);
    }
    const startYr = parseInt(DEFAULT_CONFIG.academicYear.split('-')[0], 10) || 2025;
    return getHolidaysForAcademicYear(startYr);
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // AI Modal
  const [aiModalState, setAiModalState] = useState<{
    isOpen: boolean;
    lesson: LessonItem | null;
    subject: string;
  }>({
    isOpen: false,
    lesson: null,
    subject: 'ភាសាខ្មែរ'
  });

  // Sidebar state (toggleable Menu & sub-menu sidebar)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Share Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const publicUrl =
    typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
      ? window.location.origin
      : 'https://ais-pre-5i3cl3i7qgkogs5gmdyzxp-301729077555.asia-southeast1.run.app';

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          config,
          lessons,
          holidays,
          selectedGradeKey,
          subjectDisplayMode
        })
      );
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [config, lessons, holidays, selectedGradeKey, subjectDisplayMode]);

  // Compute schedule rows dynamically
  const scheduleRows = useMemo(() => {
    return generateSchedule(config, lessons, holidays);
  }, [config, lessons, holidays]);

  // Compute dashboard metrics
  const stats = useMemo(() => {
    return calculateScheduleStats(scheduleRows, lessons);
  }, [scheduleRows, lessons]);

  // Handle grade change
  const handleGradeChange = (gradeKey: string) => {
    setSelectedGradeKey(gradeKey);
    const newLessons = getCurriculumForGrade(gradeKey);
    setLessons(newLessons);

    const presetLabel =
      GRADE_PRESETS.find((g) => g.key === gradeKey)?.label || 'ថ្នាក់ទី';

    setConfig((prev) => ({
      ...prev,
      gradeLabel: presetLabel
    }));

    showToast(`បានប្តូរទៅកាន់ ${presetLabel} និងទាញយកកម្មវិធីសិក្សាថ្មី!`);
  };

  // Reset single subject to MoEYS preset
  const handleResetSubjectToPreset = (subjectKey: SubjectKey) => {
    const preset = getCurriculumForGrade(selectedGradeKey);
    setLessons((prev) => ({
      ...prev,
      [subjectKey]: preset[subjectKey]
    }));
    showToast(`បានកំណត់មេរៀនមុខវិជ្ជាឡើងវិញតាមស្តង់ដារ MoEYS!`);
  };

  // Reset all subjects to MoEYS preset
  const handleResetAllToPreset = () => {
    const preset = getCurriculumForGrade(selectedGradeKey);
    setLessons(preset);
    showToast(`បានកំណត់មេរៀនគ្រប់មុខវិជ្ជាឡើងវិញតាមស្តង់ដារ MoEYS!`);
  };

  // Reset holidays to official national holidays
  const handleResetToOfficialHolidays = () => {
    const startYr = parseInt(config.academicYear.split('-')[0], 10) || 2025;
    const defaultHols = getHolidaysForAcademicYear(startYr);
    setHolidays(defaultHols);
    showToast('បានកំណត់បញ្ជីថ្ងៃឈប់សម្រាកបុណ្យជាតិផ្លូវការឡើងវិញ!');
  };

  // Preset academic year apply
  const handleApplyAcademicYearPreset = (yearStr: string) => {
    const startYr = parseInt(yearStr.split('-')[0], 10);
    const newHols = getHolidaysForAcademicYear(startYr);
    setHolidays(newHols);
  };

  // Exports
  const handleCopyGoogleSheets = () => {
    const ok = copyScheduleAsTSVForGoogleSheets(
      scheduleRows,
      config,
      subjectDisplayMode
    );
    if (ok) {
      showToast('បានចម្លងតារាងរួចរាល់! សូមបើក Google Sheets រួចចុច Ctrl+V ដើម្បីបិទភ្ជាប់។');
    } else {
      showToast('មិនអាចចម្លងស្វ័យប្រវត្តិបានទេ។ សូមទាញយកជា Excel (.xls)។');
    }
  };

  const handleDownloadExcel = () => {
    downloadScheduleFormattedXLS(scheduleRows, config, subjectDisplayMode);
    showToast('បានទាញយកឯកសារ Excel (.xls) ដោយជោគជ័យ!');
  };

  const handleDownloadCSV = () => {
    downloadScheduleCSV(scheduleRows, config, subjectDisplayMode);
    showToast('បានទាញយកឯកសារ CSV ដោយជោគជ័យ!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenAIForFirstLesson = () => {
    const firstLesson = lessons.khmer[0] || {
      chapter: 'មេរៀនទី១',
      title: 'ព្យញ្ជនៈ និងស្រៈ',
      outcome: 'សិស្សអាចអាន និងស្គាល់តួអក្សរបានត្រឹមត្រូវ',
      hours: '១ម៉',
      page_ss: '១',
      page_sg: '១',
      days: 1,
      pages: 'ស.ស ១'
    };
    setAiModalState({
      isOpen: true,
      lesson: firstLesson,
      subject: 'ភាសាខ្មែរ'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 animate-bounce text-xs sm:text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Toggleable Sidebar with Menus and Sub-menus */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedGradeKey={selectedGradeKey}
        onGradeChange={handleGradeChange}
        subjectDisplayMode={subjectDisplayMode}
        onSubjectDisplayModeChange={setSubjectDisplayMode}
        academicYear={config.academicYear}
        gradeLabel={config.gradeLabel}
        onCopyGoogleSheets={handleCopyGoogleSheets}
        onDownloadExcel={handleDownloadExcel}
        onDownloadCSV={handleDownloadCSV}
        onPrint={handlePrint}
        onOpenAIModal={handleOpenAIForFirstLesson}
        onShareApp={() => setIsShareModalOpen(true)}
        onResetLessons={handleResetAllToPreset}
        onResetHolidays={handleResetToOfficialHolidays}
      />

      {/* Main Content Wrapper (shifts based on Sidebar open/collapse state) */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:pl-72' : 'lg:pl-20'
        }`}
      >
        {/* Main Navigation & App Header */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          isSidebarOpen={isSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedGradeKey={selectedGradeKey}
          onGradeChange={handleGradeChange}
          academicYear={config.academicYear}
          gradeLabel={config.gradeLabel}
          subjectDisplayMode={subjectDisplayMode}
          onSubjectDisplayModeChange={setSubjectDisplayMode}
          onCopyGoogleSheets={handleCopyGoogleSheets}
          onDownloadExcel={handleDownloadExcel}
          onDownloadCSV={handleDownloadCSV}
          onPrint={handlePrint}
          onOpenAIModal={handleOpenAIForFirstLesson}
          onShareApp={() => setIsShareModalOpen(true)}
        />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 space-y-6">
        {/* Metric Cards Banner (Visible on schedule and export tabs) */}
        {(activeTab === 'schedule' || activeTab === 'export') && (
          <DashboardStats stats={stats} lessons={lessons} />
        )}

        {/* Tab 1: Schedule Table & Views */}
        {activeTab === 'schedule' && (
          <ScheduleTable
            rows={scheduleRows}
            config={config}
            subjectDisplayMode={subjectDisplayMode}
            onSubjectDisplayModeChange={setSubjectDisplayMode}
            onSelectLessonForAI={(lesson, subj) => {
              setAiModalState({
                isOpen: true,
                lesson,
                subject: subj
              });
            }}
          />
        )}

        {/* Tab 2: Lesson & Syllabus Manager */}
        {activeTab === 'lessons' && (
          <LessonManager
            lessons={lessons}
            onUpdateLessons={setLessons}
            selectedGradeKey={selectedGradeKey}
            onGradeChange={handleGradeChange}
            onResetSubjectToPreset={handleResetSubjectToPreset}
            onResetAllToPreset={handleResetAllToPreset}
          />
        )}

        {/* Tab 3: Holiday & Calendar Manager */}
        {activeTab === 'holidays' && (
          <HolidayManager
            holidays={holidays}
            onUpdateHolidays={setHolidays}
            onResetToOfficialHolidays={handleResetToOfficialHolidays}
            academicYear={config.academicYear}
          />
        )}

        {/* Tab 4: Export & Automation */}
        {activeTab === 'export' && (
          <ExportPanel
            rows={scheduleRows}
            config={config}
            subjectDisplayMode={subjectDisplayMode}
            onCopyGoogleSheets={handleCopyGoogleSheets}
            onDownloadExcel={handleDownloadExcel}
            onDownloadCSV={handleDownloadCSV}
            onPrint={handlePrint}
          />
        )}

        {/* Tab 5: General Settings */}
        {activeTab === 'settings' && (
          <SettingsPanel
            config={config}
            onSaveConfig={(updated) => {
              setConfig(updated);
              showToast('បានរក្សាទុកការកំណត់ និងអាប់ដេតតារាងកម្មវិធីសិក្សា!');
            }}
            onApplyAcademicYearPreset={handleApplyAcademicYearPreset}
          />
        )}
      </main>

      {/* AI Lesson Planner Modal */}
      <AILessonPlannerModal
        isOpen={aiModalState.isOpen}
        onClose={() =>
          setAiModalState({ isOpen: false, lesson: null, subject: '' })
        }
        lesson={aiModalState.lesson}
        subject={aiModalState.subject}
        config={config}
      />

      {/* Share / Publish URL Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        publicUrl={publicUrl}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-800 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <p className="font-semibold text-slate-300">
            ប្រព័ន្ធបង្កើតបំណែងចែកកម្មវិធីសិក្សាស្វ័យប្រវត្តិតាមប្រតិទិន (ថ្នាក់ទី១ ដល់ ថ្នាក់ទី៦)
          </p>
          <p className="text-slate-500">
            រៀបចំឡើងស្របតាមស្តង់ដារកម្មវិធីសិក្សានិងសៀវភៅគោលនៃក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS Cambodia)
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
}
