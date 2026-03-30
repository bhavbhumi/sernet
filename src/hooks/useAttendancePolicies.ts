import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AttendancePolicies {
  office_start_time: string;       // "10:00"
  grace_period_minutes: number;    // 15
  half_day_after_time: string;     // "12:00"
  min_full_day_hours: number;      // 7
  half_day_min_hours: number;      // 3
  auto_absent_if_no_checkin: boolean;
  week_off_days: number[];         // [0] = Sunday
}

const DEFAULTS: AttendancePolicies = {
  office_start_time: '10:00',
  grace_period_minutes: 15,
  half_day_after_time: '12:00',
  min_full_day_hours: 7,
  half_day_min_hours: 3,
  auto_absent_if_no_checkin: true,
  week_off_days: [0],
};

export function useAttendancePolicies() {
  const [policies, setPolicies] = useState<AttendancePolicies>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('attendance_policies').select('policy_key, policy_value').then(({ data }) => {
      if (data && data.length > 0) {
        const map: Record<string, string> = {};
        data.forEach((r: any) => { map[r.policy_key] = r.policy_value; });
        setPolicies({
          office_start_time: map.office_start_time || DEFAULTS.office_start_time,
          grace_period_minutes: Number(map.grace_period_minutes) || DEFAULTS.grace_period_minutes,
          half_day_after_time: map.half_day_after_time || DEFAULTS.half_day_after_time,
          min_full_day_hours: Number(map.min_full_day_hours) || DEFAULTS.min_full_day_hours,
          half_day_min_hours: Number(map.half_day_min_hours) || DEFAULTS.half_day_min_hours,
          auto_absent_if_no_checkin: map.auto_absent_if_no_checkin !== 'false',
          week_off_days: map.week_off_days
            ? map.week_off_days.split(',').map(Number)
            : DEFAULTS.week_off_days,
        });
      }
      setLoading(false);
    });
  }, []);

  return { policies, loading };
}

/** Determine attendance status from check-in/out times using policies */
export function determineStatus(
  checkInTime: Date,
  checkOutTime: Date | null,
  policies: AttendancePolicies
): { status: string; isLate: boolean } {
  const [startH, startM] = policies.office_start_time.split(':').map(Number);
  const [halfDayH, halfDayM] = policies.half_day_after_time.split(':').map(Number);
  const graceMinutes = policies.grace_period_minutes;

  const ciH = checkInTime.getHours();
  const ciM = checkInTime.getMinutes();
  const ciTotalMin = ciH * 60 + ciM;
  const startTotalMin = startH * 60 + startM;
  const halfDayTotalMin = halfDayH * 60 + halfDayM;

  const isLate = ciTotalMin > startTotalMin + graceMinutes;

  // If no check-out yet, preliminary status
  if (!checkOutTime) {
    if (ciTotalMin >= halfDayTotalMin) return { status: 'half_day', isLate };
    return { status: 'present', isLate };
  }

  // Calculate hours worked
  const hoursWorked = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

  if (hoursWorked < policies.half_day_min_hours) {
    return { status: 'absent', isLate };
  }
  if (hoursWorked < policies.min_full_day_hours || ciTotalMin >= halfDayTotalMin) {
    return { status: 'half_day', isLate };
  }
  return { status: 'present', isLate };
}
