import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  Calendar,
  List,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer
} from 'lucide-react';
import { ConfigState, LessonItem, ScheduleRow, SubjectDisplayMode } from '../types';
import { toKhmerNum } from '../data/holidays';

interface ScheduleTableProps {
  rows: ScheduleRow[];
  config: ConfigState;
  subjectDisplayMode: SubjectDisplayMode;
  onSubjectDisplayModeChange: (mode: SubjectDisplayMode) => void;
  onSelectLessonForAI: (lesson: LessonItem, subject: string) => void;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  rows,
  config,
  subjectDisplayMode,
  onSubjectDisplayModeChange,
  onSelectLessonForAI
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [selectedDayType, setSelectedDayType] = useState('ALL');
  const [viewType, setViewType] = useState<'table' | 'calendar'>('table');

  // Compute unique month list
  const monthOptions = useMemo(() => {
    const map = new Map<string, string>();
    rows.forEach((r) => {
      if (r.monthKey && r.monthLabel) {
        map.set(r.monthKey, r.monthLabel);
      }
    });
    return Array.from(map.entries()).map(([key, label]) => ({ key, label }));
  }, [rows]);

  // Filter rows
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (selectedMonth !== 'ALL' && r.monthKey !== selectedMonth) {
        return false;
      }
      if (selectedDayType !== 'ALL' && r.dayType !== selectedDayType) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const text = `${r.date} ${r.dayName} ${r.monthLabel} ${r.statusLabel} ${r.khmer} ${r.math} ${r.science} ${r.social} ${r.note} ${r.khmerObj?.outcome || ''} ${r.mathObj?.outcome || ''}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [rows, selectedMonth, selectedDayType, searchTerm]);

  // Helper for row badges
  const getBadgeClass = (dayType: string) => {
    switch (dayType) {
      case 'TEACHING':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'HOLIDAY':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
      case 'VACATION_SMALL':
      case 'VACATION_BIG':
        return 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
      case 'THURSDAY_REVIEW':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'THURSDAY_4TH':
        return 'bg-purple-50 text-purple-700 border-purple-200 font-bold';
      case 'DIAGNOSTIC':
        return 'bg-blue-50 text-blue-700 border-blue-200 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const isSingleSubj = [
    'khmer_only',
    'math_only',
    'science_only',
    'social_only'
  ].includes(subjectDisplayMode);

  let currentSubjName = 'ភាសាខ្មែរ';
  if (subjectDisplayMode === 'math_only') currentSubjName = 'គណិតវិទ្យា';
  else if (subjectDisplayMode === 'science_only') currentSubjName = 'វិទ្យាសាស្ត្រ';
  else if (subjectDisplayMode === 'social_only') currentSubjName = 'សិក្សាសង្គម';

  return (
    <div className="space-y-4">
      {/* Search, Filter & View Controls */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs no-print space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Subject Display Modes */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => onSubjectDisplayModeChange('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                subjectDisplayMode === 'all'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              គ្រប់មុខវិជ្ជា (តារាងរួម)
            </button>
            <button
              onClick={() => onSubjectDisplayModeChange('khmer_only')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                subjectDisplayMode === 'khmer_only'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ភាសាខ្មែរ (ស្តង់ដារលម្អិត)
            </button>
            <button
              onClick={() => onSubjectDisplayModeChange('math_only')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                subjectDisplayMode === 'math_only'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              គណិតវិទ្យា (ស្តង់ដារលម្អិត)
            </button>
            <button
              onClick={() => onSubjectDisplayModeChange('science_only')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                subjectDisplayMode === 'science_only'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              វិទ្យាសាស្ត្រ (ស្តង់ដារលម្អិត)
            </button>
            <button
              onClick={() => onSubjectDisplayModeChange('social_only')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                subjectDisplayMode === 'social_only'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              សិក្សាសង្គម (ស្តង់ដារលម្អិត)
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 self-start lg:self-auto bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewType('table')}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1 cursor-pointer transition ${
                viewType === 'table'
                  ? 'bg-white text-blue-900 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="មើលជាតារាងបញ្ជី"
            >
              <List className="w-4 h-4" />
              <span>តារាង</span>
            </button>
            <button
              onClick={() => setViewType('calendar')}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1 cursor-pointer transition ${
                viewType === 'calendar'
                  ? 'bg-white text-blue-900 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="មើលជាប្រតិទិនប្រចាំខែ"
            >
              <Calendar className="w-4 h-4" />
              <span>ប្រតិទិន</span>
            </button>
          </div>
        </div>

        {/* Filter dropdowns & Search input */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ស្វែងរកតាមចំណងជើង ជំពូក វត្ថុបំណង ឬកាលបរិច្ឆេទ..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">គ្រប់ខែទាំងអស់ (ពេញមួយឆ្នាំសិក្សា)</option>
              {monthOptions.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedDayType}
              onChange={(e) => setSelectedDayType(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">គ្រប់ស្ថានភាពថ្ងៃទាំងអស់</option>
              <option value="TEACHING">ថ្ងៃបង្រៀនធម្មតា</option>
              <option value="THURSDAY_REVIEW">ថ្ងៃព្រហស្បតិ៍ (បង្រៀនបំប៉ន & រំលឹក)</option>
              <option value="THURSDAY_4TH">ថ្ងៃព្រហស្បតិ៍សប្តាហ៍ទី៤ (ប្រជុំបច្ចេកទេស)</option>
              <option value="HOLIDAY">ឈប់សម្រាកបុណ្យជាតិ</option>
              <option value="VACATION_SMALL">វិស្សមកាលតូច (ចូលឆ្នាំ)</option>
              <option value="VACATION_BIG">វិស្សមកាលធំ (បញ្ចប់ឆ្នាំ)</option>
              <option value="DIAGNOSTIC">តេស្តរោគវិនិច្ឆ័យ</option>
            </select>
          </div>
        </div>

        {/* Search Results Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            បង្ហាញចំនួន <strong>{toKhmerNum(filteredRows.length)}</strong> / {toKhmerNum(rows.length)} ថ្ងៃ
          </span>
          {(searchTerm || selectedMonth !== 'ALL' || selectedDayType !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedMonth('ALL');
                setSelectedDayType('ALL');
              }}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              សម្អាតតម្រងទាំងអស់
            </button>
          )}
        </div>
      </div>

      {/* Official Print Header (Only visible in Print & Document mode) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:p-0 print:border-none print:shadow-none">
        <div className="text-center mb-6">
          <p className="font-moul text-base sm:text-lg text-slate-900">ព្រះរាជាណាចក្រកម្ពុជា</p>
          <p className="font-moul text-sm sm:text-base text-slate-800 mt-1">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
          <div className="w-24 h-0.5 bg-slate-400 mx-auto mt-2 mb-4"></div>

          <div className="flex justify-between items-start text-xs sm:text-sm font-medium text-slate-700 px-2 sm:px-6">
            <div className="text-left space-y-1">
              <p>{config.province}</p>
              <p>{config.district}</p>
              <p className="font-bold text-slate-900">{config.schoolName}</p>
            </div>
            <div className="text-right space-y-1">
              <p>ថ្នាក់៖ <strong className="text-slate-900">{config.gradeLabel}</strong></p>
              <p>គ្រូបន្ទុកថ្នាក់៖ <strong className="text-slate-900">{config.teacherName}</strong></p>
              <p>ឆ្នាំសិក្សា៖ <strong>{toKhmerNum(config.academicYear)}</strong></p>
            </div>
          </div>

          <h2 className="font-moul text-base sm:text-xl text-blue-950 mt-5 pt-3 border-t border-slate-200">
            បំណែងចែកកម្មវិធីសិក្សាស្វ័យប្រវត្តិតាមប្រតិទិន
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isSingleSubj ? `មុខវិជ្ជា៖ ${currentSubjName}` : 'កម្មវិធីសិក្សារួមគ្រប់មុខវិជ្ជា (ភាសាខ្មែរ គណិតវិទ្យា វិទ្យាសាស្ត្រ សិក្សាសង្គម)'}
          </p>
        </div>

        {/* View Mode: Calendar View */}
        {viewType === 'calendar' ? (
          <div className="space-y-6 no-print">
            {monthOptions
              .filter((m) => selectedMonth === 'ALL' || m.key === selectedMonth)
              .map((month) => {
                const monthRows = rows.filter((r) => r.monthKey === month.key);
                return (
                  <div key={month.key} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h3 className="font-moul text-blue-900 text-sm mb-3">
                      {month.label} ({toKhmerNum(monthRows.length)} ថ្ងៃ)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                      {monthRows.map((r) => (
                        <div
                          key={r.rowNum}
                          className={`p-2.5 rounded-lg border text-xs transition ${
                            r.dayType === 'HOLIDAY'
                              ? 'bg-rose-50 border-rose-200 text-rose-900'
                              : r.dayType === 'VACATION_SMALL' || r.dayType === 'VACATION_BIG'
                              ? 'bg-amber-50 border-amber-200 text-amber-900'
                              : r.dayType === 'THURSDAY_4TH'
                              ? 'bg-purple-50 border-purple-200 text-purple-900'
                              : r.dayType === 'THURSDAY_REVIEW'
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                              : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold">{r.dayName} {r.date}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/80 border">
                              {r.weekLabel}
                            </span>
                          </div>
                          <p className="font-semibold text-[11px] truncate mb-1">
                            {r.statusLabel}
                          </p>
                          {r.dayType === 'TEACHING' && (
                            <div className="space-y-0.5 text-[11px] text-slate-600">
                              <p className="truncate"><strong>ខ្មែរ៖</strong> {r.khmer}</p>
                              <p className="truncate"><strong>គណិត៖</strong> {r.math}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          /* View Mode: Comprehensive Table View */
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-blue-900 text-white divide-x divide-blue-800">
                  <th className="py-2.5 px-2 text-center w-10">ល.រ</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">កាលបរិច្ឆេទ</th>
                  <th className="py-2.5 px-2 text-center whitespace-nowrap">សប្តាហ៍</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">ស្ថានភាព / ប្រភេទថ្ងៃ</th>

                  {isSingleSubj ? (
                    <>
                      <th className="py-2.5 px-3 min-w-[130px]">ជំពូក / មេរៀន</th>
                      <th className="py-2.5 px-3 min-w-[200px]">ខ្លឹមសារមេរៀន (សៀវភៅគោល)</th>
                      <th className="py-2.5 px-3 min-w-[220px]">វត្ថុបំណង / លទ្ធផលរំពឹងទុក</th>
                      <th className="py-2.5 px-2 text-center w-12">ម៉ោង</th>
                      <th className="py-2.5 px-2 text-center w-16">ទំព័រ ស.ស.</th>
                      <th className="py-2.5 px-2 text-center w-16">ទំព័រ ស.គ.</th>
                    </>
                  ) : (
                    <>
                      <th className="py-2.5 px-3 min-w-[220px]">ភាសាខ្មែរ (មេរៀន និងទំព័រ)</th>
                      <th className="py-2.5 px-3 min-w-[220px]">គណិតវិទ្យា (មេរៀន និងទំព័រ)</th>
                      <th className="py-2.5 px-2.5 min-w-[150px]">វិទ្យាសាស្ត្រ</th>
                      <th className="py-2.5 px-2.5 min-w-[150px]">សិក្សាសង្គម</th>
                    </>
                  )}
                  <th className="py-2.5 px-2 text-center no-print w-16">AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isSingleSubj ? 11 : 9}
                      className="py-8 text-center text-slate-400"
                    >
                      មិនមានទិន្នន័យស្របតាមលក្ខខណ្ឌស្វែងរកទេ។
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((r, idx) => {
                    const isEven = idx % 2 === 0;

                    let singleObj = r.khmerObj;
                    let subjName = 'ភាសាខ្មែរ';
                    if (subjectDisplayMode === 'math_only') {
                      singleObj = r.mathObj;
                      subjName = 'គណិតវិទ្យា';
                    } else if (subjectDisplayMode === 'science_only') {
                      singleObj = r.sciObj;
                      subjName = 'វិទ្យាសាស្ត្រ';
                    } else if (subjectDisplayMode === 'social_only') {
                      singleObj = r.socObj;
                      subjName = 'សិក្សាសង្គម';
                    }

                    return (
                      <tr
                        key={r.rowNum}
                        className={`transition hover:bg-blue-50/60 divide-x divide-slate-200 ${
                          r.dayType === 'HOLIDAY'
                            ? 'bg-rose-50/50'
                            : r.dayType === 'VACATION_SMALL' || r.dayType === 'VACATION_BIG'
                            ? 'bg-amber-50/50'
                            : r.dayType === 'THURSDAY_4TH'
                            ? 'bg-purple-50/40'
                            : isEven
                            ? 'bg-white'
                            : 'bg-slate-50/70'
                        }`}
                      >
                        <td className="py-2 px-1 text-center font-medium text-slate-500">
                          {toKhmerNum(idx + 1)}
                        </td>

                        <td className="py-2 px-2.5 whitespace-nowrap">
                          <div className="font-semibold text-slate-800">
                            {r.dayName}
                          </div>
                          <div className="text-[11px] text-slate-500">{r.date}</div>
                        </td>

                        <td className="py-2 px-1 text-center whitespace-nowrap text-slate-600">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px]">
                            {r.weekLabel}
                          </span>
                        </td>

                        <td className="py-2 px-2.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] border ${getBadgeClass(
                              r.dayType
                            )}`}
                          >
                            {r.statusLabel}
                          </span>
                        </td>

                        {isSingleSubj ? (
                          <>
                            <td className="py-2 px-3 font-semibold text-slate-800">
                              {singleObj?.chapter || '—'}
                            </td>
                            <td className="py-2 px-3 text-slate-900 font-medium">
                              {singleObj?.title || '—'}
                            </td>
                            <td className="py-2 px-3 text-slate-600 text-[11px] leading-relaxed">
                              {singleObj?.outcome || '—'}
                            </td>
                            <td className="py-2 px-1.5 text-center text-slate-700 whitespace-nowrap">
                              {singleObj?.hours || '១ម៉'}
                            </td>
                            <td className="py-2 px-1 text-center text-slate-700 whitespace-nowrap font-medium">
                              {singleObj?.page_ss ? toKhmerNum(singleObj.page_ss) : '—'}
                            </td>
                            <td className="py-2 px-1 text-center text-slate-700 whitespace-nowrap font-medium">
                              {singleObj?.page_sg ? toKhmerNum(singleObj.page_sg) : '—'}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-2 px-3">
                              <div className="font-medium text-slate-900 leading-snug">
                                {r.khmer}
                              </div>
                              {r.khmerObj?.outcome && (
                                <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                                  {r.khmerObj.outcome}
                                </div>
                              )}
                            </td>

                            <td className="py-2 px-3">
                              <div className="font-medium text-slate-900 leading-snug">
                                {r.math}
                              </div>
                              {r.mathObj?.outcome && (
                                <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                                  {r.mathObj.outcome}
                                </div>
                              )}
                            </td>

                            <td className="py-2 px-2.5 text-slate-700 text-[11px]">
                              {r.science}
                            </td>

                            <td className="py-2 px-2.5 text-slate-700 text-[11px]">
                              {r.social}
                            </td>
                          </>
                        )}

                        {/* AI Lesson Plan trigger */}
                        <td className="py-2 px-1.5 text-center no-print">
                          {r.dayType === 'TEACHING' && singleObj && (
                            <button
                              onClick={() => onSelectLessonForAI(singleObj!, subjName)}
                              className="p-1 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 transition cursor-pointer"
                              title="បង្កើតកិច្ចតែងការបង្រៀនជាមួយ AI"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Official MoEYS Document Sign-off Footer */}
        <div className="mt-12 pt-6 grid grid-cols-2 text-center text-xs sm:text-sm font-medium text-slate-800">
          <div>
            <p className="font-semibold">បានឃើញ និងឯកភាព</p>
            <p className="font-moul text-xs sm:text-sm mt-1">នាយកសាលា</p>
            <div className="h-20 sm:h-24"></div>
            <p className="font-bold underline decoration-dotted underline-offset-4">
              {config.principalName}
            </p>
          </div>

          <div>
            <p>ថ្ងៃ................. ខែ................. ឆ្នាំ {toKhmerNum(config.academicYear.split('-')[0] || '២០២៥')}</p>
            <p className="font-moul text-xs sm:text-sm mt-1">គ្រូបន្ទុកថ្នាក់</p>
            <div className="h-20 sm:h-24"></div>
            <p className="font-bold underline decoration-dotted underline-offset-4">
              {config.teacherName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
