import { useState, useEffect } from 'react';
import { getScheduleForDate } from './timetable_config';

interface AttendanceRecord {
  date: string;
  classes_attended: number;
  classes_conducted: number;
}

// Attendance state for each subject: 'present' | 'absent' | 'unmarked'
type SubjectStatus = 'present' | 'absent' | 'unmarked';

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const currentUser = localStorage.getItem('current_user') || 'STUDENT';
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [logs, setLogs] = useState<Record<string, AttendanceRecord>>({});
  const [subjectStates, setSubjectStates] = useState<Record<number, SubjectStatus>>({});

  const dailySchedule = getScheduleForDate(selectedDate);
  const eligiblePeriods = dailySchedule.filter((p) => p.hasAttendance);

  useEffect(() => {
    const savedLogs = localStorage.getItem(`logs_${currentUser}`);
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, [currentUser]);

  // When date changes, set all academic subjects to 'unmarked' by default
  useEffect(() => {
    const initialToggles: Record<number, SubjectStatus> = {};
    dailySchedule.forEach((period) => {
      if (period.hasAttendance) {
        initialToggles[period.periodNum] = 'unmarked';
      }
    });
    setSubjectStates(initialToggles);
  }, [selectedDate]);

  const setStatus = (periodNum: number, status: SubjectStatus) => {
    setSubjectStates((prev) => ({
      ...prev,
      [periodNum]: status,
    }));
  };

  // Check if all scheduled academic periods have been marked Present or Absent
  const allPeriodsMarked = eligiblePeriods.every(
    (p) => subjectStates[p.periodNum] && subjectStates[p.periodNum] !== 'unmarked'
  );

  const handleSave = () => {
    if (!allPeriodsMarked) return;

    const attendedCount = eligiblePeriods.filter(
      (p) => subjectStates[p.periodNum] === 'present'
    ).length;
    const conductedCount = eligiblePeriods.length;

    const updatedLogs = {
      ...logs,
      [selectedDate]: {
        date: selectedDate,
        classes_attended: attendedCount,
        classes_conducted: conductedCount,
      },
    };

    setLogs(updatedLogs);
    localStorage.setItem(`logs_${currentUser}`, JSON.stringify(updatedLogs));
    alert('Attendance saved successfully!');
  };

  const markedList = Object.values(logs);
  const totalAttended = markedList.reduce((acc, c) => acc + c.classes_attended, 0);
  const totalConducted = markedList.reduce((acc, c) => acc + c.classes_conducted, 0);

  const percentage = totalConducted > 0 ? (totalAttended / totalConducted) * 100 : 0;
  const isTargetMet = percentage >= 75;

  const bunksAllowed = isTargetMet
    ? Math.floor((totalAttended - 0.75 * totalConducted) / 0.75)
    : 0;
  const classesNeeded = !isTargetMet && totalConducted > 0
    ? Math.ceil((0.75 * totalConducted - totalAttended) / 0.25)
    : 0;

  const dayName = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 font-sans">
      <div className="max-w-md mx-auto space-y-6 pt-4">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            {currentUser} • Attendance Tracker
          </span>
          <button
            onClick={() => {
              localStorage.removeItem('current_user');
              onLogout();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors text-xs font-bold"
          >
            Log Out
          </button>
        </div>

        {/* Overall Stats */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center shadow-xl space-y-4">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Overall Attendance
          </span>
          <div className="text-6xl font-black tracking-tight text-white">
            {percentage.toFixed(1)}%
          </div>

          <div className="text-xs text-slate-400">
            {totalAttended} / {totalConducted} academic periods attended
          </div>

          {totalConducted === 0 ? (
            <p className="text-xs text-slate-500 italic">No days marked yet. Pick a date below!</p>
          ) : isTargetMet ? (
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full text-xs font-semibold">
              <span>Target Reached! ({bunksAllowed} bunks left)</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-4 py-2 rounded-full text-xs font-semibold">
              <span>Need {classesNeeded} consecutive classes</span>
            </div>
          )}
        </div>

        {/* Date Selector & Per-Subject List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Choose Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-400 pb-1">
              <span>{dayName} Classes</span>
              <span>{eligiblePeriods.length} Academic Subjects</span>
            </div>

            {dailySchedule.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                No classes scheduled for this date.
              </p>
            ) : (
              <div className="space-y-2">
                {dailySchedule.map((period) => {
                  const currentStatus = subjectStates[period.periodNum] || 'unmarked';

                  return (
                    <div
                      key={period.periodNum}
                      className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm font-semibold text-white">{period.subjectName}</div>
                        <div className="text-[11px] text-slate-500">{period.timeSlot}</div>
                      </div>

                      {period.hasAttendance ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setStatus(period.periodNum, 'present')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                              currentStatus === 'present'
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            ✓ Present
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatus(period.periodNum, 'absent')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                              currentStatus === 'absent'
                                ? 'bg-red-500/20 border-red-500 text-red-400 shadow-lg shadow-red-500/10'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            ✕ Absent
                          </button>
                        </div>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 text-slate-500 border border-slate-700/50">
                          N/A
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={eligiblePeriods.length === 0 || !allPeriodsMarked}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            {!allPeriodsMarked && eligiblePeriods.length > 0
              ? 'Mark all subjects to save'
              : logs[selectedDate]
              ? 'Update Day Attendance'
              : 'Save Day Attendance'}
          </button>
        </div>

      </div>
    </div>
  );
}