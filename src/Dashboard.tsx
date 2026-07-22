import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { getScheduleForDate, SubjectSlot } from './timetable_config';

interface DashboardProps {
  user: { id: string; email: string };
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

  const currentSchedule: SubjectSlot[] = getScheduleForDate(selectedDate);

  // Fetch attendance for selected date
  const fetchDateAttendance = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('attendance')
      .select('slot_key, status')
      .eq('user_id', user.id)
      .eq('date', selectedDate);

    if (!error && data) {
      const mapped: DayAttendance = {};
      data.forEach((row: any) => {
        mapped[row.slot_key] = row.status as AttendanceStatus;
      });
      setDayAttendance(mapped);
    }
    setLoading(false);
  }, [selectedDate, user.id]);

  // Fetch total overall statistics
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

  const handleToggle = async (slotIndex: number, status: AttendanceStatus) => {
    const slotKey = `slot_${slotIndex}`;
    
    // Optimistic UI Update
    setDayAttendance((prev) => ({ ...prev, [slotKey]: status }));

    const { error } = await supabase
      .from('attendance')
      .upsert(
        {
          user_id: user.id,
          date: selectedDate,
          slot_key: slotKey,
          status: status,
        },
        { onConflict: 'user_id,date,slot_key' }
      );

    if (error) {
      console.error('Error saving attendance:', error);
      fetchDateAttendance(); // Rollback if network error
    } else {
      fetchOverallStats();
    }
  };

  const handleBulkMark = async (status: AttendanceStatus) => {
    const updates = currentSchedule
      .map((slot, idx) => ({ slot, idx }))
      .filter(({ slot }) => slot.isCounted)
      .map(({ idx }) => ({
        user_id: user.id,
        date: selectedDate,
        slot_key: `slot_${idx}`,
        status: status,
      }));

    if (updates.length === 0) return;

    // Optimistic UI Update
    const newDayState = { ...dayAttendance };
    updates.forEach((u) => {
      newDayState[u.slot_key] = status;
    });
    setDayAttendance(newDayState);

    const { error } = await supabase
      .from('attendance')
      .upsert(updates, { onConflict: 'user_id,date,slot_key' });

    if (error) {
      console.error('Error bulk updating attendance:', error);
      fetchDateAttendance();
    } else {
      fetchOverallStats();
    }
  };

  const percentage =
    overallStats.total > 0
      ? ((overallStats.attended / overallStats.total) * 100).toFixed(1)
      : '100.0';

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>CSE Attendance Tracker</h2>
        <button onClick={onLogout} style={{ padding: '8px 12px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      {/* Stats Summary */}
      <div
        style={{
          background: '#f4f4f6',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        <div>
          <small>Total Classes</small>
          <h3>{overallStats.total}</h3>
        </div>
        <div>
          <small>Attended</small>
          <h3>{overallStats.attended}</h3>
        </div>
        <div>
          <small>Percentage</small>
          <h3 style={{ color: Number(percentage) >= 75 ? '#2e7d32' : '#d32f2f' }}>
            {percentage}%
          </h3>
        </div>
      </div>

      {/* Date Picker */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      {/* Bulk Action Buttons */}
      {currentSchedule.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => handleBulkMark('present')}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#4caf50',
              color: 'white',
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
              backgroundColor: '#f44336',
              color: 'white',
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
      <h3>Classes for {selectedDate}</h3>
      {loading ? (
        <p>Loading attendance...</p>
      ) : currentSchedule.length === 0 ? (
        <p style={{ color: '#666' }}>No classes scheduled for this day.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {currentSchedule.map((slot, idx) => {
            const status = dayAttendance[`slot_${idx}`] || 'unmarked';
            return (
              <div
                key={idx}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: !slot.isCounted ? '#f9f9f9' : '#fff',
                }}
              >
                <div>
                  <strong>{slot.subject}</strong>
                  <div style={{ fontSize: '12px', color: '#666' }}>{slot.time}</div>
                  {!slot.isCounted && (
                    <span style={{ fontSize: '10px', color: '#999' }}>Non-attendance slot</span>
                  )}
                </div>

                {slot.isCounted ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleToggle(idx, 'present')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: status === 'present' ? '#2e7d32' : '#e0e0e0',
                        color: status === 'present' ? '#fff' : '#000',
                        fontWeight: status === 'present' ? 'bold' : 'normal',
                      }}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleToggle(idx, 'absent')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: status === 'absent' ? '#c62828' : '#e0e0e0',
                        color: status === 'absent' ? '#fff' : '#000',
                        fontWeight: status === 'absent' ? 'bold' : 'normal',
                      }}
                    >
                      Absent
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: '12px', color: '#888' }}>Excluded</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};