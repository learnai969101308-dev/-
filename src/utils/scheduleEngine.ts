import { ConfigState, DayType, HolidayItem, LessonItem, ScheduleRow, SubjectLessons } from '../types';
import {
  formatKhmerDate,
  KHMER_DAYS,
  KHMER_MONTHS,
  parseLocalDate,
  toISODate,
  toKhmerNum
} from '../data/holidays';

export interface FlattenedLesson extends LessonItem {
  fullText: string;
}

export function flattenSubjectQueue(lessons: LessonItem[]): FlattenedLesson[] {
  const queue: FlattenedLesson[] = [];
  (lessons || []).forEach((item) => {
    const pagesInfo = item.pages ? ` (${item.pages})` : '';
    const hoursInfo = item.hours ? ` [${item.hours}]` : '';
    const full = `${item.chapter} ៖ ${item.title}${pagesInfo}${hoursInfo}`;
    const days = Math.max(1, Number(item.days) || 1);
    for (let i = 0; i < days; i++) {
      queue.push({
        ...item,
        fullText: full
      });
    }
  });
  return queue;
}

export function generateSchedule(
  cfg: ConfigState,
  lessons: SubjectLessons,
  holidays: HolidayItem[]
): ScheduleRow[] {
  const start = parseLocalDate(cfg.startDate);
  const end = parseLocalDate(cfg.endDate);
  const smallVacS = parseLocalDate(cfg.smallVacStart);
  const smallVacE = parseLocalDate(cfg.smallVacEnd);
  const bigVacS = parseLocalDate(cfg.bigVacStart);
  const bigVacE = parseLocalDate(cfg.bigVacEnd);

  const holidayMap = new Map<string, string>();
  holidays.forEach((h) => {
    if (h.enabled && h.date) {
      holidayMap.set(h.date, h.name);
    }
  });

  const queues = {
    khmer: flattenSubjectQueue(lessons.khmer),
    math: flattenSubjectQueue(lessons.math),
    science: flattenSubjectQueue(lessons.science),
    social: flattenSubjectQueue(lessons.social)
  };

  const pointers = { khmer: 0, math: 0, science: 0, social: 0 };
  const rows: ScheduleRow[] = [];

  let diagnosticRemaining = Number(cfg.diagnosticDays) || 0;
  let diagnosticCounter = 0;
  let recentKhmerTopics: string[] = [];
  let recentMathTopics: string[] = [];

  const cur = new Date(start.getTime());
  let rowNum = 0;
  const finalCalendarDate = bigVacE > end ? bigVacE : end;

  while (cur <= finalCalendarDate) {
    const iso = toISODate(cur);
    const dow = cur.getDay(); // 0=Sun, 1=Mon, ..., 4=Thu, 6=Sat
    const dom = cur.getDate();
    const monthIdx = cur.getMonth();
    const yearNum = cur.getFullYear();
    const nthWeekdayOfMonth = Math.ceil(dom / 7);

    const monthLabel = `ខែ${KHMER_MONTHS[monthIdx]} ${toKhmerNum(yearNum)}`;
    const weekOfMonthLabel = `សប្តាហ៍ទី${toKhmerNum(nthWeekdayOfMonth)}`;

    if (dow === 1) {
      recentKhmerTopics = [];
      recentMathTopics = [];
    }

    const isWeekendOff =
      dow === 0 || (Number(cfg.studyDaysPerWeek) === 5 && dow === 6);
    const isBigVacation = cur >= bigVacS && cur <= bigVacE && cur > end;
    const isSmallVacation = cur >= smallVacS && cur <= smallVacE;
    const holidayName = holidayMap.get(iso);

    let dayType: DayType = 'TEACHING';
    let statusLabel = 'ថ្ងៃសិក្សាធម្មតា';
    let khmerCell = '';
    let mathCell = '';
    let sciCell = '';
    let socCell = '';
    let khmerObj: LessonItem | undefined;
    let mathObj: LessonItem | undefined;
    let sciObj: LessonItem | undefined;
    let socObj: LessonItem | undefined;
    let noteCell = '';

    if (isBigVacation) {
      dayType = 'VACATION_BIG';
      statusLabel = 'វិស្សមកាលធំ (ឈប់សម្រាកបញ្ចប់ឆ្នាំសិក្សា)';
      khmerCell = '[ឈប់សម្រាក] វិស្សមកាលធំ';
      mathCell = '[ឈប់សម្រាក] វិស្សមកាលធំ';
      sciCell = '[ឈប់សម្រាក] វិស្សមកាលធំ';
      socCell = '[ឈប់សម្រាក] វិស្សមកាលធំ';
      noteCell = 'វិស្សមកាលធំបញ្ចប់ឆ្នាំសិក្សា';
    } else if (isWeekendOff) {
      dayType = 'WEEKEND_OFF';
      statusLabel = 'ថ្ងៃឈប់សម្រាកចុងសប្តាហ៍';
      khmerCell = '—';
      mathCell = '—';
      sciCell = '—';
      socCell = '—';
      noteCell = 'ថ្ងៃសម្រាកចុងសប្តាហ៍';
    } else if (holidayName) {
      dayType = 'HOLIDAY';
      statusLabel = `បុណ្យជាតិ៖ ${holidayName}`;
      khmerCell = `[ឈប់សម្រាក] ${holidayName}`;
      mathCell = `[ឈប់សម្រាក] ${holidayName}`;
      sciCell = `[ឈប់សម្រាក] ${holidayName}`;
      socCell = `[ឈប់សម្រាក] ${holidayName}`;
      noteCell = holidayName;
    } else if (isSmallVacation) {
      dayType = 'VACATION_SMALL';
      statusLabel = 'វិស្សមកាលតូច (ពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិ)';
      khmerCell = '[ឈប់សម្រាក] វិស្សមកាលតូច';
      mathCell = '[ឈប់សម្រាក] វិស្សមកាលតូច';
      sciCell = '[ឈប់សម្រាក] វិស្សមកាលតូច';
      socCell = '[ឈប់សម្រាក] វិស្សមកាលតូច';
      noteCell = 'វិស្សមកាលតូច ចូលឆ្នាំថ្មីប្រពៃណីជាតិ';
    } else if (diagnosticRemaining > 0) {
      diagnosticCounter++;
      diagnosticRemaining--;
      dayType = 'DIAGNOSTIC';
      statusLabel = `ធ្វើតេស្តរោគវិនិច្ឆ័យ (ថ្ងៃទី${toKhmerNum(diagnosticCounter)})`;
      khmerCell = `ធ្វើតេស្តរោគវិនិច្ឆ័យដើមឆ្នាំ (ថ្ងៃទី${toKhmerNum(diagnosticCounter)})`;
      mathCell = `ធ្វើតេស្តរោគវិនិច្ឆ័យដើមឆ្នាំ (ថ្ងៃទី${toKhmerNum(diagnosticCounter)})`;
      sciCell = '—';
      socCell = '—';
      noteCell = 'តេស្តរោគវិនិច្ឆ័យដើមឆ្នាំសិក្សា';
      const diagObj: LessonItem = {
        chapter: 'តេស្តដើមឆ្នាំ',
        title: `ធ្វើតេស្តរោគវិនិច្ឆ័យដើមឆ្នាំ (ថ្ងៃទី${toKhmerNum(diagnosticCounter)})`,
        outcome: 'វាយតម្លៃកម្រិតសមត្ថភាពដំបូងរបស់សិស្សគ្រប់រូប',
        hours: '២ម៉',
        page_ss: '',
        page_sg: '',
        days: 1,
        pages: ''
      };
      khmerObj = diagObj;
      mathObj = diagObj;
      sciObj = diagObj;
      socObj = diagObj;
    } else if (
      dow === 4 &&
      cfg.fourthThuMode === 'calendar_4th' &&
      nthWeekdayOfMonth === 4
    ) {
      dayType = 'THURSDAY_4TH';
      statusLabel = 'ថ្ងៃព្រហស្បតិ៍សប្តាហ៍ទី៤ (ឈប់សម្រាក)';
      khmerCell = '[ឈប់សម្រាក] ប្រជុំបច្ចេកទេសប្រចាំខែ (ថ្ងៃព្រហស្បតិ៍សប្តាហ៍ទី៤)';
      mathCell = '[ឈប់សម្រាក] ប្រជុំបច្ចេកទេសប្រចាំខែ (ថ្ងៃព្រហស្បតិ៍សប្តាហ៍ទី៤)';
      sciCell = '—';
      socCell = '—';
      noteCell = 'ថ្ងៃព្រហស្បតិ៍សប្តាហ៍ទី៤ ឈប់សម្រាក';
      const t4Obj: LessonItem = {
        chapter: 'ប្រជុំបច្ចេកទេស',
        title: 'ប្រជុំបច្ចេកទេសប្រចាំខែ (ថ្ងៃព្រហស្បតិ៍សប្តាហ៍ទី៤)',
        outcome: 'ថ្ងៃឈប់សម្រាកសម្រាប់ប្រជុំក្រុមបច្ចេកទេសប្រចាំខែ',
        hours: '—',
        page_ss: '',
        page_sg: '',
        days: 1,
        pages: ''
      };
      khmerObj = t4Obj;
      mathObj = t4Obj;
      sciObj = t4Obj;
      socObj = t4Obj;
    } else if (dow === 4) {
      dayType = 'THURSDAY_REVIEW';
      statusLabel = `ថ្ងៃព្រហស្បតិ៍${weekOfMonthLabel} (រំលឹកមេរៀនចាស់)`;
      const khReviewRef =
        recentKhmerTopics.length > 0
          ? recentKhmerTopics[recentKhmerTopics.length - 1]
          : pointers.khmer > 0
          ? queues.khmer[Math.min(pointers.khmer - 1, queues.khmer.length - 1)].chapter
          : 'មេរៀនសប្តាហ៍មុន';
      const maReviewRef =
        recentMathTopics.length > 0
          ? recentMathTopics[recentMathTopics.length - 1]
          : pointers.math > 0
          ? queues.math[Math.min(pointers.math - 1, queues.math.length - 1)].chapter
          : 'មេរៀនសប្តាហ៍មុន';

      khmerCell = `បង្រៀនបំប៉ន និងរំលឹកមេរៀនចាស់ (${khReviewRef})`;
      mathCell = `បង្រៀនបំប៉ន និងរំលឹកមេរៀនចាស់ (${maReviewRef})`;
      sciCell = '— (បង្រៀនតែភាសាខ្មែរ និងគណិតវិទ្យា)';
      socCell = '— (បង្រៀនតែភាសាខ្មែរ និងគណិតវិទ្យា)';
      noteCell = 'ថ្ងៃព្រហស្បតិ៍៖ បង្រៀនតែខ្មែរ និងគណិត (រំលឹកមេរៀនចាស់)';

      khmerObj = {
        chapter: 'បង្រៀនបំប៉ន',
        title: khmerCell,
        outcome:
          'រំលឹកមេរៀនចាស់ និងជួយបំប៉នសិស្សរៀនយឺតលើមុខវិជ្ជាភាសាខ្មែរ',
        hours: '២ម៉',
        page_ss: '',
        page_sg: '',
        days: 1,
        pages: ''
      };
      mathObj = {
        chapter: 'បង្រៀនបំប៉ន',
        title: mathCell,
        outcome:
          'រំលឹកមេរៀនចាស់ និងជួយបំប៉នសិស្សរៀនយឺតលើមុខវិជ្ជាគណិតវិទ្យា',
        hours: '១ម៉',
        page_ss: '',
        page_sg: '',
        days: 1,
        pages: ''
      };
      sciObj = {
        chapter: '—',
        title: sciCell,
        outcome: 'ថ្ងៃព្រហស្បតិ៍បង្រៀនតែភាសាខ្មែរ និងគណិតវិទ្យា',
        hours: '—',
        page_ss: '',
        page_sg: '',
        days: 1,
        pages: ''
      };
      socObj = {
        chapter: '—',
        title: socCell,
        outcome: 'ថ្ងៃព្រហស្បតិ៍បង្រៀនតែភាសាខ្មែរ និងគណិតវិទ្យា',
        hours: '—',
        page_ss: '',
        page_sg: '',
        days: 1,
        pages: ''
      };

      if (cfg.otherThuMode === 'review_and_advance') {
        if (pointers.khmer < queues.khmer.length) {
          const kItem = queues.khmer[pointers.khmer++];
          khmerCell = `រំលឹកមេរៀនចាស់ + ${kItem.fullText}`;
          khmerObj = { ...kItem, title: `រំលឹក + ${kItem.title}` };
        }
        if (pointers.math < queues.math.length) {
          const mItem = queues.math[pointers.math++];
          mathCell = `រំលឹកមេរៀនចាស់ + ${mItem.fullText}`;
          mathObj = { ...mItem, title: `រំលឹក + ${mItem.title}` };
        }
      }
    } else {
      // Standard teaching day
      dayType = 'TEACHING';
      statusLabel = 'ថ្ងៃសិក្សាធម្មតា';

      if (pointers.khmer < queues.khmer.length) {
        const kItem = queues.khmer[pointers.khmer++];
        khmerCell = kItem.fullText;
        khmerObj = kItem;
        recentKhmerTopics.push(kItem.title);
      } else {
        khmerCell = 'រំលឹកមេរៀនបូកសរុបប្រចាំឆ្នាំ និងត្រៀមប្រឡងឆមាសទី២';
        khmerObj = {
          chapter: 'រំលឹកមេរៀនប្រចាំឆ្នាំ',
          title: khmerCell,
          outcome: 'ពង្រឹងសមត្ថភាពសិស្សមុនប្រឡងបញ្ចប់ឆ្នាំសិក្សា',
          hours: '២ម៉',
          page_ss: '',
          page_sg: '',
          days: 1,
          pages: ''
        };
      }

      if (pointers.math < queues.math.length) {
        const mItem = queues.math[pointers.math++];
        mathCell = mItem.fullText;
        mathObj = mItem;
        recentMathTopics.push(mItem.title);
      } else {
        mathCell = 'រំលឹកមេរៀនបូកសរុបប្រចាំឆ្នាំ និងដោះស្រាយចំណោទ';
        mathObj = {
          chapter: 'រំលឹកមេរៀនប្រចាំឆ្នាំ',
          title: mathCell,
          outcome: 'ដោះស្រាយលំហាត់និងចំណោទបូកសរុបប្រចាំឆ្នាំ',
          hours: '១ម៉',
          page_ss: '',
          page_sg: '',
          days: 1,
          pages: ''
        };
      }

      if (pointers.science < queues.science.length) {
        const sItem = queues.science[pointers.science++];
        sciCell = sItem.fullText;
        sciObj = sItem;
      } else {
        sciCell = 'រំលឹកមេរៀនវិទ្យាសាស្ត្រប្រចាំឆ្នាំ';
        sciObj = {
          chapter: 'រំលឹកមេរៀន',
          title: sciCell,
          outcome: 'រំលឹកមេរៀនវិទ្យាសាស្ត្រប្រចាំឆ្នាំ',
          hours: '១ម៉',
          page_ss: '',
          page_sg: '',
          days: 1,
          pages: ''
        };
      }

      if (pointers.social < queues.social.length) {
        const soItem = queues.social[pointers.social++];
        socCell = soItem.fullText;
        socObj = soItem;
      } else {
        socCell = 'រំលឹកមេរៀនសិក្សាសង្គមប្រចាំឆ្នាំ';
        socObj = {
          chapter: 'រំលឹកមេរៀន',
          title: socCell,
          outcome: 'រំលឹកមេរៀនសិក្សាសង្គមប្រចាំឆ្នាំ',
          hours: '១ម៉',
          page_ss: '',
          page_sg: '',
          days: 1,
          pages: ''
        };
      }
      noteCell = 'បង្រៀនតាមកាលវិភាគធម្មតា';
    }

    // Only skip weekend off days so that weekdays, holidays, and vacations are documented
    if (dayType !== 'WEEKEND_OFF') {
      rowNum++;
      rows.push({
        rowNum,
        date: formatKhmerDate(iso),
        isoDate: iso,
        dayName: `ថ្ងៃ${KHMER_DAYS[dow]}`,
        dow,
        monthKey: `${yearNum}-${String(monthIdx + 1).padStart(2, '0')}`,
        monthLabel,
        weekLabel: weekOfMonthLabel,
        nthWeekdayOfMonth,
        dayType,
        statusLabel,
        khmer: khmerCell,
        math: mathCell,
        science: sciCell,
        social: socCell,
        khmerObj,
        mathObj,
        sciObj,
        socObj,
        note: noteCell
      });
    }

    cur.setDate(cur.getDate() + 1);
  }

  return rows;
}

export interface ScheduleStats {
  totalRows: number;
  teachingDays: number;
  holidayDays: number;
  vacationDays: number;
  reviewDays: number;
  techMeetingDays: number;
  diagnosticDays: number;
  khmerProgress: number;
  mathProgress: number;
  scienceProgress: number;
  socialProgress: number;
}

export function calculateScheduleStats(
  rows: ScheduleRow[],
  lessons: SubjectLessons
): ScheduleStats {
  let teachingDays = 0;
  let holidayDays = 0;
  let vacationDays = 0;
  let reviewDays = 0;
  let techMeetingDays = 0;
  let diagnosticDays = 0;

  rows.forEach((r) => {
    switch (r.dayType) {
      case 'TEACHING':
        teachingDays++;
        break;
      case 'HOLIDAY':
        holidayDays++;
        break;
      case 'VACATION_SMALL':
      case 'VACATION_BIG':
        vacationDays++;
        break;
      case 'THURSDAY_REVIEW':
        reviewDays++;
        break;
      case 'THURSDAY_4TH':
        techMeetingDays++;
        break;
      case 'DIAGNOSTIC':
        diagnosticDays++;
        break;
    }
  });

  const khmerTotal = lessons.khmer.length || 1;
  const mathTotal = lessons.math.length || 1;
  const sciTotal = lessons.science.length || 1;
  const socTotal = lessons.social.length || 1;

  return {
    totalRows: rows.length,
    teachingDays,
    holidayDays,
    vacationDays,
    reviewDays,
    techMeetingDays,
    diagnosticDays,
    khmerProgress: Math.min(100, Math.round((teachingDays / khmerTotal) * 100)),
    mathProgress: Math.min(100, Math.round((teachingDays / mathTotal) * 100)),
    scienceProgress: Math.min(100, Math.round((teachingDays / sciTotal) * 100)),
    socialProgress: Math.min(100, Math.round((teachingDays / socTotal) * 100))
  };
}
