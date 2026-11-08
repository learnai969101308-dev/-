import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Copy,
  Printer,
  Code2,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { ConfigState, ScheduleRow, SubjectDisplayMode } from '../types';
import { generateGoogleAppsScriptCode } from '../utils/exportUtils';
import { toKhmerNum } from '../data/holidays';

interface ExportPanelProps {
  rows: ScheduleRow[];
  config: ConfigState;
  subjectDisplayMode: SubjectDisplayMode;
  onCopyGoogleSheets: () => void;
  onDownloadExcel: () => void;
  onDownloadCSV: () => void;
  onPrint: () => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  rows,
  config,
  subjectDisplayMode,
  onCopyGoogleSheets,
  onDownloadExcel,
  onDownloadCSV,
  onPrint
}) => {
  const [copiedScript, setCopiedScript] = useState(false);

  const appsScriptCode = generateGoogleAppsScriptCode(
    rows,
    config,
    subjectDisplayMode
  );

  const handleCopyScript = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(appsScriptCode);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2500);
    }
  };

  return (
    <div className="space-y-4 no-print">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 font-moul">
          ការនាំចេញឯកសារ និងស្វ័យប្រវត្តិកម្ម Google Sheets / Excel
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          លោកគ្រូ-អ្នកគ្រូអាចទាញយក ឬចម្លងតារាងកាលវិភាគទៅប្រើប្រាស់ក្នុង Google Sheets, Excel, ឬបោះពុម្ពជាឯកសាររដ្ឋបាលផ្លូវការ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Option 1: Google Sheets Quick Copy */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-white to-white rounded-2xl p-5 border border-emerald-200 shadow-xs flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-moul text-sm text-emerald-950 mb-1">
              ចម្លងដាក់ Google Sheets (១-Click)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              វិធីលឿនបំផុត៖ ចុចប៊ូតុងនេះដើម្បីចម្លងតារាង រួចបើក Google Sheets ទទេមួយ ហើយចុច <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded text-[10px] font-mono font-bold">Ctrl + V</kbd>។
            </p>
          </div>

          <button
            onClick={onCopyGoogleSheets}
            className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Copy className="w-4 h-4" />
            <span>ចម្លងតារាងដាក់ Google Sheet</span>
          </button>
        </div>

        {/* Option 2: Excel (.xls XML) */}
        <div className="bg-gradient-to-br from-blue-500/10 via-white to-white rounded-2xl p-5 border border-blue-200 shadow-xs flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="font-moul text-sm text-blue-950 mb-1">
              ទាញយកជាឯកសារ Excel (.xls)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ទាញយកជាឯកសារ Excel ដែលមានរៀបចំទម្រង់ពណ៌ ក្បាលលិខិតជាតិ និងពុម្ពអក្សរខ្មែរស្អាតបាតរួចជាស្រេច។
            </p>
          </div>

          <button
            onClick={onDownloadExcel}
            className="mt-4 w-full py-2.5 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>ទាញយក Excel (.xls)</span>
          </button>
        </div>

        {/* Option 3: Print / PDF */}
        <div className="bg-gradient-to-br from-indigo-500/10 via-white to-white rounded-2xl p-5 border border-indigo-200 shadow-xs flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
              <Printer className="w-5 h-5" />
            </div>
            <h3 className="font-moul text-sm text-indigo-950 mb-1">
              បោះពុម្ព ឬរក្សាទុកជា PDF
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              បើកទំព័រព្រីនដែលមានក្បាលលិខិតផ្លូវការ MoEYS និងកន្លែងចុះហត្ថលេខា នាយកសាលា និងគ្រូបន្ទុកថ្នាក់។
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={onPrint}
              className="w-full py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>បោះពុម្ព / Save PDF</span>
            </button>
            <button
              onClick={onDownloadCSV}
              className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs border border-slate-200 transition cursor-pointer shrink-0"
              title="ទាញយក CSV"
            >
              CSV
            </button>
          </div>
        </div>
      </div>

      {/* Google Apps Script Box */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-moul text-sm text-slate-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-600" />
              <span>ស្វ័យប្រវត្តិកម្ម Google Apps Script (Macro)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              សម្រាប់គ្រូបង្រៀនដែលចង់បង្កើត Sheet ថ្មីក្នុង Google Drive ស្វ័យប្រវត្តិជាមួយទម្រង់រៀបចំដោយម៉ាក្រូ
            </p>
          </div>

          <button
            onClick={handleCopyScript}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold text-xs transition cursor-pointer shrink-0 shadow-sm"
          >
            {copiedScript ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>បានចម្លងកូដរូចរាល់!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>ចម្លងកូដ Apps Script</span>
              </>
            )}
          </button>
        </div>

        {/* Steps guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs text-slate-600">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="font-bold text-blue-900">ជំហានទី១៖</span> បើក Google Sheets រួចចុចលើម៉ឺនុយ <strong>Extensions &gt; Apps Script</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="font-bold text-blue-900">ជំហានទី២៖</span> លុបកូដចាស់ក្នុងនោះចោល រួច <strong>Paste (Ctrl+V)</strong> កូដខាងក្រោមនេះចូល
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="font-bold text-blue-900">ជំហានទី៣៖</span> ចុច <strong>Save</strong> រួចចុច <strong>Run</strong> ដើម្បីបង្កើតតារាងដោយស្វ័យប្រវត្តិ
          </div>
        </div>

        {/* Code display */}
        <div className="relative">
          <textarea
            readOnly
            value={appsScriptCode}
            rows={10}
            className="w-full p-3 font-mono text-[11px] bg-slate-900 text-emerald-300 rounded-xl border border-slate-800 focus:outline-none select-all"
          />
        </div>
      </div>
    </div>
  );
};
