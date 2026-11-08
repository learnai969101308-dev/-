import React, { useState } from 'react';
import {
  Plus,
  FileUp,
  RotateCcw,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  BookOpen,
  Check,
  X,
  Search
} from 'lucide-react';
import { LessonItem, SubjectKey, SubjectLessons } from '../types';
import { GRADE_PRESETS } from '../data/curricula';
import { toKhmerNum } from '../data/holidays';

interface LessonManagerProps {
  lessons: SubjectLessons;
  onUpdateLessons: (updated: SubjectLessons) => void;
  selectedGradeKey: string;
  onGradeChange: (key: string) => void;
  onResetSubjectToPreset: (subject: SubjectKey) => void;
  onResetAllToPreset: () => void;
}

export const LessonManager: React.FC<LessonManagerProps> = ({
  lessons,
  onUpdateLessons,
  selectedGradeKey,
  onGradeChange,
  onResetSubjectToPreset,
  onResetAllToPreset
}) => {
  const [activeSubject, setActiveSubject] = useState<SubjectKey>('khmer');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form state for Add/Edit
  const [lessonForm, setLessonForm] = useState<LessonItem>({
    chapter: '',
    title: '',
    outcome: '',
    hours: '១ម៉',
    page_ss: '',
    page_sg: '',
    days: 1,
    pages: ''
  });

  // Bulk Import state
  const [bulkText, setBulkText] = useState('');
  const [bulkReplace, setBulkReplace] = useState(false);

  const currentList = lessons[activeSubject] || [];

  const filteredLessons = currentList.filter((item) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      item.chapter.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.outcome.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setLessonForm({
      chapter: `មេរៀនទី${toKhmerNum(currentList.length + 1)}`,
      title: '',
      outcome: '',
      hours: '១ម៉',
      page_ss: '',
      page_sg: '',
      days: 1,
      pages: ''
    });
    setEditingIndex(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (idx: number) => {
    const item = currentList[idx];
    setLessonForm({ ...item });
    setEditingIndex(idx);
    setIsAddModalOpen(true);
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonForm.title.trim()) return;

    let pages = '';
    if (lessonForm.page_ss && lessonForm.page_sg) {
      pages = `ស.ស ${lessonForm.page_ss} / ស.គ ${lessonForm.page_sg}`;
    } else if (lessonForm.page_ss) {
      pages = `${lessonForm.page_ss}`;
    } else if (lessonForm.page_sg) {
      pages = `ស.គ ${lessonForm.page_sg}`;
    }

    const updatedItem = {
      ...lessonForm,
      pages
    };

    const nextList = [...currentList];
    if (editingIndex !== null) {
      nextList[editingIndex] = updatedItem;
    } else {
      nextList.push(updatedItem);
    }

    onUpdateLessons({
      ...lessons,
      [activeSubject]: nextList
    });

    setIsAddModalOpen(false);
  };

  const handleDelete = (idx: number) => {
    if (window.confirm('តើអ្នកពិតជាចង់លុបមេរៀននេះមែនទេ?')) {
      const nextList = [...currentList];
      nextList.splice(idx, 1);
      onUpdateLessons({
        ...lessons,
        [activeSubject]: nextList
      });
    }
  };

  const handleMove = (idx: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && idx === 0) ||
      (direction === 'down' && idx === currentList.length - 1)
    ) {
      return;
    }
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const nextList = [...currentList];
    const temp = nextList[idx];
    nextList[idx] = nextList[targetIdx];
    nextList[targetIdx] = temp;
    onUpdateLessons({
      ...lessons,
      [activeSubject]: nextList
    });
  };

  const handleBulkImport = () => {
    const raw = bulkText.trim();
    if (!raw) {
      setIsBulkModalOpen(false);
      return;
    }

    const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const parsed: LessonItem[] = lines.map((line, idx) => {
      const parts = line.includes('|')
        ? line.split('|').map((s) => s.trim())
        : line.split('\t').map((s) => s.trim());

      if (parts.length >= 2) {
        const chapter = parts[0] || `មេរៀនទី${toKhmerNum(idx + 1)}`;
        const title = parts[1] || line;
        const outcome = parts[2] || '';
        const days = Math.max(1, Number(parts[3]) || 1);
        const page_ss = parts[4] || '';
        const page_sg = parts[5] || '';
        let pages = '';
        if (page_ss && page_sg) pages = `ស.ស ${page_ss} / ស.គ ${page_sg}`;
        else if (page_ss) pages = page_ss;
        else if (page_sg) pages = `ស.គ ${page_sg}`;

        return {
          chapter,
          title,
          outcome,
          hours: '១ម៉',
          days,
          page_ss,
          page_sg,
          pages
        };
      }

      return {
        chapter: `មេរៀនទី${toKhmerNum(idx + 1)}`,
        title: line,
        outcome: '',
        hours: '១ម៉',
        days: 1,
        page_ss: '',
        page_sg: '',
        pages: ''
      };
    });

    const nextList = bulkReplace ? parsed : [...currentList, ...parsed];
    onUpdateLessons({
      ...lessons,
      [activeSubject]: nextList
    });

    setBulkText('');
    setIsBulkModalOpen(false);
  };

  const getSubjLabel = (k: SubjectKey) => {
    switch (k) {
      case 'khmer':
        return 'ភាសាខ្មែរ';
      case 'math':
        return 'គណិតវិទ្យា';
      case 'science':
        return 'វិទ្យាសាស្ត្រ';
      case 'social':
        return 'សិក្សាសង្គម';
    }
  };

  return (
    <div className="space-y-4 no-print">
      {/* Top action header */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 font-moul">
              គ្រប់គ្រង និងកែសម្រួលបញ្ជីមេរៀន
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {GRADE_PRESETS.find((g) => g.key === selectedGradeKey)?.label || 'ថ្នាក់ទី៦'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            លោកគ្រូ-អ្នកគ្រូអាចបន្ថែម កែប្រែ លុប រៀបលំដាប់ ឬនាំចូលមេរៀនពីឯកសារខាងក្រៅ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAdd}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>បន្ថែមមេរៀនថ្មី</span>
          </button>

          <button
            onClick={() => setIsBulkModalOpen(true)}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-xs transition cursor-pointer"
          >
            <FileUp className="w-4 h-4" />
            <span>នាំចូលជាក្រុម (Bulk Import)</span>
          </button>

          <button
            onClick={() => {
              if (
                window.confirm(
                  `តើអ្នកចង់កំណត់មេរៀនមុខវិជ្ជា ${getSubjLabel(
                    activeSubject
                  )} ត្រឡប់មកតាមកម្មវិធី MoEYS ដើមវិញមែនទេ?`
                )
              ) {
                onResetSubjectToPreset(activeSubject);
              }
            }}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-300 transition cursor-pointer"
            title="កំណត់បញ្ជីមេរៀនមុខវិជ្ជានេះឡើងវិញតាម MoEYS"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>កំណត់ឡើងវិញតាម MoEYS</span>
          </button>
        </div>
      </div>

      {/* Subject tabs and Search */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
            {(['khmer', 'math', 'science', 'social'] as SubjectKey[]).map((sk) => (
              <button
                key={sk}
                onClick={() => setActiveSubject(sk)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeSubject === sk
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {getSubjLabel(sk)} ({toKhmerNum(lessons[sk]?.length || 0)})
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ស្វែងរកមេរៀន..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Lesson Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 divide-x divide-slate-200">
                <th className="py-2.5 px-2 text-center w-10">ល.រ</th>
                <th className="py-2.5 px-3 min-w-[130px]">ជំពូក / ផ្នែក</th>
                <th className="py-2.5 px-3 min-w-[200px]">ចំណងជើងមេរៀន</th>
                <th className="py-2.5 px-3 min-w-[240px]">វត្ថុបំណង / លទ្ធផលរំពឹងទុក</th>
                <th className="py-2.5 px-2 text-center w-14">ម៉ោង</th>
                <th className="py-2.5 px-2 text-center w-14">ចំនួនថ្ងៃ</th>
                <th className="py-2.5 px-2 text-center w-20">ទំព័រ ស.ស</th>
                <th className="py-2.5 px-2 text-center w-20">ទំព័រ ស.គ</th>
                <th className="py-2.5 px-2 text-center w-28">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLessons.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    មិនមានមេរៀនត្រូវបង្ហាញទេ។
                  </td>
                </tr>
              ) : (
                filteredLessons.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50 divide-x divide-slate-200 transition"
                  >
                    <td className="py-2 px-1 text-center font-medium text-slate-500">
                      {toKhmerNum(idx + 1)}
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      {item.chapter}
                    </td>
                    <td className="py-2 px-3 text-slate-900 font-medium">
                      {item.title}
                    </td>
                    <td className="py-2 px-3 text-slate-600 leading-relaxed">
                      {item.outcome || '—'}
                    </td>
                    <td className="py-2 px-1.5 text-center text-slate-700 whitespace-nowrap">
                      {item.hours || '១ម៉'}
                    </td>
                    <td className="py-2 px-1.5 text-center text-slate-700 font-semibold">
                      {toKhmerNum(item.days || 1)}
                    </td>
                    <td className="py-2 px-1 text-center text-slate-700 whitespace-nowrap">
                      {item.page_ss ? toKhmerNum(item.page_ss) : '—'}
                    </td>
                    <td className="py-2 px-1 text-center text-slate-700 whitespace-nowrap">
                      {item.page_sg ? toKhmerNum(item.page_sg) : '—'}
                    </td>
                    <td className="py-2 px-2 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleMove(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                          title="រំកិលឡើងលើ"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMove(idx, 'down')}
                          disabled={idx === currentList.length - 1}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                          title="រំកិលចុះក្រោម"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(idx)}
                          className="p-1 rounded text-blue-600 hover:bg-blue-50 cursor-pointer"
                          title="កែសម្រួល"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(idx)}
                          className="p-1 rounded text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="លុប"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Lesson Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-moul text-base text-slate-900">
                {editingIndex !== null ? 'កែសម្រួលមេរៀន' : 'បន្ថែមមេរៀនថ្មី'} ({getSubjLabel(activeSubject)})
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-3.5 mt-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ជំពូក ឬផ្នែក
                </label>
                <input
                  type="text"
                  required
                  value={lessonForm.chapter}
                  onChange={(e) => setLessonForm({ ...lessonForm, chapter: e.target.value })}
                  placeholder="ឧ. មេរៀនទី១ ឬ ជំពូកទី១..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ចំណងជើងមេរៀន (ខ្លឹមសារសៀវភៅសិក្សាគោល)
                </label>
                <input
                  type="text"
                  required
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="ឧ. ព្យញ្ជនៈ ផ្សំស្រៈ..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  វត្ថុបំណង ឬលទ្ធផលរំពឹងទុក
                </label>
                <textarea
                  rows={2}
                  value={lessonForm.outcome}
                  onChange={(e) => setLessonForm({ ...lessonForm, outcome: e.target.value })}
                  placeholder="ឧ. សិស្សអាចអាន និងសរសេរពាក្យបានត្រឹមត្រូវ..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ម៉ោងបង្រៀន
                  </label>
                  <input
                    type="text"
                    value={lessonForm.hours}
                    onChange={(e) => setLessonForm({ ...lessonForm, hours: e.target.value })}
                    placeholder="១ម៉ ឬ ២ម៉"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ចំនួនថ្ងៃបង្រៀន (Days)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={lessonForm.days}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, days: Math.max(1, parseInt(e.target.value) || 1) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ទំព័រសៀវភៅសិស្ស (ស.ស)
                  </label>
                  <input
                    type="text"
                    value={lessonForm.page_ss}
                    onChange={(e) => setLessonForm({ ...lessonForm, page_ss: e.target.value })}
                    placeholder="ឧ. ១-២"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ទំព័រសៀវភៅគ្រូ (ស.គ)
                  </label>
                  <input
                    type="text"
                    value={lessonForm.page_sg}
                    onChange={(e) => setLessonForm({ ...lessonForm, page_sg: e.target.value })}
                    placeholder="ឧ. ៥-៦"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition cursor-pointer"
                >
                  រក្សាទុក
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-moul text-base text-slate-900">
                នាំចូលមេរៀនជាច្រើន (Bulk Import)
              </h3>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mt-4 text-xs sm:text-sm">
              <div className="bg-blue-50 p-3 rounded-lg text-blue-900 text-xs leading-relaxed">
                <p className="font-bold mb-1">ទម្រង់ចម្លងបិទភ្ជាប់ (១ជួរ = ១មេរៀន)៖</p>
                <code className="block bg-white p-2 rounded border border-blue-200 text-slate-800 font-mono text-[11px]">
                  ជំពូក | ចំណងជើងមេរៀន | វត្ថុបំណង | ចំនួនថ្ងៃ | ទំព័រ ស.ស | ទំព័រ ស.គ
                </code>
                <p className="mt-1 text-[11px] text-blue-700">
                  (អាចប្រើសញ្ញាបញ្ឈរ | ឬចុច Tab ចន្លោះទិន្នន័យនីមួយៗ)
                </p>
              </div>

              <textarea
                rows={8}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="មេរៀនទី១ | អានព្យញ្ជនៈ ក | ស្គាល់តួអក្សរ | 1 | 1 | 5&#10;មេរៀនទី២ | អានព្យញ្ជនៈ ខ | ស្គាល់តួអក្សរ | 1 | 2 | 6"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-xs"
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chkReplaceAll"
                  checked={bulkReplace}
                  onChange={(e) => setBulkReplace(e.target.checked)}
                  className="rounded border-slate-300 text-blue-900 focus:ring-blue-500"
                />
                <label htmlFor="chkReplaceAll" className="text-xs text-slate-700">
                  ជំនួសបញ្ជីមេរៀនចាស់ទាំងអស់នៃមុខវិជ្ជា {getSubjLabel(activeSubject)}
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="button"
                  onClick={handleBulkImport}
                  className="px-4 py-2 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition cursor-pointer"
                >
                  នាំចូលមេរៀន
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
