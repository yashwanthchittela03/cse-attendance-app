export interface SubjectSlot {
  time: string;
  subject: string;
  isCounted: boolean; // false for Library, Mentoring, Sports
}

export interface DaySchedule {
  [dayName: string]: SubjectSlot[];
}

export interface TimetablePhase {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  schedule: DaySchedule;
}

// Evening Classes - Split into two separate 1-hour slots
const EVENING_CLASSES: { [day: string]: SubjectSlot[] } = {
  Tuesday: [
    { time: '7:00 PM - 8:00 PM', subject: 'Minor Course (AIML/FAI)', isCounted: true },
    { time: '8:00 PM - 9:00 PM', subject: 'Minor Course (AIML/FAI)', isCounted: true },
  ],
  Wednesday: [
    { time: '7:00 PM - 8:00 PM', subject: 'Additional OE', isCounted: true },
    { time: '8:00 PM - 9:00 PM', subject: 'Additional OE', isCounted: true },
  ],
  Thursday: [
    { time: '7:00 PM - 8:00 PM', subject: 'Minor Course (AIML/FAI)', isCounted: true },
    { time: '8:00 PM - 9:00 PM', subject: 'Minor Course (AIML/FAI)', isCounted: true },
  ],
  Friday: [
    { time: '7:00 PM - 8:00 PM', subject: 'Additional OE', isCounted: true },
    { time: '8:00 PM - 9:00 PM', subject: 'Additional OE', isCounted: true },
  ],
};

// Phase 1: June 22 to June 24
const PHASE_1_SCHEDULE: DaySchedule = {
  Monday: [
    { time: '9:00 - 10:00', subject: 'DS', isCounted: true },
    { time: '10:00 - 11:00', subject: 'DS (T)', isCounted: true },
    { time: '11:10 - 12:10', subject: 'ADA', isCounted: true },
    { time: '12:55 - 1:55', subject: 'CN', isCounted: true },
    { time: '1:55 - 2:55', subject: 'WT', isCounted: true },
    { time: '2:55 - 3:55', subject: 'LIBRARY', isCounted: false },
  ],
  Tuesday: [
    { time: '9:00 - 10:00', subject: 'CT LAB', isCounted: true },
    { time: '10:00 - 11:00', subject: 'CT LAB', isCounted: true },
    { time: '11:10 - 12:10', subject: 'PE-I', isCounted: true },
    { time: '12:55 - 1:55', subject: 'A&DS LAB', isCounted: true },
    { time: '1:55 - 2:55', subject: 'A&DS LAB', isCounted: true },
    { time: '2:55 - 3:55', subject: 'A&DS LAB', isCounted: true },
  ],
  Wednesday: [
    { time: '9:00 - 10:00', subject: 'MAD LAB', isCounted: true },
    { time: '10:00 - 11:00', subject: 'MAD LAB', isCounted: true },
    { time: '11:10 - 12:10', subject: 'MAD LAB', isCounted: true },
    { time: '12:55 - 1:55', subject: 'CRT', isCounted: true },
    { time: '1:55 - 2:55', subject: 'CRT', isCounted: true },
    { time: '2:55 - 3:55', subject: 'PE-I', isCounted: true },
  ],
  Thursday: [
    { time: '9:00 - 10:00', subject: 'WT LAB', isCounted: true },
    { time: '10:00 - 11:00', subject: 'WT LAB', isCounted: true },
    { time: '11:10 - 12:10', subject: 'WT LAB', isCounted: true },
    { time: '12:55 - 1:55', subject: 'ADA', isCounted: true },
    { time: '1:55 - 2:55', subject: 'DS', isCounted: true },
    { time: '2:55 - 3:55', subject: 'WT', isCounted: true },
  ],
  Friday: [
    { time: '9:00 - 10:00', subject: 'ADA', isCounted: true },
    { time: '10:00 - 11:00', subject: 'WT', isCounted: true },
    { time: '11:10 - 12:10', subject: 'MENTORING', isCounted: false },
    { time: '12:55 - 1:55', subject: 'PE-I', isCounted: true },
    { time: '1:55 - 2:55', subject: 'DS', isCounted: true },
    { time: '2:55 - 3:55', subject: 'CN', isCounted: true },
  ],
  Saturday: [
    { time: '9:00 - 10:00', subject: 'MINOR LAB / MENTORING', isCounted: false },
    { time: '10:00 - 11:00', subject: 'MINOR LAB / ADA(T)', isCounted: true },
    { time: '11:10 - 12:10', subject: 'MINOR LAB / CN(T)', isCounted: true },
    { time: '12:55 - 1:55', subject: 'CN', isCounted: true },
    { time: '1:55 - 2:55', subject: 'WT (T)', isCounted: true },
    { time: '2:55 - 3:55', subject: 'SPORTS', isCounted: false },
  ],
};

// Phase 2: June 25 to July 5
const PHASE_2_SCHEDULE: DaySchedule = {
  Monday: [
    { time: '9:00 - 10:00', subject: 'DS', isCounted: true },
    { time: '10:00 - 11:00', subject: 'ADA (T)', isCounted: true },
    { time: '11:10 - 12:10', subject: 'ADA', isCounted: true },
    { time: '12:55 - 1:55', subject: 'CN', isCounted: true },
    { time: '1:55 - 2:55', subject: 'WT', isCounted: true },
    { time: '2:55 - 3:55', subject: 'LIBRARY', isCounted: false },
  ],
  Tuesday: [
    { time: '9:00 - 10:00', subject: 'CT LAB', isCounted: true },
    { time: '10:00 - 11:00', subject: 'CT LAB', isCounted: true },
    { time: '11:10 - 12:10', subject: 'PE-I', isCounted: true },
    { time: '12:55 - 1:55', subject: 'A&DS LAB', isCounted: true },
    { time: '1:55 - 2:55', subject: 'A&DS LAB', isCounted: true },
    { time: '2:55 - 3:55', subject: 'A&DS LAB', isCounted: true },
  ],
  Wednesday: [
    { time: '9:00 - 10:00', subject: 'MAD LAB', isCounted: true },
    { time: '10:00 - 11:00', subject: 'MAD LAB', isCounted: true },
    { time: '11:10 - 12:10', subject: 'MAD LAB', isCounted: true },
    { time: '12:55 - 1:55', subject: 'CRT', isCounted: true },
    { time: '1:55 - 2:55', subject: 'CRT', isCounted: true },
    { time: '2:55 - 3:55', subject: 'PE-I', isCounted: true },
  ],
  Thursday: [
    { time: '9:00 - 10:00', subject: 'WT LAB', isCounted: true },
    { time: '10:00 - 11:00', subject: 'WT LAB', isCounted: true },
    { time: '11:10 - 12:10', subject: 'WT LAB', isCounted: true },
    { time: '12:55 - 1:55', subject: 'ADA', isCounted: true },
    { time: '1:55 - 2:55', subject: 'DS', isCounted: true },
    { time: '2:55 - 3:55', subject: 'WT', isCounted: true },
  ],
  Friday: [
    { time: '9:00 - 10:00', subject: 'ADA', isCounted: true },
    { time: '10:00 - 11:00', subject: 'WT', isCounted: true },
    { time: '11:10 - 12:10', subject: 'MENTORING', isCounted: false },
    { time: '12:55 - 1:55', subject: 'PE-I', isCounted: true },
    { time: '1:55 - 2:55', subject: 'DS', isCounted: true },
    { time: '2:55 - 3:55', subject: 'CN', isCounted: true },
  ],
  Saturday: [
    { time: '9:00 - 10:00', subject: 'MINOR LAB / DS(T)', isCounted: true },
    { time: '10:00 - 11:00', subject: 'MINOR LAB / CN(T)', isCounted: true },
    { time: '11:10 - 12:10', subject: 'MINOR LAB / MENTORING', isCounted: false },
    { time: '12:55 - 1:55', subject: 'CN', isCounted: true },
    { time: '1:55 - 2:55', subject: 'WT (T)', isCounted: true },
    { time: '2:55 - 3:55', subject: 'SPORTS', isCounted: false },
  ],
};

// Phase 3: July 6 to July 12
const PHASE_3_SCHEDULE: DaySchedule = {
  Monday: [
    { time: '9:00 - 10:00', subject: 'DS', isCounted: true },
    { time: '10:00 - 11:00', subject: 'ADA', isCounted: true },
    { time: '11:10 - 12:10', subject: 'MENTORING', isCounted: false },
    { time: '12:55 - 1:55', subject: 'WT', isCounted: true },
    { time: '1:55 - 2:55', subject: 'ADA', isCounted: true },
    { time: '2:55 - 3:55', subject: 'LIBRARY', isCounted: false },
  ],
  Tuesday: [
    { time: '9:00 - 10:00', subject: 'CT LAB', isCounted: true },
    { time: '10:00 - 11:00', subject: 'CT LAB', isCounted: true },
    { time: '11:10 - 12:10', subject: 'PE-I', isCounted: true },
    { time: '12:55 - 1:55', subject: 'A&DS LAB', isCounted: true },
    { time: '1:55 - 2:55', subject: 'A&DS LAB', isCounted: true },
    { time: '2:55 - 3:55', subject: 'A&DS LAB', isCounted: true },
  ],
  Wednesday: [
    { time: '9:00 - 10:00', subject: 'MAD LAB', isCounted: true },
    { time: '10:00 - 11:00', subject: 'MAD LAB', isCounted: true },
    { time: '11:10 - 12:10', subject: 'MAD LAB', isCounted: true },
    { time: '12:55 - 1:55', subject: 'CRT', isCounted: true },
    { time: '1:55 - 2:55', subject: 'CRT', isCounted: true },
    { time: '2:55 - 3:55', subject: 'PE-I', isCounted: true },
  ],
  Thursday: [
    { time: '9:00 - 10:00', subject: 'WT LAB', isCounted: true },
    { time: '10:00 - 11:00', subject: 'WT LAB', isCounted: true },
    { time: '11:10 - 12:10', subject: 'WT LAB', isCounted: true },
    { time: '12:55 - 1:55', subject: 'ADA', isCounted: true },
    { time: '1:55 - 2:55', subject: 'DS', isCounted: true },
    { time: '2:55 - 3:55', subject: 'CN', isCounted: true },
  ],
  Friday: [
    { time: '9:00 - 10:00', subject: 'CN', isCounted: true },
    { time: '10:00 - 11:00', subject: 'ADA', isCounted: true },
    { time: '11:10 - 12:10', subject: 'WT', isCounted: true },
    { time: '12:55 - 1:55', subject: 'PE-I', isCounted: true },
    { time: '1:55 - 2:55', subject: 'DS', isCounted: true },
    { time: '2:55 - 3:55', subject: 'WT', isCounted: true },
  ],
  Saturday: [
    { time: '9:00 - 10:00', subject: 'MINOR LAB / DS(T)', isCounted: true },
    { time: '10:00 - 11:00', subject: 'MINOR LAB / CN(T)', isCounted: true },
    { time: '11:10 - 12:10', subject: 'MINOR LAB / MENTORING', isCounted: false },
    { time: '12:55 - 1:55', subject: 'CN', isCounted: true },
    { time: '1:55 - 2:55', subject: 'WT', isCounted: true },
    { time: '2:55 - 3:55', subject: 'SPORTS', isCounted: false },
  ],
};

// Phase 4: July 13 onwards
const PHASE_4_SCHEDULE: DaySchedule = {
  Monday: [
    { time: '9:00 - 10:00', subject: 'DS', isCounted: true },
    { time: '10:00 - 11:00', subject: 'ADA', isCounted: true },
    { time: '11:10 - 12:10', subject: 'MENTORING', isCounted: false },
    { time: '12:55 - 1:55', subject: 'WT', isCounted: true },
    { time: '1:55 - 2:55', subject: 'ADA', isCounted: true },
    { time: '2:55 - 3:55', subject: 'LIBRARY', isCounted: false },
  ],
  Tuesday: [
    { time: '9:00 - 10:00', subject: 'CT LAB', isCounted: true },
    { time: '10:00 - 11:00', subject: 'CT LAB', isCounted: true },
    { time: '11:10 - 12:10', subject: 'PE-I', isCounted: true },
    { time: '12:55 - 1:55', subject: 'A&DS LAB', isCounted: true },
    { time: '1:55 - 2:55', subject: 'A&DS LAB', isCounted: true },
    { time: '2:55 - 3:55', subject: 'A&DS LAB', isCounted: true },
  ],
  Wednesday: [
    { time: '9:00 - 10:00', subject: 'MAD LAB', isCounted: true },
    { time: '10:00 - 11:00', subject: 'MAD LAB', isCounted: true },
    { time: '11:10 - 12:10', subject: 'MAD LAB', isCounted: true },
    { time: '12:55 - 1:55', subject: 'CRT', isCounted: true },
    { time: '1:55 - 2:55', subject: 'CRT', isCounted: true },
    { time: '2:55 - 3:55', subject: 'PE-I', isCounted: true },
  ],
  Thursday: [
    { time: '9:00 - 10:00', subject: 'WT LAB', isCounted: true },
    { time: '10:00 - 11:00', subject: 'WT LAB', isCounted: true },
    { time: '11:10 - 12:10', subject: 'WT LAB', isCounted: true },
    { time: '12:55 - 1:55', subject: 'ADA', isCounted: true },
    { time: '1:55 - 2:55', subject: 'DS', isCounted: true },
    { time: '2:55 - 3:55', subject: 'CN', isCounted: true },
  ],
  Friday: [
    { time: '9:00 - 10:00', subject: 'CN', isCounted: true },
    { time: '10:00 - 11:00', subject: 'ADA', isCounted: true },
    { time: '11:10 - 12:10', subject: 'WT', isCounted: true },
    { time: '12:55 - 1:55', subject: 'PE-I', isCounted: true },
    { time: '1:55 - 2:55', subject: 'DS', isCounted: true },
    { time: '2:55 - 3:55', subject: 'WT', isCounted: true },
  ],
  Saturday: [
    { time: '9:00 - 10:00', subject: 'MINOR LAB / DS(T)', isCounted: true },
    { time: '10:00 - 11:00', subject: 'MINOR LAB / CN(T)', isCounted: true },
    { time: '11:10 - 12:10', subject: 'MINOR LAB / MENTORING', isCounted: false },
    { time: '12:55 - 1:55', subject: 'CN', isCounted: true },
    { time: '1:55 - 2:55', subject: 'WT', isCounted: true },
    { time: '2:55 - 3:55', subject: 'SPORTS', isCounted: false },
  ],
};

export const TIMETABLE_PHASES: TimetablePhase[] = [
  { startDate: '2026-06-22', endDate: '2026-06-24', schedule: PHASE_1_SCHEDULE },
  { startDate: '2026-06-25', endDate: '2026-07-05', schedule: PHASE_2_SCHEDULE },
  { startDate: '2026-07-06', endDate: '2026-07-12', schedule: PHASE_3_SCHEDULE },
  { startDate: '2026-07-13', endDate: '2026-12-31', schedule: PHASE_4_SCHEDULE },
];

/**
 * Gets full schedule for a date including day slots and evening OE / Minor classes
 */
export function getScheduleForDate(dateString: string): SubjectSlot[] {
  const dateObj = new Date(dateString);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = daysOfWeek[dateObj.getDay()];

  if (dayName === 'Sunday') return [];

  // Find matching phase
  const phase = TIMETABLE_PHASES.find(p => dateString >= p.startDate && dateString <= p.endDate);
  const baseDaySlots = phase?.schedule[dayName] || [];

  // Combine with Evening OE / Minor classes if applicable
  const eveningSlots = EVENING_CLASSES[dayName] || [];

  return [...baseDaySlots, ...eveningSlots];
}