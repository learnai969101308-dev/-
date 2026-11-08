import { GradeCurriculum, LessonItem, SubjectLessons } from '../types';
import bundleRaw from './curriculaBundle.json';

interface BundleData {
  b: number;
  t: string[];
  m: string[];
  s: string[];
  d: Record<
    string,
    {
      label: string;
      khmer?: number[][];
      math?: number[][];
      science?: number[][];
      social?: number[][];
    }
  >;
}

const bundle = bundleRaw as BundleData;

const B62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const B62_MAP: Record<string, number> = {};
for (let i = 0; i < 62; i++) {
  B62_MAP[B62[i]] = i;
}

const toks = bundle.t.slice();

function decStr(cs: string): string {
  if (!cs) return '';
  let out = '';
  for (let i = 0; i < cs.length; i += 2) {
    const idx = (B62_MAP[cs[i]] ?? 0) * 62 + (B62_MAP[cs[i + 1]] ?? 0);
    out += toks[idx] || '';
  }
  return out;
}

for (let i = 0; i < bundle.m.length; i++) {
  const targetIdx = bundle.b + i;
  while (toks.length <= targetIdx) {
    toks.push('');
  }
  toks[targetIdx] = decStr(bundle.m[i]);
}

const strPool = bundle.s.map((s) => decStr(s));

export const PRESET_CURRICULA: Record<string, GradeCurriculum> = {};

for (const gk of Object.keys(bundle.d)) {
  const gsrc = bundle.d[gk];
  const gradeObj: GradeCurriculum = {
    label: gsrc.label,
    khmer: [],
    math: [],
    science: [],
    social: []
  };

  const subjectKeys: Array<'khmer' | 'math' | 'science' | 'social'> = [
    'khmer',
    'math',
    'science',
    'social'
  ];

  for (const sk of subjectKeys) {
    const rawRows =
      sk === 'science' && (!gsrc.science || gsrc.science.length === 0)
        ? gsrc.social || []
        : gsrc[sk] || [];

    gradeObj[sk] = rawRows.map((r) => {
      const chapter = strPool[r[0]] || '';
      const title = strPool[r[1]] || '';
      const outcome = strPool[r[2]] || '';
      const hours = strPool[r[3]] || '១ម៉';
      const page_ss = strPool[r[4]] || '';
      const page_sg = strPool[r[5]] || '';
      let pages = '';
      if (page_ss && page_sg) pages = `ស.ស ${page_ss} / ស.គ ${page_sg}`;
      else if (page_ss) pages = `${page_ss}`;
      else if (page_sg) pages = `ស.គ ${page_sg}`;

      return {
        chapter:
          sk === 'science' && (!gsrc.science || gsrc.science.length === 0)
            ? `${chapter} (វិទ្យាសាស្ត្រ-សង្គម)`
            : chapter,
        title,
        outcome,
        hours,
        page_ss,
        page_sg,
        days: 1,
        pages
      };
    });
  }

  PRESET_CURRICULA[gk] = gradeObj;
}

export const GRADE_PRESETS: Array<{ key: string; label: string }> = [
  { key: 'grade1', label: 'ថ្នាក់ទី១' },
  { key: 'grade2', label: 'ថ្នាក់ទី២' },
  { key: 'grade3', label: 'ថ្នាក់ទី៣' },
  { key: 'grade4', label: 'ថ្នាក់ទី៤' },
  { key: 'grade5', label: 'ថ្នាក់ទី៥' },
  { key: 'grade6', label: 'ថ្នាក់ទី៦ (ក)' }
];

export function getCurriculumForGrade(gradeKey: string): SubjectLessons {
  const p = PRESET_CURRICULA[gradeKey] || PRESET_CURRICULA['grade6'];
  return {
    khmer: JSON.parse(JSON.stringify(p.khmer)),
    math: JSON.parse(JSON.stringify(p.math)),
    science: JSON.parse(JSON.stringify(p.science)),
    social: JSON.parse(JSON.stringify(p.social))
  };
}
