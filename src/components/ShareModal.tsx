import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  CheckCircle2,
  ExternalLink,
  Globe,
  QrCode,
  Send,
  Users
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicUrl: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  publicUrl
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'កម្មវិធីបង្កើតបំណែងចែកកម្មវិធីសិក្សាស្វ័យប្រវត្តិ MoEYS',
        text: 'សូមប្រើប្រាស់កម្មវិធីបង្កើតបំណែងចែកកម្មវិធីសិក្សាស្វ័យប្រវត្តិ និងកាលវិភាគបង្រៀនថ្នាក់ទី១ ដល់ ទី៦ ស្របតាមស្តង់ដារ MoEYS Cambodia',
        url: publicUrl
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-blue-800" />
            </div>
            <div>
              <h3 className="font-moul text-sm sm:text-base text-slate-900">
                តំណលីងផ្សព្វផ្សាយ (Publish URL)
              </h3>
              <p className="text-xs text-slate-500">
                ចែករំលែកតំណលីងឱ្យលោកគ្រូ-អ្នកគ្រូ ឬសិស្សានុសិស្សប្រើប្រាស់
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Public Link Card */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            តំណលីងកម្មវិធីផ្លូវការ (Shared & Published Link)
          </label>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
            <Globe className="w-4 h-4 text-blue-600 shrink-0 ml-1" />
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="bg-transparent border-none text-xs font-mono text-slate-800 w-full focus:outline-none select-all truncate"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1 shrink-0 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>បានចម្លង</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>ចម្លងលីង</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition text-center"
          >
            <ExternalLink className="w-4 h-4 text-slate-600" />
            <span>បើកមើលក្នុងផ្ទាំងថ្មី</span>
          </a>

          <button
            onClick={handleNativeShare}
            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Send className="w-4 h-4 text-emerald-200" />
            <span>ផ្ញើទៅ Telegram / សង្គម</span>
          </button>
        </div>

        {/* How to publish in AI Studio Guide */}
        <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200/80 text-xs space-y-1.5 text-amber-950">
          <p className="font-bold flex items-center gap-1.5 text-amber-900">
            <span>💡 របៀប Publish ឬ Share លើ Google AI Studio៖</span>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-slate-700 text-[11px] leading-relaxed">
            <li>
              នៅជ្រុងខាងលើខាងស្ដាំនៃផ្ទាំង AI Studio Build សូមចុចលើប៊ូតុង <strong>«Share»</strong>។
            </li>
            <li>
              ជ្រើសរើស <strong>«Anyone with the link»</strong> (អ្នកមានលីងអាចចូលមើលបាន)។
            </li>
            <li>
              ចុច <strong>«Copy link»</strong> រួចយកតំណលីងនោះទៅចែករំលែកជាសាធារណៈបានភ្លាមៗ!
            </li>
          </ol>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            រួចរាល់
          </button>
        </div>
      </div>
    </div>
  );
};
