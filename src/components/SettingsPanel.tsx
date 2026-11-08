import React, { useState } from 'react';
import {
  Settings,
  School,
  Calendar,
  Save,
  RotateCcw,
  Sparkles,
  BookCheck,
  CheckCircle2
} from 'lucide-react';
import { ConfigState } from '../types';
import { toKhmerNum } from '../data/holidays';

interface SettingsPanelProps {
  config: ConfigState;
  onSaveConfig: (updated: ConfigState) => void;
  onApplyAcademicYearPreset: (yearStr: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  config,
  onSaveConfig,
  onApplyAcademicYearPreset
}) => {
  const [formData, setFormData] = useState<ConfigState>({ ...config });
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleYearPresetSelect = (yearStr: string) => {
    onApplyAcademicYearPreset(yearStr);
    const y1 = parseInt(yearStr.split('-')[0], 10);
    const y2 = y1 + 1;
    setFormData((prev) => ({
      ...prev,
      academicYear: yearStr,
      startDate: `${y1}-11-01`,
      endDate: `${y2}-08-31`,
      smallVacStart: `${y2}-04-06`,
      smallVacEnd: `${y2}-04-20`,
      bigVacStart: `${y2}-09-01`,
      bigVacEnd: `${y2}-10-31`
    }));
  };

  return (
    <div className="space-y-4 no-print">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-moul">
            ការកំណត់ព័ត៌មានសាលារៀន និងកាលបរិច្ឆេទឆ្នាំសិក្សា
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ទិន្នន័យទាំងនេះនឹងបង្ហាញលើក្បាលតារាង ឯកសារបោះពុម្ព និងការនាំចេញ Google Sheets/Excel
          </p>
        </div>

        {/* Academic Year Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">កំណត់ឆ្នាំសិក្សា៖</span>
          <select
            value={formData.academicYear}
            onChange={(e) => handleYearPresetSelect(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="2024-2025">ឆ្នាំសិក្សា ២០២៤-២០២៥</option>
            <option value="2025-2026">ឆ្នាំសិក្សា ២០២៥-២០២៦</option>
            <option value="2026-2027">ឆ្នាំសិក្សា ២០២៦-២០២៧</option>
            <option value="2027-2028">ឆ្នាំសិក្សា ២០២៧-២០២៨</option>
             <option value="2028-2029">ឆ្នាំសិក្សា ២០២៨-២០២៩</option>
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Section 1: School & Teacher Information */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-moul text-sm text-blue-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <School className="w-4 h-4 text-amber-500" />
              <span>ព័ត៌មានគ្រឹះស្ថានសិក្សា និងគ្រូបង្រៀន</span>
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  មន្ទីរអប់រំ យុវជន និងកីឡា (រាជធានី / ខេត្ត)
                </label>
                <input
                  type="text"
                  required
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  placeholder="ឧ. មន្ទីរអប់រំ យុវជន និងកីឡាខេត្តតាកែវ"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ការិយាល័យអប់រំ (ក្រុង / ស្រុក / ខណ្ឌ • កម្រង)
                </label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="ឧ. ស្រុកគិរីវង់ • កម្រងសោម"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ឈ្មោះសាលារៀន (គ្រឹះស្ថានបឋមសិក្សា)
                </label>
                <input
                  type="text"
                  required
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  placeholder="ឧ. សាលាបឋមសិក្សា សិរីវង្ស"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ថ្នាក់ទី (Grade / Class)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.gradeLabel}
                    onChange={(e) => setFormData({ ...formData, gradeLabel: e.target.value })}
                    placeholder="ឧ. ថ្នាក់ទី៦ (ក)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ឈ្មោះគ្រូបន្ទុកថ្នាក់
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.teacherName}
                    onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                    placeholder="ឧ. ងៀង សំណាង"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ឈ្មោះនាយកសាលា (សម្រាប់ចុះហត្ថលេខា និងត្រា)
                </label>
                <input
                  type="text"
                  value={formData.principalName}
                  onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                  placeholder="ឧ. ឈ្មោះលោកនាយកសាលា..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Calendar Dates & Academic Period */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-moul text-sm text-blue-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>កាលបរិច្ឆេទឆ្នាំសិក្សា និងវិស្សមកាល</span>
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ថ្ងៃចាប់ផ្តើមឆ្នាំសិក្សា
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ថ្ងៃបញ្ចប់ឆ្នាំសិក្សា
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 space-y-2">
                <span className="font-semibold text-amber-900 text-xs">
                  វិស្សមកាលតូច (ពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិ)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={formData.smallVacStart}
                    onChange={(e) => setFormData({ ...formData, smallVacStart: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <input
                    type="date"
                    value={formData.smallVacEnd}
                    onChange={(e) => setFormData({ ...formData, smallVacEnd: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 space-y-2">
                <span className="font-semibold text-sky-900 text-xs">
                  វិស្សមកាលធំ (បញ្ចប់ឆ្នាំសិក្សា)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={formData.bigVacStart}
                    onChange={(e) => setFormData({ ...formData, bigVacStart: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <input
                    type="date"
                    value={formData.bigVacEnd}
                    onChange={(e) => setFormData({ ...formData, bigVacEnd: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Teaching Rules */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    តេស្តរោគវិនិច្ឆ័យដើមឆ្នាំ (ថ្ងៃ)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={formData.diagnosticDays}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        diagnosticDays: Math.max(0, parseInt(e.target.value) || 0)
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ចំនួនថ្ងៃរៀនក្នុងមួយសប្តាហ៍
                  </label>
                  <select
                    value={formData.studyDaysPerWeek}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        studyDaysPerWeek: parseInt(e.target.value) || 6
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value={6}>៦ ថ្ងៃ/សប្តាហ៍ (ចន្ទ ដល់ សៅរ៍)</option>
                    <option value={5}>៥ ថ្ងៃ/សប្តាហ៍ (ចន្ទ ដល់ សុក្រ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ជម្រើសថ្ងៃព្រហស្បតិ៍សប្តាហ៍ទី៤
                </label>
                <select
                  value={formData.fourthThuMode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fourthThuMode: e.target.value as any
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer text-xs"
                >
                  <option value="calendar_4th">
                    ឈប់សម្រាកសម្រាប់ប្រជុំបច្ចេកទេសប្រចាំខែ (ស្តង់ដារ MoEYS)
                  </option>
                  <option value="always_review">
                    បង្រៀនបំប៉នធម្មតា (មិនឈប់សម្រាកប្រជុំ)
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Save button card */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showSavedToast && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>បានរក្សាទុកការកំណត់ និងបង្កើតកាលវិភាគឡើងវិញដោយជោគជ័យ!</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>រក្សាទុក និងបង្កើតតារាងឡើងវិញ</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
