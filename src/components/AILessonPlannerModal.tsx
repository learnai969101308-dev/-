import React, { useState } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  HelpCircle,
  Copy,
  Printer,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileDown
} from 'lucide-react';
import { ConfigState, LessonItem } from '../types';
import { exportLessonPlanToDocx } from '../utils/docxExport';

interface AILessonPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: LessonItem | null;
  subject: string;
  config: ConfigState;
}

export const AILessonPlannerModal: React.FC<AILessonPlannerModalProps> = ({
  isOpen,
  onClose,
  lesson,
  subject,
  config
}) => {
  if (!isOpen || !lesson) return null;

  const [activeTab, setActiveTab] = useState<'plan' | 'quiz'>('plan');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (type: 'plan' | 'quiz') => {
    setIsLoading(true);
    setErrorMsg('');
    setGeneratedText('');

    try {
      const endpoint =
        type === 'plan' ? '/api/generate-lesson-plan' : '/api/generate-quiz';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: config.gradeLabel,
          subject,
          chapter: lesson.chapter,
          title: lesson.title,
          outcome: lesson.outcome,
          pages: lesson.pages,
          hours: lesson.hours,
          schoolName: config.schoolName,
          teacherName: config.teacherName
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'មានបញ្ហាក្នុងការបង្កើតមាតិកា។');
      }

      setGeneratedText(data.content || '');
    } catch (err: any) {
      setErrorMsg(err.message || 'មិនអាចបង្កើតកិច្ចតែងការបានទេ។');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText && generatedText) {
      navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>${lesson.title} - MoEYS Lesson Plan</title>
          <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&family=Moul&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Kantumruy Pro', sans-serif; padding: 24px; line-height: 1.6; }
            h1, h2, h3 { font-family: 'Moul', serif; color: #1e3a8a; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { border: 1px solid #334155; padding: 8px; text-align: left; }
            th { background: #f1f5f9; }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 24px;">
            <h3>ព្រះរាជាណាចក្រកម្ពុជា</h3>
            <h3>ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
            <p><strong>${config.schoolName}</strong> - ថ្នាក់៖ <strong>${config.gradeLabel}</strong></p>
          </div>
          <pre style="white-space: pre-wrap; font-family: inherit;">${generatedText}</pre>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  const [isExportingDocx, setIsExportingDocx] = useState(false);

  const handleDownloadDocx = async () => {
    if (!generatedText) return;
    try {
      setIsExportingDocx(true);
      await exportLessonPlanToDocx({
        markdownText: generatedText,
        schoolName: config.schoolName,
        teacherName: config.teacherName,
        grade: config.gradeLabel,
        subject,
        chapter: lesson.chapter,
        title: lesson.title,
        outcome: lesson.outcome,
        hours: lesson.hours,
        pages: lesson.pages
      });
    } catch (err: any) {
      console.error('Failed to export DOCX:', err);
    } finally {
      setIsExportingDocx(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-purple-950 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-moul text-sm sm:text-base">
                ជំនួយការ AI កិច្ចតែងការបង្រៀន & លំហាត់ (MoEYS)
              </h3>
              <p className="text-xs text-purple-200">
                ដំណើរការដោយ Gemini 3.8 Flash • បង្កើតកិច្ចតែងការ ៥ ជំហាន ឬលំហាត់សិស្ស
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-purple-200 hover:text-white rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Lesson Info Card */}
        <div className="p-4 bg-purple-50/60 border-b border-purple-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-purple-900">{subject}</span>
              <span>•</span>
              <span className="font-semibold text-slate-800">{lesson.chapter}</span>
              {lesson.pages && (
                <span className="px-2 py-0.5 rounded-full bg-white border border-purple-200 text-purple-800 text-[10px]">
                  {lesson.pages}
                </span>
              )}
            </div>
            <p className="font-bold text-slate-900 text-sm mt-0.5">{lesson.title}</p>
            {lesson.outcome && (
              <p className="text-slate-600 text-xs mt-0.5">
                វត្ថុបំណង៖ {lesson.outcome}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('plan');
                handleGenerate('plan');
              }}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'plan'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-white text-purple-900 border border-purple-200 hover:bg-purple-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>កិច្ចតែងការ ៥ ជំហាន</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('quiz');
                handleGenerate('quiz');
              }}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-white text-purple-900 border border-purple-200 hover:bg-purple-100'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>កម្រងសំណួរ & លំហាត់</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-slate-800 space-y-4">
          {isLoading && (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
              <p className="font-bold text-slate-800 text-sm">
                កំពុងបង្កើត{activeTab === 'plan' ? 'កិច្ចតែងការបង្រៀនស្តង់ដារ ៥ ជំហាន' : 'កម្រងសំណួរ និងលំហាត់អនុវត្ត'}...
              </p>
              <p className="text-xs text-slate-500">
                សូមរង់ចាំបន្តិច ប្រព័ន្ធកំពុងរៀបចំតាមគរុកោសល្យ MoEYS
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">បរាជ័យក្នុងការបង្កើត</p>
                  <p className="mt-0.5 text-xs text-rose-700 leading-relaxed">
                    {errorMsg.includes('503') || errorMsg.includes('high demand') || errorMsg.includes('UNAVAILABLE')
                      ? 'ម៉ាស៊ីនបម្រើ AI កំពុងមានសំណើច្រើនក្នុងពេលតែមួយ (High Demand)។ សូមចុចប៊ូតុង "ព្យាយាមម្តងទៀត" ខាងក្រោម ប្រព័ន្ធនឹងប្តូរទៅម៉ូដែលជំនួសដោយស្វ័យប្រវត្តិ។'
                      : errorMsg}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleGenerate(activeTab)}
                disabled={isLoading}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs shrink-0 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>ព្យាយាមម្តងទៀត (Retry)</span>
              </button>
            </div>
          )}

          {!isLoading && !generatedText && !errorMsg && (
            <div className="py-16 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-purple-300 mx-auto" />
              <h4 className="font-moul text-slate-700 text-sm">
                ចុចប៊ូតុងខាងលើដើម្បីបង្កើតកិច្ចតែងការបង្រៀន ឬលំហាត់សិស្ស
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                AI នឹងជួយរៀបចំជំហានទី១ ដល់ ទី៥ (រដ្ឋបាលថ្នាក់, រំលឹកមេរៀនចាស់, មេរៀនថ្មី, ពង្រឹងចំណេះដឹង, បណ្តាំផ្ញើ) ស្របតាមសៀវភៅគ្រូ និងសៀវភៅសិស្ស។
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleGenerate('plan')}
                  className="px-5 py-2.5 bg-purple-700 hover:bg-purple-600 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>បង្កើតកិច្ចតែងការបង្រៀនឥឡូវនេះ</span>
                </button>
              </div>
            </div>
          )}

          {generatedText && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-purple-900 uppercase">
                  {activeTab === 'plan' ? 'កិច្ចតែងការបង្រៀនស្តង់ដារ ៥ ជំហាន' : 'សំណួរតេស្ត និងលំហាត់សិស្ស'}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {activeTab === 'plan' && (
                    <button
                      onClick={handleDownloadDocx}
                      disabled={isExportingDocx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white text-xs font-semibold transition cursor-pointer shadow-sm"
                      title="ទាញយកជាឯកសារ Microsoft Word (.docx)"
                    >
                      <FileDown className="w-3.5 h-3.5 text-blue-200" />
                      <span>{isExportingDocx ? 'កំពុងបង្កើត Docx...' : 'ទាញយក Word (.docx)'}</span>
                    </button>
                  )}

                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>បានចម្លង</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>ចម្លង</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>បោះពុម្ព</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {generatedText}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {config.schoolName} • ថ្នាក់៖ {config.gradeLabel}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition cursor-pointer"
          >
            បិទ
          </button>
        </div>
      </div>
    </div>
  );
};
