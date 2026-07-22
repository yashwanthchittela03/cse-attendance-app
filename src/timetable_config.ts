export interface PeriodSubject {
  periodNum: number;
  timeSlot: string;
  subjectName: string;
  hasAttendance: boolean; // false for non-academic periods like Sports, Mentoring, Library
}

export interface DaySchedule {
  [day: string]: PeriodSubject[];
}

export interface TimetableVersion {
  id: string;
  startDate: string;
  endDate: string;
  schedule: DaySchedule;
}

const sub = (num: number, time: string, name: string, hasAtt = true): PeriodSubject => ({
  periodNum: num,
  timeSlot: time,
  subjectName: name,
  hasAttendance: hasAtt,
});

export const TIMETABLE_VERSIONS: TimetableVersion[] = [
  // PERIOD 1 (June 22 - June 24)
  {
    id: "Period 1",
    startDate: "2026-06-22",
    endDate: "2026-06-24",
    schedule: {
      Monday: [
        sub(1, "9:00 - 10:00", "DS"),
        sub(2, "10:00 - 11:00", "DS (T)"),
        sub(3, "11:10 - 12:10", "ADA"),
        sub(4, "12:55 - 1:55", "CN"),
        sub(5, "1:55 - 2:55", "WT"),
        sub(6, "2:55 - 3:55", "Library", false),
      ],
      Tuesday: [
        sub(1, "9:00 - 11:00", "CT Lab (P1)"),
        sub(2, "9:00 - 11:00", "CT Lab (P2)"),
        sub(3, "11:10 - 12:10", "PE-I"),
        sub(4, "12:55 - 1:55", "A&DS Lab (P1)"),
        sub(5, "1:55 - 2:55", "A&DS Lab (P2)"),
        sub(6, "2:55 - 3:55", "A&DS Lab (P3)"),
      ],
      Wednesday: [
        sub(1, "9:00 - 10:00", "MAD Lab (P1)"),
        sub(2, "10:00 - 11:00", "MAD Lab (P2)"),
        sub(3, "11:10 - 12:10", "MAD Lab (P3)"),
        sub(4, "12:55 - 2:55", "CRT (P1)"),
        sub(5, "12:55 - 2:55", "CRT (P2)"),
        sub(6, "2:55 - 3:55", "PE-I"),
      ],
    },
  },

  // PERIOD 2 (June 25 - July 5)
  {
    id: "Period 2",
    startDate: "2026-06-25",
    endDate: "2026-07-05",
    schedule: {
      Monday: [
        sub(1, "9:00 - 10:00", "DS"),
        sub(2, "10:00 - 11:00", "ADA (T)"),
        sub(3, "11:10 - 12:10", "ADA"),
        sub(4, "12:55 - 1:55", "CN"),
        sub(5, "1:55 - 2:55", "WT"),
        sub(6, "2:55 - 3:55", "Library", false),
      ],
      Tuesday: [
        sub(1, "9:00 - 11:00", "CT Lab (P1)"),
        sub(2, "9:00 - 11:00", "CT Lab (P2)"),
        sub(3, "11:10 - 12:10", "PE-I"),
        sub(4, "12:55 - 1:55", "A&DS Lab (P1)"),
        sub(5, "1:55 - 2:55", "A&DS Lab (P2)"),
        sub(6, "2:55 - 3:55", "A&DS Lab (P3)"),
      ],
      Wednesday: [
        sub(1, "9:00 - 10:00", "MAD Lab (P1)"),
        sub(2, "10:00 - 11:00", "MAD Lab (P2)"),
        sub(3, "11:10 - 12:10", "MAD Lab (P3)"),
        sub(4, "12:55 - 2:55", "CRT (P1)"),
        sub(5, "12:55 - 2:55", "CRT (P2)"),
        sub(6, "2:55 - 3:55", "PE-I"),
      ],
      Thursday: [
        sub(1, "9:00 - 10:00", "WT Lab (P1)"),
        sub(2, "10:00 - 11:00", "WT Lab (P2)"),
        sub(3, "11:10 - 12:10", "WT Lab (P3)"),
        sub(4, "12:55 - 1:55", "ADA"),
        sub(5, "1:55 - 2:55", "DS"),
        sub(6, "2:55 - 3:55", "WT"),
      ],
      Friday: [
        sub(1, "9:00 - 10:00", "ADA"),
        sub(2, "10:00 - 11:00", "WT"),
        sub(3, "11:10 - 12:10", "Mentoring", false),
        sub(4, "12:55 - 1:55", "PE-I"),
        sub(5, "1:55 - 2:55", "DS"),
        sub(6, "2:55 - 3:55", "CN"),
      ],
      Saturday: [
        sub(1, "9:00 - 10:00", "Minor Lab / Mentoring", false),
        sub(2, "10:00 - 11:00", "Minor Lab / ADA (T)"),
        sub(3, "11:10 - 12:10", "Minor Lab / CN (T)"),
        sub(4, "12:55 - 1:55", "CN"),
        sub(5, "1:55 - 2:55", "WT (T)"),
        sub(6, "2:55 - 3:55", "Sports", false),
      ],
    },
  },

  // PERIOD 3 (July 6 - July 12)
  {
    id: "Period 3",
    startDate: "2026-07-06",
    endDate: "2026-07-12",
    schedule: {
      Monday: [
        sub(1, "9:00 - 10:00", "DS"),
        sub(2, "10:00 - 11:00", "ADA"),
        sub(3, "11:10 - 12:10", "Mentoring", false),
        sub(4, "12:55 - 1:55", "WT"),
        sub(5, "1:55 - 2:55", "ADA"),
        sub(6, "2:55 - 3:55", "Library", false),
      ],
      Tuesday: [
        sub(1, "9:00 - 11:00", "CT Lab (P1)"),
        sub(2, "9:00 - 11:00", "CT Lab (P2)"),
        sub(3, "11:10 - 12:10", "PE-I"),
        sub(4, "12:55 - 1:55", "A&DS Lab (P1)"),
        sub(5, "1:55 - 2:55", "A&DS Lab (P2)"),
        sub(6, "2:55 - 3:55", "A&DS Lab (P3)"),
      ],
      Wednesday: [
        sub(1, "9:00 - 10:00", "MAD Lab (P1)"),
        sub(2, "10:00 - 11:00", "MAD Lab (P2)"),
        sub(3, "11:10 - 12:10", "MAD Lab (P3)"),
        sub(4, "12:55 - 2:55", "CRT (P1)"),
        sub(5, "12:55 - 2:55", "CRT (P2)"),
        sub(6, "2:55 - 3:55", "PE-I"),
      ],
      Thursday: [
        sub(1, "9:00 - 10:00", "WT Lab (P1)"),
        sub(2, "10:00 - 11:00", "WT Lab (P2)"),
        sub(3, "11:10 - 12:10", "WT Lab (P3)"),
        sub(4, "12:55 - 1:55", "ADA"),
        sub(5, "1:55 - 2:55", "DS"),
        sub(6, "2:55 - 3:55", "CN"),
      ],
      Friday: [
        sub(1, "9:00 - 10:00", "CN"),
        sub(2, "10:00 - 11:00", "ADA"),
        sub(3, "11:10 - 12:10", "WT"),
        sub(4, "12:55 - 1:55", "PE-I"),
        sub(5, "1:55 - 2:55", "DS"),
        sub(6, "2:55 - 3:55", "WT"),
      ],
      Saturday: [
        sub(1, "9:00 - 10:00", "Minor Lab / Mentoring", false),
        sub(2, "10:00 - 11:00", "Minor Lab / ADA (T)"),
        sub(3, "11:10 - 12:10", "Minor Lab / CN (T)"),
        sub(4, "12:55 - 1:55", "CN"),
        sub(5, "1:55 - 2:55", "WT"),
        sub(6, "2:55 - 3:55", "Sports", false),
      ],
    },
  },

  // PERIOD 4 (July 13 - Nov 20) — Exact timetable from CVR CSE F schedule
  {
    id: "Period 4",
    startDate: "2026-07-13",
    endDate: "2026-11-20",
    schedule: {
      Monday: [
        sub(1, "9:00 - 10:00", "DS"),
        sub(2, "10:00 - 11:00", "DS (T)"),
        sub(3, "11:10 - 12:10", "ADA"),
        sub(4, "12:55 - 1:55", "CN"),
        sub(5, "1:55 - 2:55", "WT"),
        sub(6, "2:55 - 3:55", "Library", false),
      ],
      Tuesday: [
        sub(1, "9:00 - 10:00", "CT Lab (P1)"),
        sub(2, "10:00 - 11:00", "CT Lab (P2)"),
        sub(3, "11:10 - 12:10", "PE-I"),
        sub(4, "12:55 - 1:55", "A&DS Lab (P1)"),
        sub(5, "1:55 - 2:55", "A&DS Lab (P2)"),
        sub(6, "2:55 - 3:55", "A&DS Lab (P3)"),
      ],
      Wednesday: [
        sub(1, "9:00 - 10:00", "MAD Lab (P1)"),
        sub(2, "10:00 - 11:00", "MAD Lab (P2)"),
        sub(3, "11:10 - 12:10", "MAD Lab (P3)"),
        sub(4, "12:55 - 1:55", "CRT (P1)"),
        sub(5, "1:55 - 2:55", "CRT (P2)"),
        sub(6, "2:55 - 3:55", "PE-I"),
      ],
      Thursday: [
        sub(1, "9:00 - 10:00", "WT Lab (P1)"),
        sub(2, "10:00 - 11:00", "WT Lab (P2)"),
        sub(3, "11:10 - 12:10", "WT Lab (P3)"),
        sub(4, "12:55 - 1:55", "ADA"),
        sub(5, "1:55 - 2:55", "DS"),
        sub(6, "2:55 - 3:55", "WT"),
      ],
      Friday: [
        sub(1, "9:00 - 10:00", "ADA"),
        sub(2, "10:00 - 11:00", "WT"),
        sub(3, "11:10 - 12:10", "Mentoring", false),
        sub(4, "12:55 - 1:55", "PE-I"),
        sub(5, "1:55 - 2:55", "DS"),
        sub(6, "2:55 - 3:55", "CN"),
      ],
      Saturday: [
        sub(1, "9:00 - 10:00", "Minor Lab / Mentoring", false),
        sub(2, "10:00 - 11:00", "Minor Lab / ADA (T)"),
        sub(3, "11:10 - 12:10", "Minor Lab / CN (T)"),
        sub(4, "12:55 - 1:55", "CN"),
        sub(5, "1:55 - 2:55", "WT (T)"),
        sub(6, "2:55 - 3:55", "Sports", false),
      ],
    },
  },
];

export function getScheduleForDate(dateString: string): PeriodSubject[] {
  const targetDate = new Date(dateString);
  const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' });

  const activeVersion = TIMETABLE_VERSIONS.find((v) => {
    const start = new Date(v.startDate);
    const end = new Date(v.endDate);
    return targetDate >= start && targetDate <= end;
  });

  if (!activeVersion || !activeVersion.schedule[dayName]) return [];
  return activeVersion.schedule[dayName];
}