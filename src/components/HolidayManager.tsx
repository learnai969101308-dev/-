import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  RotateCcw,
  Trash2,
  Calendar,
  Check,
  AlertCircle
} from 'lucide-react';
import { HolidayItem } from '../types';
import { formatKhmerDate, toKhmerNum } from '../data/holidays';

interface HolidayManagerProps {
  holidays: HolidayItem[];
  onUpdateHolidays: (updated: HolidayItem[]) => void;
  onResetToOfficialHolidays: () => void;
  academicYear: string;
}

export const HolidayManager: React.FC<HolidayManagerProps> = ({
  holidays,
  onUpdateHolidays,
  onResetToOfficialHolidays,
  academicYear
}) => {
  const [newDate, setNewDate] = useState('');
  const [newName, setNewName] = useState('');

  const handleToggle = (index: number) => {
    const updated = [...holidays];
    updated[index] = {
      ...updated[index],
      enabled: !updated[index].enabled
    };
    onUpdateHolidays(updated);
  };

  const handleDelete = (index: number) => {
    const updated = [...holidays];
    updated.splice(index, 1);
    onUpdateHolidays(updated);
  };

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate || !newName.trim()) return;

    const updated = [
      ...holidays,
      {
        date: newDate,
        name: newName.trim(),
        enabled: true
      }
    ];

    // Sort by date
    updated.sort((a, b) => a.date.localeCompare(b.date));
    onUpdateHolidays(updated);

    setNewDate('');
    setNewName('');
  };

  const activeCount = holidays.filter((h) => h.enabled).length;

  return (
    <div className="space-y-4 no-print">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 font-moul">
              គ្រប់គ្រងថ្ងៃឈប់សម្រាកបុណ្យជាតិ និងបុណ្យប្រពៃណី
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
              ឆ្នាំសិក្សា {toKhmerNum(academicYear)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            សរុប <strong>{toKhmerNum(holidays.length)}</strong> ថ្ងៃ (កំពុងអនុវត្ត <strong>{toKhmerNum(activeCount)}</strong> ថ្ងៃឈប់សម្រាកក្នុងកាលវិភាគ)
          </p>
        </div>

        <div>
          <button
            onClick={() => {
              if (window.confirm('តើអ្នកចង់កំណត់បញ្ជីថ្ងៃឈប់សម្រាកបុណ្យជាតិផ្លូវការឡើងវិញមែនទេ?')) {
                onResetToOfficialHolidays();
              }
            }}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-300 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>កំណត់បញ្ជីបុណ្យជាតិដើមឡើងវិញ</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Add Custom Holiday Card */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs h-fit">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 mb-3">
            <Plus className="w-4 h-4 text-blue-600" />
            <span>បន្ថែមថ្ងៃឈប់សម្រាក ឬកម្មវិធីសាលា</span>
          </h3>

          <form onSubmit={handleAddHoliday} className="space-y-3 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                កាលបរិច្ឆេទឈប់សម្រាក
              </label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ឈ្មោះថ្ងៃឈប់សម្រាក ឬព្រឹត្តិការណ៍
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="ឧ. ទិវាគ្រូបង្រៀន ឬ កីឡាសាលា..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>បន្ថែមទៅក្នុងប្រតិទិន</span>
            </button>
          </form>

          <div className="mt-4 p-3 rounded-lg bg-slate-50 text-[11px] text-slate-500 leading-relaxed border border-slate-100">
            <p className="font-semibold text-slate-700 mb-1">ចំណាំ៖</p>
            ថ្ងៃឈប់សម្រាកដែលបានបើក (Tick) នឹងត្រូវបានរំលងស្វ័យប្រវត្តិក្នងតារាងបង្រៀន ហើយជំនួសដោយឈ្មោះពិធីបុណ្យនោះ។
          </div>
        </div>

        {/* Holidays List Table */}
        <div className="lg:col-span-2 bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 divide-x divide-slate-200">
                  <th className="py-2.5 px-3 text-center w-12">អនុវត្ត</th>
                  <th className="py-2.5 px-3 whitespace-nowrap w-28">កាលបរិច្ឆេទ</th>
                  <th className="py-2.5 px-3">ឈ្មោះពិធីបុណ្យជាតិ / ព្រឹត្តិការណ៍</th>
                  <th className="py-2.5 px-2 text-center w-14">លុប</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {holidays.map((h, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-50 divide-x divide-slate-200 transition ${
                      !h.enabled ? 'opacity-50 bg-slate-50/50' : 'bg-white'
                    }`}
                  >
                    <td className="py-2 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={h.enabled}
                        onChange={() => handleToggle(idx)}
                        className="rounded border-slate-300 text-blue-900 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap font-medium text-slate-700">
                      <div>{formatKhmerDate(h.date)}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{h.date}</div>
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      {h.name}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        onClick={() => handleDelete(idx)}
                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition cursor-pointer"
                        title="លុបថ្ងៃឈប់សម្រាកនេះ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
