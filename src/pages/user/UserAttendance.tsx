
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AttendanceCheckIn from '@/components/attendance/AttendanceCheckIn';
import { Loader } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  user_id: string;
  check_in_time: string;
  check_out_time: string | null;
  location: string;
}

interface AttendanceStat {
  total_visits: number;
  avg_duration_minutes: number;
  longest_session_minutes: number;
  most_active_day: string;
}

const UserAttendance = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceDates, setAttendanceDates] = useState<Date[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStat | null>(null);
  const today = new Date();
  
  useEffect(() => {
    if (!user) return;
    
    const fetchAttendanceRecords = async () => {
      setIsLoading(true);
      
      try {
        // Get attendance records
        const { data, error } = await supabase
          .from('attendance_records')
          .select('*')
          .eq('user_id', user.id)
          .order('check_in_time', { ascending: false })
          .limit(10);
          
        if (error) {
          console.error('Error fetching attendance records:', error);
          throw error;
        }
        
        setAttendanceRecords(data || []);
        
        // Extract unique dates for the calendar
        const dates = (data || []).map(record => new Date(record.check_in_time));
        setAttendanceDates(dates);
        
        // Calculate attendance statistics
        await calculateAttendanceStats(data || []);
        
      } catch (error) {
        console.error('Failed to fetch attendance records:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAttendanceRecords();
  }, [user]);
  
  // Calculate attendance statistics
  const calculateAttendanceStats = async (records: AttendanceRecord[]) => {
    // Get the first day of current month
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    // Filter records for current month
    const monthRecords = records.filter(record => 
      new Date(record.check_in_time) >= currentMonth
    );
    
    // Calculate total visits for current month
    const totalVisits = monthRecords.length;
    
    // Calculate average duration
    let totalDurationMinutes = 0;
    let completedSessionsCount = 0;
    let longestDuration = 0;
    
    // Track visits by day of week
    const dayCount = [0, 0, 0, 0, 0, 0, 0]; // Sun, Mon, ..., Sat
    
    monthRecords.forEach(record => {
      const checkIn = new Date(record.check_in_time);
      
      // Count by day of week
      const dayOfWeek = checkIn.getDay();
      dayCount[dayOfWeek]++;
      
      // Calculate duration if check-out exists
      if (record.check_out_time) {
        const checkOut = new Date(record.check_out_time);
        const durationMinutes = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60);
        
        totalDurationMinutes += durationMinutes;
        completedSessionsCount++;
        
        if (durationMinutes > longestDuration) {
          longestDuration = durationMinutes;
        }
      }
    });
    
    // Find most active day
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const mostActiveDayIndex = dayCount.indexOf(Math.max(...dayCount));
    const mostActiveDay = dayNames[mostActiveDayIndex];
    
    // Calculate average duration
    const averageDuration = completedSessionsCount > 0 
      ? Math.round(totalDurationMinutes / completedSessionsCount) 
      : 0;
    
    setAttendanceStats({
      total_visits: totalVisits,
      avg_duration_minutes: averageDuration,
      longest_session_minutes: Math.round(longestDuration),
      most_active_day: mostActiveDay
    });
  };
  
  // Format duration in hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Calculate duration between check-in and check-out
  const calculateDuration = (checkIn: string, checkOut: string | null) => {
    if (!checkOut) return 'In progress';
    
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();
    const diffMs = end - start;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Your Attendance</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceCheckIn />
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Calendar</CardTitle>
            <CardDescription>View your attendance history</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar 
              mode="single"
              selected={today}
              className="rounded-md border"
              modifiers={{
                attended: attendanceDates
              }}
              modifiersStyles={{
                attended: { backgroundColor: '#10b981', color: 'white', borderRadius: '100%' }
              }}
            />
            
            <div className="flex gap-4 mt-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                <span>Attended</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-200 mr-2"></div>
                <span>Missed</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                <span>Today</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center p-6">
              <Loader className="h-6 w-6 animate-spin text-gym-secondary" />
              <span className="ml-2">Loading attendance...</span>
            </div>
          ) : attendanceRecords.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No attendance records found</p>
          ) : (
            <div className="space-y-4">
              {attendanceRecords.map(record => (
                <div key={record.id} className="flex justify-between text-sm border-b pb-4">
                  <div>
                    <p className="font-medium">
                      {new Date(record.check_in_time).toLocaleDateString()}
                    </p>
                    <p className="text-gray-500">
                      {new Date(record.check_in_time).toLocaleTimeString()} 
                      {record.check_out_time ? ` - ${new Date(record.check_out_time).toLocaleTimeString()}` : ' (No checkout)'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {calculateDuration(record.check_in_time, record.check_out_time)}
                    </p>
                    <p className="text-xs text-gray-500">{record.location || 'Main Gym'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Attendance Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Current Month Stats</h3>
              <div className="flex flex-wrap gap-6">
                <div className="bg-gray-50 p-4 rounded-md border">
                  <p className="text-sm text-gray-500">Total Visits</p>
                  <p className="text-2xl font-bold">{attendanceStats?.total_visits || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md border">
                  <p className="text-sm text-gray-500">Average Duration</p>
                  <p className="text-2xl font-bold">
                    {attendanceStats ? formatDuration(attendanceStats.avg_duration_minutes) : '0h 0m'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md border">
                  <p className="text-sm text-gray-500">Longest Session</p>
                  <p className="text-2xl font-bold">
                    {attendanceStats ? formatDuration(attendanceStats.longest_session_minutes) : '0h 0m'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md border">
                  <p className="text-sm text-gray-500">Most Active Day</p>
                  <p className="text-2xl font-bold">{attendanceStats?.most_active_day || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Workout Consistency</h3>
              <div className="h-20 bg-gray-100 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Chart placeholder</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAttendance;
