import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { getScheduleForDate, SubjectSlot } from './timetable_config';

interface DashboardProps {
  user: { id: string; name: string };
  onLogout: () => void;
}

type AttendanceStatus = 'present' | 'absent' | 'unmarked';

interface DayAttendance {
  [slotKey: string]: AttendanceStatus;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [dayAttendance, setDayAttendance] = useState<DayAttendance>({});
  const [overallStats, setOverallStats] = useState({ total: 0, attended: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [hasExistingRecord, setHasExistingRecord] = useState<boolean>(false);

  const currentSchedule: SubjectSlot[] = getScheduleForDate(selectedDate);

  // Fetch attendance for the selected date from Supabase
  const fetchDateAttendance = useCallback(async () => {
    setLoading(true);
    setHasChanges(false);

    const { data, error } = await supabase
      .from('attendance')
      .select('slot_key, status')
      .eq('user_id', user.id)
      .eq('date', selectedDate);

    if (!error && data) {
      const mapped: DayAttendance = {};
      if (data.length > 0) {
        setHasExistingRecord(true);
        data.forEach((row: any) => {
          mapped[row.slot_key] = row.status as AttendanceStatus;
        });
      } else {
        setHasExistingRecord(false);
      }
      setDayAttendance(mapped);
    }
    setLoading(false);
  }, [selectedDate, user.id]);

  // Fetch total stats across all dates
  const fetchOverallStats = useCallback(async () => {
    const { data, error } = await supabase
      .from('attendance')
      .select('status')
      .eq('user_id', user.id);

    if (!error && data) {
      let attended = 0;
      let total = 0;
      data.forEach((row: any) => {
        if (row.status === 'present') {
          attended += 1;
          total += 1;
        } else if (row.status === 'absent') {
          total += 1;
        }
      });
      setOverallStats({ total, attended });
    }
  }, [user.id]);

  useEffect(() => {
    fetchDateAttendance();
    fetchOverallStats();
  }, [selectedDate, fetchDateAttendance, fetchOverallStats]);

  // Handle local state changes (Clicking an active status unselects it back to 'unmarked')
  const handleToggle = (slotIndex: number, clickedStatus: AttendanceStatus) => {
    const slotKey = `slot_${slotIndex}`;
    const currentStatus = dayAttendance[slotKey] || 'unmarked';

    // If already active, set back to 'unmarked', otherwise set to clickedStatus
    const newStatus: AttendanceStatus =
      currentStatus === clickedStatus ? 'unmarked' : clickedStatus;

    setDayAttendance((prev) => ({ ...prev, [slotKey]: newStatus }));
    setHasChanges(true);
  };

  // Bulk mark all core subjects while skipping optional OE and Minor courses
  const handleBulkMark = (status: AttendanceStatus) => {
    const newDayState = { ...dayAttendance };
    currentSchedule.forEach((slot, idx) => {
      const isOptionalCourse =
        slot.subject.toLowerCase().includes('oe') ||
        slot.subject.toLowerCase().includes('minor') ||
        slot.subject.toLowerCase().includes('open elective');

      if (slot.isCounted && !isOptionalCourse) {
        newDayState[`slot_${idx}`] = status;
      }
    });
    setDayAttendance(newDayState);
    setHasChanges(true);
  };

  // Push attendance updates to Supabase
  const handleSaveAttendance = async () => {
    setSaving(true);

    const updates = currentSchedule
      .map((slot, idx) => ({ slot, idx }))
      .filter(
        ({ slot, idx }) =>
          slot.isCounted &&
          dayAttendance[`slot_${idx}`] &&
          dayAttendance[`slot_${idx}`] !== 'unmarked'
      )
      .map(({ idx }) => ({
        user_id: user.id,
        date: selectedDate,
        slot_key: `slot_${idx}`,
        status: dayAttendance[`slot_${idx}`],
      }));

    if (updates.length === 0) {
      alert('Please mark attendance for at least one subject before saving.');
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('attendance')
      .upsert(updates, { onConflict: 'user_id,date,slot_key' });

    setSaving(false);

    if (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance. Please try again.');
    } else {
      setHasChanges(false);
      setHasExistingRecord(true);
      fetchOverallStats();
      alert(
        hasExistingRecord
          ? 'Attendance updated successfully!'
          : 'Attendance saved successfully!'
      );
    }
  };

  const percentage =
    overallStats.total > 0
      ? ((overallStats.attended / overallStats.total) * 100).toFixed(1)
      : '100.0';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#121212',
        color: '#e0e0e0',
        padding: '20px',
        fontFamily: 'sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: '#ffffff' }}>CSE Attendance Tracker</h2>
            <small style={{ color: '#a0a0a0' }}>
              Logged in as: <strong>{user.name}</strong>
            </small>
          </div>
          <button
            onClick={onLogout}
            style={{
              padding: '8px 14px',
              backgroundColor: '#2a2a2a',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Logout
          </button>
        </div>

        {/* Stats Card */}
        <div
          style={{
            background: '#1e1e1e',
            border: '1px solid #2d2d2d',
            padding: '16px',
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <small style={{ color: '#888' }}>Total Classes</small>
            <h3 style={{ margin: '4px 0 0 0', color: '#fff' }}>{overallStats.total}</h3>
          </div>
          <div style={{ textAlign: 'center' }}>
            <small style={{ color: '#888' }}>Attended</small>
            <h3 style={{ margin: '4px 0 0 0', color: '#fff' }}>{overallStats.attended}</h3>
          </div>
          <div style={{ textAlign: 'center' }}>
            <small style={{ color: '#888' }}>Percentage</small>
            <h3
              style={{
                margin: '4px 0 0 0',
                color: Number(percentage) >= 75 ? '#4caf50' : '#f44336',
              }}
            >
              {percentage}%
            </h3>
          </div>
        </div>

        {/* Date Selector */}
        <div
          style={{
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ fontWeight: 'bold', marginRight: '10px', color: '#ccc' }}>
              Select Date:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #333',
                fontSize: '14px',
                backgroundColor: '#2a2a2a',
                color: '#ffffff',
                colorScheme: 'dark',
              }}
            />
          </div>

          {hasExistingRecord && (
            <span
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: '#1b3820',
                color: '#81c784',
                border: '1px solid #2e7d32',
              }}
            >
              ✓ Saved in Cloud
            </span>
          )}
        </div>

        {/* Quick Bulk Action Buttons */}
        {currentSchedule.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={() => handleBulkMark('present')}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#1b5e20',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Mark All Present
            </button>
            <button
              onClick={() => handleBulkMark('absent')}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#b71c1c',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Mark All Absent
            </button>
          </div>
        )}

        {/* Class List */}
        <h3 style={{ color: '#ffffff', marginBottom: '12px' }}>
          Classes for {selectedDate}
        </h3>

        {loading ? (
          <p style={{ color: '#888' }}>Loading attendance data...</p>
        ) : currentSchedule.length === 0 ? (
          <p style={{ color: '#888' }}>No classes scheduled for this day.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentSchedule.map((slot, idx) => {
              const status = dayAttendance[`slot_${idx}`] || 'unmarked';
              return (
                <div
                  key={idx}
                  style={{
                    border: '1px solid #2d2d2d',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: !slot.isCounted ? '#181818' : '#1e1e1e',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '15px', color: '#ffffff' }}>
                      {slot.subject}
                    </strong>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#888',
                        marginTop: '2px',
                      }}
                    >
                      {slot.time}
                    </div>
                    {!slot.isCounted && (
                      <span
                        style={{
                          fontSize: '10px',
                          color: '#666',
                          fontStyle: 'italic',
                        }}
                      >
                        Non-attendance slot
                      </span>
                    )}
                  </div>

                  {slot.isCounted ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleToggle(idx, 'present')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor:
                            status === 'present' ? '#2e7d32' : '#333333',
                          color: status === 'present' ? '#fff' : '#aaa',
                          fontWeight: status === 'present' ? 'bold' : 'normal',
                        }}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleToggle(idx, 'absent')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor:
                            status === 'absent' ? '#c62828' : '#333333',
                          color: status === 'absent' ? '#fff' : '#aaa',
                          fontWeight: status === 'absent' ? 'bold' : 'normal',
                        }}
                      >
                        Absent
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      Excluded
                    </span>
                  )}
                </div>
              );
            })}

            {/* Save / Update Action Button */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                onClick={handleSaveAttendance}
                disabled={saving}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: hasExistingRecord ? '#0284c7' : '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving
                  ? 'Saving...'
                  : hasExistingRecord
                  ? 'Update Attendance'
                  : 'Save Attendance'}
              </button>
              {hasChanges && (
                <small
                  style={{
                    display: 'block',
                    color: '#eab308',
                    marginTop: '8px',
                  }}
                >
                  ⚠️ You have unsaved changes. Click above to save.
                </small>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};