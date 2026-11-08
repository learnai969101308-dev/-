import { HolidayItem } from '../types';

export const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

export function toKhmerNum(num: number | string): string {
  if (num === null || num === undefined) return '';
  return String(num).replace(/[0-9]/g, (d) => KHMER_DIGITS[parseInt(d, 10)] ?? d);
}

export const KHMER_DAYS = [
  'អាទិត្យ',
  'ចន្ទ',
  'អង្គារ',
  'ពុធ',
  'ព្រហស្បតិ៍',
  'សុក្រ',
  'សៅរ៍'
];

export const KHMER_MONTHS = [
  'មករា',
  'កុម្ភៈ',
  'មីនា',
  'មេសា',
  'ឧសភា',
  'មិថុនា',
  'កក្កដា',
  'សីហា',
  'កញ្ញា',
  'តុលា',
  'វិច្ឆិកា',
  'ធ្នូ'
];

export function parseLocalDate(isoStr: string): Date {
  if (!isoStr) return new Date();
  const parts = isoStr.split('-').map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2] || 1);
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatKhmerDate(isoStr: string): string {
  if (!isoStr) return '';
  const [y, m, d] = isoStr.split('-').map(Number);
  const khD = toKhmerNum(d);
  const khM = KHMER_MONTHS[m - 1] || '';
  const khY = toKhmerNum(y);
  return `${khD} ${khM} ${khY}`;
}

export interface LunarHolidaySet {
  water: [string, string, string];
  meak: string;
  visak: string;
  plough: string;
  pchum: [string, string, string];
}

export const LUNAR_HOLIDAYS_BY_YEAR: Record<number, LunarHolidaySet> = {
  2024: {
    water: ['2024-11-14', '2024-11-15', '2024-11-16'],
    meak: '2025-02-12',
    visak: '2025-05-11',
    plough: '2025-05-15',
    pchum: ['2025-09-21', '2025-09-22', '2025-09-23']
  },
  2025: {
    water: ['2025-11-04', '2025-11-05', '2025-11-06'],
    meak: '2026-02-01',
    visak: '2026-05-31',
    plough: '2026-06-04',
    pchum: ['2026-10-10', '2026-10-11', '2026-10-12']
  },
  2026: {
    water: ['2026-11-23', '2026-11-24', '2026-11-25'],
    meak: '2027-02-20',
    visak: '2027-05-20',
    plough: '2027-05-24',
    pchum: ['2027-09-29', '2027-09-30', '2027-10-01']
  },
  2027: {
    water: ['2027-11-12', '2027-11-13', '2027-11-14'],
    meak: '2028-02-09',
    visak: '2028-05-08',
    plough: '2028-05-12',
    pchum: ['2028-09-18', '2028-09-19', '2028-09-20']
  },
  2028: {
    water: ['2028-11-01', '2028-11-02', '2028-11-03'],
    meak: '2029-01-29',
    visak: '2029-05-27',
    plough: '2029-05-31',
    pchum: ['2029-10-06', '2029-10-07', '2029-10-08']
  },
  2029: {
    water: ['2029-11-20', '2029-11-21', '2029-11-22'],
    meak: '2030-02-17',
    visak: '2030-05-16',
    plough: '2030-05-20',
    pchum: ['2030-09-26', '2030-09-27', '2030-09-28']
  },
  2030: {
    water: ['2030-11-09', '2030-11-10', '2030-11-11'],
    meak: '2031-02-06',
    visak: '2031-05-06',
    plough: '2031-05-10',
    pchum: ['2031-10-15', '2031-10-16', '2031-10-17']
  }
};

export function getHolidaysForAcademicYear(startYear: number): HolidayItem[] {
  const y1 = Number(startYear);
  const y2 = y1 + 1;
  const lunar = LUNAR_HOLIDAYS_BY_YEAR[y1] || {
    water: [`${y1}-11-12`, `${y1}-11-13`, `${y1}-11-14`] as [string, string, string],
    meak: `${y2}-02-10`,
    visak: `${y2}-05-10`,
    plough: `${y2}-05-14`,
    pchum: [`${y2}-10-05`, `${y2}-10-06`, `${y2}-10-07`] as [string, string, string]
  };

  return [
    { date: lunar.water[0], name: 'ព្រះរាជពិធីបុណ្យអុំទូក បណ្ដែតប្រទីប និងសំពះព្រះខែ អកអំបុក (ថ្ងៃទី១)', enabled: true },
    { date: lunar.water[1], name: 'ព្រះរាជពិធីបុណ្យអុំទូក បណ្ដែតប្រទីប និងសំពះព្រះខែ អកអំបុក (ថ្ងៃទី២)', enabled: true },
    { date: lunar.water[2], name: 'ព្រះរាជពិធីបុណ្យអុំទូក បណ្ដែតប្រទីប និងសំពះព្រះខែ អកអំបុក (ថ្ងៃទី៣)', enabled: true },
    { date: `${y1}-11-09`, name: 'ទិវាបុណ្យឯករាជ្យជាតិ (៩ វិច្ឆិកា)', enabled: true },
    { date: `${y1}-12-29`, name: 'ទិវាសន្តិភាពនៅកម្ពុជា (២៩ ធ្នូ)', enabled: true },
    { date: `${y2}-01-01`, name: 'ទិវាចូលឆ្នាំសកល (១ មករា)', enabled: true },
    { date: `${y2}-01-07`, name: 'ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍ (៧ មករា)', enabled: true },
    { date: lunar.meak, name: 'ពិធីបុណ្យមាឃបូជា', enabled: true },
    { date: `${y2}-03-08`, name: 'ទិវាអន្តរជាតិនារី (៨ មីនា)', enabled: true },
    { date: `${y2}-04-14`, name: 'ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិ (មហាសង្ក្រាន្ត)', enabled: true },
    { date: `${y2}-04-15`, name: 'ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិ (វនបត)', enabled: true },
    { date: `${y2}-04-16`, name: 'ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិ (ឡើងស័ក)', enabled: true },
    { date: `${y2}-05-01`, name: 'ទិវាពលកម្មអន្តរជាតិ (១ ឧសភា)', enabled: true },
    { date: `${y2}-05-14`, name: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះករុណាព្រះបាទសម្ដេចព្រះបរមនាថ នរោត្តម សីហមុនី', enabled: true },
    { date: lunar.visak, name: 'ពិធីបុណ្យវិសាខបូជា', enabled: true },
    { date: lunar.plough, name: 'ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល', enabled: true },
    { date: `${y2}-06-18`, name: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម សម្តេចព្រះមហាក្សត្រី នរោត្តម មុនិនាថ សីហនុ ព្រះវររាជមាតាជាតិខ្មែរ', enabled: true },
    { date: `${y2}-09-24`, name: 'ទិវាប្រកាសរដ្ឋធម្មនុញ្ញ (២៤ កញ្ញា)', enabled: true },
    { date: lunar.pchum[0], name: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ (ថ្ងៃទី១)', enabled: true },
    { date: lunar.pchum[1], name: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ (ថ្ងៃទី២)', enabled: true },
    { date: lunar.pchum[2], name: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ (ថ្ងៃទី៣)', enabled: true },
    { date: `${y2}-10-15`, name: 'ទិវាគោរពព្រះវិញ្ញាណក្ខន្ធ ព្រះករុណាព្រះបាទសម្តេចព្រះ នរោត្តម សីហនុ ព្រះបរមរតនកោដ្ឋ', enabled: true },
    { date: `${y2}-10-29`, name: 'ព្រះរាជពិធីបុណ្យគ្រងព្រះបរមរាជសម្បត្តិ (២៩ តុលា)', enabled: true }
  ];
}
