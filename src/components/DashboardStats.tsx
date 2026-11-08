import React from 'react';
import {
  CalendarDays,
  GraduationCap,
  Flag,
  Palmtree,
  BookMarked,
  Users2
} from 'lucide-react';
import { ScheduleStats } from '../utils/scheduleEngine';
import { SubjectLessons } from '../types';
import { toKhmerNum } from '../data/holidays';

interface DashboardStatsProps {
  stats: ScheduleStats;
  lessons: SubjectLessons;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  lessons
}) => {
  return (
    <div className="space-y-4 no-print">
      {/* 6 Grid Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">
              ថ្ងៃសរុបក្នុងតារាង
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 font-moul">
              {toKhmerNum(stats.totalRows)}
            </span>
            <span className="text-xs text-slate-500">ថ្ងៃ</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            ពេញមួយឆ្នាំសិក្សា
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-emerald-200/80 shadow-xs hover:shadow-md transition bg-gradient-to-br from-emerald-50/40 to-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase">
              ថ្ងៃត្រូវបង្រៀនជាក់ស្តែង
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-emerald-800 font-moul">
              {toKhmerNum(stats.teachingDays)}
            </span>
            <span className="text-xs text-emerald-600">ថ្ងៃ</span>
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5">
            ថ្ងៃរៀនសូត្រផ្ទាល់
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-amber-200/80 shadow-xs hover:shadow-md transition bg-gradient-to-br from-amber-50/40 to-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-700 uppercase">
              ឈប់សម្រាកបុណ្យជាតិ
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-amber-800 font-moul">
              {toKhmerNum(stats.holidayDays)}
            </span>
            <span className="text-xs text-amber-600">ថ្ងៃ</span>
          </div>
          <div className="text-[11px] text-amber-600 mt-0.5">
            បុណ្យជាតិផ្លូវការ
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-sky-200/80 shadow-xs hover:shadow-md transition bg-gradient-to-br from-sky-50/40 to-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-sky-700 uppercase">
              វិស្សមកាលតូច & ធំ
            </span>
            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <Palmtree className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-sky-800 font-moul">
              {toKhmerNum(stats.vacationDays)}
            </span>
            <span className="text-xs text-sky-600">ថ្ងៃ</span>
          </div>
          <div className="text-[11px] text-sky-600 mt-0.5">
            ចូលឆ្នាំ & បញ្ចប់ឆ្នាំ
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-indigo-200/80 shadow-xs hover:shadow-md transition bg-gradient-to-br from-indigo-50/40 to-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-indigo-700 uppercase">
              បង្រៀនបំប៉ន & រំលឹក
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <BookMarked className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-indigo-800 font-moul">
              {toKhmerNum(stats.reviewDays)}
            </span>
            <span className="text-xs text-indigo-600">ថ្ងៃ</span>
          </div>
          <div className="text-[11px] text-indigo-600 mt-0.5">
            រៀងរាល់ថ្ងៃព្រហស្បតិ៍
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-purple-200/80 shadow-xs hover:shadow-md transition bg-gradient-to-br from-purple-50/40 to-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-purple-700 uppercase">
              ប្រជុំបច្ចេកទេសប្រចាំខែ
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-purple-800 font-moul">
              {toKhmerNum(stats.techMeetingDays)}
            </span>
            <span className="text-xs text-purple-600">ថ្ងៃ</span>
          </div>
          <div className="text-[11px] text-purple-600 mt-0.5">
            ព្រហស្បតិ៍សប្តាហ៍ទី៤
          </div>
        </div>
      </div>

      {/* Subject Progress Bars Banner */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            ការគ្របដណ្តប់ខ្លឹមសារមេរៀនតាមមុខវិជ្ជា (Subject Lesson Coverage)
          </div>
          <div className="text-xs text-slate-500">
            គណនាតាមសមាមាត្រថ្ងៃបង្រៀនជាក់ស្តែង ធៀបនឹងចំនួនមេរៀនក្នុងកម្មវិធីសិក្សា
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700">ភាសាខ្មែរ</span>
              <span className="text-slate-500">
                {toKhmerNum(lessons.khmer.length)} មេរៀន ({toKhmerNum(stats.khmerProgress)}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, stats.khmerProgress)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700">គណិតវិទ្យា</span>
              <span className="text-slate-500">
                {toKhmerNum(lessons.math.length)} មេរៀន ({toKhmerNum(stats.mathProgress)}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, stats.mathProgress)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700">វិទ្យាសាស្ត្រ</span>
              <span className="text-slate-500">
                {toKhmerNum(lessons.science.length)} មេរៀន ({toKhmerNum(stats.scienceProgress)}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, stats.scienceProgress)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700">សិក្សាសង្គម</span>
              <span className="text-slate-500">
                {toKhmerNum(lessons.social.length)} មេរៀន ({toKhmerNum(stats.socialProgress)}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, stats.socialProgress)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
