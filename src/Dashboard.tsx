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

  // Fetch attendance for selected date
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
      // Only treat as an existing record if there is at least one present/absent mark
      const activeRecords = data.filter((row: any) => row.status !== 'unmarked');
      
      if (activeRecords.length > 0) {
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

  // Fetch total stats across all dates (ignoring 'unmarked' slots)
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
        // 'unmarked' status is explicitly ignored!
      });
      setOverallStats({ total, attended });
    }
  }, [user.id]);

  useEffect(() => {
    fetchDateAttendance();
    fetchOverallStats();
  }, [selectedDate, fetchDateAttendance, fetchOverallStats]);

  // Handle local state changes (click active button to unselect)
  const handleToggle = (slotIndex: number, clickedStatus: AttendanceStatus) => {
    const slotKey = `slot_${slotIndex}`;
    const currentStatus = dayAttendance[slotKey] || 'unmarked';

    const newStatus: AttendanceStatus =
      currentStatus === clickedStatus ? 'unmarked' : clickedStatus;

    setDayAttendance((prev) => ({ ...prev, [slotKey]: newStatus }));
    setHasChanges(true);
  };

  // Bulk mark core subjects while skipping OE/Minor
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

  // Save/Update changes to Supabase (Handles deleting unselected slots)
  const handleSaveAttendance = async () => {
    setSaving(true);

    const activeUpdates: any[] = [];
    const slotsToDelete: string[] = [];

    currentSchedule.forEach((slot, idx) => {
      if (slot.isCounted) {
        const slotKey = `slot_${idx}`;
        const status = dayAttendance[slotKey];

        if (status === 'present' || status === 'absent') {
          activeUpdates.push({
            user_id: user.id,
            date: selectedDate,
            slot_key: slotKey,
            status: status,
          });
        } else {
          // If status is unmarked or cleared, mark slot for deletion from DB
          slotsToDelete.push(slotKey);
        }
      }
    });

    let hasError = false;

    // 1. Delete cleared/unmarked slots from database
    if (slotsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('attendance')
        .delete()
        .eq('user_id', user.id)
        .eq('date', selectedDate)
        .in('slot_key', slotsToDelete);

      if (deleteError) {
        console.error('Error deleting unmarked slots:', deleteError);
        hasError = true;
      }
    }

    // 2. Upsert active present/absent slots
    if (activeUpdates.length > 0) {
      const { error: upsertError } = await supabase
        .from('attendance')
        .upsert(activeUpdates, { onConflict: 'user_id,date,slot_key' });

      if (upsertError) {
        console.error('Error saving attendance:', upsertError);
        hasError = true;
      }
    }

    setSaving(false);

    if (hasError) {
      alert('Failed to update attendance. Please try again.');
    } else {
      setHasChanges(false);
      setHasExistingRecord(activeUpdates.length > 0);
      fetchOverallStats();
      alert(
        activeUpdates.length > 0
          ? 'Attendance saved successfully!'
          : 'Attendance cleared for this date!'
      );
    }
  };

  const { total, attended } = overallStats;
  const currentPercentage =
    total > 0 ? (attended / total) * 100 : 100;

  // Calculate target recommendation
  let targetMessage = '';
  if (total === 0) {
    targetMessage = 'Mark your first class to see attendance insights!';
  } else if (currentPercentage < 75) {
    const requiredToAttend = Math.max(0, Math.ceil(3 * total - 4 * attended));
    targetMessage = `⚠️ Below target! You need to attend the next ${requiredToAttend} class${
      requiredToAttend === 1 ? '' : 'es'
    } continuously to reach 75%.`;
  } else {
    const safeBunks = Math.floor((4 * attended - 3 * total) / 3);
    if (safeBunks > 0) {
      targetMessage = `🎉 You're safe! You can bunk ${safeBunks} class${
        safeBunks === 1 ? '' : 'es'
      } and still stay at or above 75%.`;
    } else {
      targetMessage = `⚡ On the edge! Attending your next class will give you a margin to bunk.`;
    }
  }

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
            marginBottom: '12px',
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <small style={{ color: '#888' }}>Total Classes</small>
            <h3 style={{ margin: '4px 0 0 0', color: '#fff' }}>{total}</h3>
          </div>
          <div style={{ textAlign: 'center' }}>
            <small style={{ color: '#888' }}>Attended</small>
            <h3 style={{ margin: '4px 0 0 0', color: '#fff' }}>{attended}</h3>
          </div>
          <div style={{ textAlign: 'center' }}>
            <small style={{ color: '#888' }}>Percentage</small>
            <h3
              style={{
                margin: '4px 0 0 0',
                color: currentPercentage >= 75 ? '#4caf50' : '#f44336',
              }}
            >
              {currentPercentage.toFixed(1)}%
            </h3>
          </div>
        </div>

        {/* 75% Target Status Card */}
        <div
          style={{
            backgroundColor: currentPercentage >= 75 ? '#112918' : '#321414',
            border: `1px solid ${currentPercentage >= 75 ? '#2e7d32' : '#c62828'}`,
            color: currentPercentage >= 75 ? '#81c784' : '#ef5350',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          {targetMessage}
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