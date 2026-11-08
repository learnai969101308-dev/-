export interface LessonItem {
  chapter: string;
  title: string;
  outcome: string;
  hours: string;
  page_ss: string;
  page_sg: string;
  days: number;
  pages: string;
}

export type SubjectKey = 'khmer' | 'math' | 'science' | 'social';

export interface SubjectLessons {
  khmer: LessonItem[];
  math: LessonItem[];
  science: LessonItem[];
  social: LessonItem[];
}

export interface GradeCurriculum {
  label: string;
  khmer: LessonItem[];
  math: LessonItem[];
  science: LessonItem[];
  social: LessonItem[];
}

export interface HolidayItem {
  date: string;
  name: string;
  enabled: boolean;
}

export interface ConfigState {
  academicYear: string;
  province: string;
  district: string;
  schoolName: string;
  gradeLabel: string;
  teacherName: string;
  principalName: string;
  startDate: string;
  endDate: string;
  smallVacStart: string;
  smallVacEnd: string;
  bigVacStart: string;
  bigVacEnd: string;
  diagnosticDays: number;
  studyDaysPerWeek: number;
  fourthThuMode: 'calendar_4th' | 'always_review';
  otherThuMode: 'review_only' | 'review_and_advance';
}

export type DayType =
  | 'TEACHING'
  | 'DIAGNOSTIC'
  | 'HOLIDAY'
  | 'VACATION_SMALL'
  | 'VACATION_BIG'
  | 'THURSDAY_REVIEW'
  | 'THURSDAY_4TH'
  | 'WEEKEND_OFF';

export interface ScheduleRow {
  rowNum: number;
  date: string;
  isoDate: string;
  dayName: string;
  dow: number;
  monthKey: string;
  monthLabel: string;
  weekLabel: string;
  nthWeekdayOfMonth: number;
  dayType: DayType;
  statusLabel: string;
  khmer: string;
  math: string;
  science: string;
  social: string;
  khmerObj?: LessonItem;
  mathObj?: LessonItem;
  sciObj?: LessonItem;
  socObj?: LessonItem;
  note: string;
}

export type SubjectDisplayMode =
  | 'all'
  | 'khmer_only'
  | 'math_only'
  | 'science_only'
  | 'social_only';

export type ActiveTab = 'schedule' | 'lessons' | 'holidays' | 'settings' | 'export';
