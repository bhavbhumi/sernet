import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AttendancePolicies {
  office_start_time: string;
  grace_period_minutes: number;
  half_day_after_time: string;
  min_full_day_hours: number;
  half_day_min_hours: number;
  saturday_full_day_hours: number;
  auto_absent_if_no_checkin: boolean;
  week_off_days: number[];
}

export interface DepartmentShift {
  id: string;
  department_name: string;
  weekday_start: string;
  weekday_end: string;
  saturday_start: string;
  saturday_end: string;
  grace_minutes: number;
  is_active: boolean;
}

const DEFAULTS: AttendancePolicies = {
  office_start_time: '10:00',
  grace_period_minutes: 15,
  half_day_after_time: '12:00',
  min_full_day_hours: 7.5,
  half_day_min_hours: 5,
  saturday_full_day_hours: 5,
  auto_absent_if_no_checkin: true,
  week_off_days: [0],
};

export function useAttendancePolicies() {
  const [policies, setPolicies] = useState<AttendancePolicies>(DEFAULTS);
  const [shifts, setShifts] = useState<DepartmentShift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('attendance_policies').select('policy_key, policy_value'),
      supabase.from('department_shifts' as any).select('*').eq('is_active', true),
    ]).then(([polRes, shiftRes]) => {
      if (polRes.data && polRes.data.length > 0) {
        const map: Record<string, string> = {};
        polRes.data.forEach((r: any) => { map[r.policy_key] = r.policy_value; });
        setPolicies({
          office_start_time: map.office_start_time || DEFAULTS.office_start_time,
          grace_period_minutes: Number(map.grace_period_minutes) || DEFAULTS.grace_period_minutes,
          half_day_after_time: map.half_day_after_time || DEFAULTS.half_day_after_time,
          min_full_day_hours: Number(map.min_full_day_hours) || DEFAULTS.min_full_day_hours,
          half_day_min_hours: Number(map.half_day_min_hours) || DEFAULTS.half_day_min_hours,
          saturday_full_day_hours: Number(map.saturday_full_day_hours) || DEFAULTS.saturday_full_day_hours,
          auto_absent_if_no_checkin: map.auto_absent_if_no_checkin !== 'false',
          week_off_days: map.week_off_days
            ? map.week_off_days.split(',').map(Number)
            : DEFAULTS.week_off_days,
        });
      }
      setShifts((shiftRes.data || []) as DepartmentShift[]);
      setLoading(false);
    });
  }, []);

  return { policies, shifts, loading };
}

/** Get effective shift timing for a department on a given date */
export function getEffectiveShift(
  department: string,
  date: Date,
  shifts: DepartmentShift[],
  policies: AttendancePolicies
): { startTime: string; graceMinutes: number; minFullDayHours: number; minHalfDayHours: number } {
  const isSaturday = date.getDay() === 6;
  const shift = shifts.find(s => s.department_name.toLowerCase() === department.toLowerCase());

  if (isSaturday) {
    const startTime = shift?.saturday_start?.slice(0, 5) || '10:00';
    return {
      startTime,
      graceMinutes: shift?.grace_minutes || policies.grace_period_minutes,
      minFullDayHours: policies.saturday_full_day_hours,
      minHalfDayHours: policies.half_day_min_hours / 2, // e.g. 2.5 hrs for Saturday half-day
    };
  }

  return {
    startTime: shift?.weekday_start?.slice(0, 5) || policies.office_start_time,
    graceMinutes: shift?.grace_minutes || policies.grace_period_minutes,
    minFullDayHours: policies.min_full_day_hours,
    minHalfDayHours: policies.half_day_min_hours,
  };
}

/** Determine attendance status from check-in/out times using policies (department-aware) */
export function determineStatus(
  checkInTime: Date,
  checkOutTime: Date | null,
  policies: AttendancePolicies,
  department?: string,
  shifts?: DepartmentShift[]
): { status: string; isLate: boolean } {
  const effective = (department && shifts)
    ? getEffectiveShift(department, checkInTime, shifts, policies)
    : {
        startTime: policies.office_start_time,
        graceMinutes: policies.grace_period_minutes,
        minFullDayHours: checkInTime.getDay() === 6 ? policies.saturday_full_day_hours : policies.min_full_day_hours,
        minHalfDayHours: checkInTime.getDay() === 6 ? policies.half_day_min_hours / 2 : policies.half_day_min_hours,
      };

  const [startH, startM] = effective.startTime.split(':').map(Number);
  const startTotalMin = startH * 60 + startM;

  const ciH = checkInTime.getHours();
  const ciM = checkInTime.getMinutes();
  const ciTotalMin = ciH * 60 + ciM;

  const isLate = ciTotalMin > startTotalMin + effective.graceMinutes;

  // Half-day cutoff = start + minFullDayHours (in minutes from midnight)
  const halfDayCutoffMin = startTotalMin + (effective.minFullDayHours * 60);

  if (!checkOutTime) {
    if (ciTotalMin >= halfDayCutoffMin) return { status: 'half_day', isLate };
    return { status: 'present', isLate };
  }

  const hoursWorked = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

  if (hoursWorked < effective.minHalfDayHours) {
    return { status: 'absent', isLate };
  }
  if (hoursWorked < effective.minFullDayHours) {
    return { status: 'half_day', isLate };
  }
  return { status: 'present', isLate };
}

/** Calculate effective present days (full=1, half=0.5) */
export function calcEffectiveDays(logs: any[]): number {
  let total = 0;
  logs.forEach(l => {
    if (l.status === 'present') total += 1;
    else if (l.status === 'half_day') total += 0.5;
  });
  return total;
}

/** Calculate LOP days for an employee in a month */
export function calcLopDays(
  workingDays: number,
  attendanceLogs: any[],
  approvedLeaves: { days_count: number; is_paid: boolean }[]
): number {
  const effectivePresent = calcEffectiveDays(attendanceLogs);
  const paidLeaveDays = approvedLeaves
    .filter(l => l.is_paid)
    .reduce((s, l) => s + l.days_count, 0);
  const lopDays = Math.max(0, workingDays - effectivePresent - paidLeaveDays);
  return Math.round(lopDays * 2) / 2; // round to nearest 0.5
}
