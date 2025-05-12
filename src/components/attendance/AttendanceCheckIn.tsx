import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader, CheckCircle, XCircle } from 'lucide-react';

const AttendanceCheckIn = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<'none' | 'in' | 'out'>('none');
  const [currentAttendance, setCurrentAttendance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already checked in today
  const checkCurrentStatus = async () => {









    
    if (!user || !session) {
      console.log('No user or session found, skipping attendance check');
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please log in to check your attendance.",
      });
      return;
    }
    
    setIsLoading(true);
    console.log('Checking attendance status for user:', user.id);
    console.log('Current session:', session);
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      console.log('Fetching attendance records from:', today.toISOString());
      
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('user_id', user.id)
        .gte('check_in_time', today.toISOString())
        .order('check_in_time', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (error) {
        console.error('Error checking attendance status:', error);
        throw error;
      }
      
      console.log('Attendance data:', data);
      
      if (data) {
        setCurrentAttendance(data);
        setCheckInStatus(data.check_out_time ? 'out' : 'in');
      } else {
        setCheckInStatus('none');
        setCurrentAttendance(null);
      }
      
    } catch (error: any) {
      console.error('Failed to check attendance status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to check attendance status. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Record attendance
  const recordAttendance = async () => {
    if (!user || !session) {
      console.log('No user or session found, cannot record attendance');
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please log in to record your attendance.",
      });
      return;
    }
    
    setIsChecking(true);
    console.log('Recording attendance for user:', user.id);
    console.log('Current session:', session);
    
    try {
      if (checkInStatus === 'none' || checkInStatus === 'out') {
        // Checking in
        console.log('Creating new check-in record');
        
        const { data, error } = await supabase
          .from('attendance_records')
          .insert({
            user_id: user.id,
            check_in_time: new Date().toISOString(),
            location: 'Main Gym',
            created_by: user.id
          })
          .select()
          .maybeSingle();
          
        if (error) {
          console.error('Error creating check-in record:', error);
          throw error;
        }
        
        console.log('Check-in record created:', data);
        
        if (data) {
          setCurrentAttendance(data);
          setCheckInStatus('in');
          
          toast({
            title: "Checked In Successfully",
            description: "Welcome to the gym! Your check-in has been recorded.",
          });
        } else {
          throw new Error('Failed to create check-in record');
        }
      } else {
        // Checking out
        console.log('Updating check-out time for record:', currentAttendance.id);
        
        const { data, error } = await supabase
          .from('attendance_records')
          .update({ 
            check_out_time: new Date().toISOString() 
          })
          .eq('id', currentAttendance.id)
          .select()
          .maybeSingle();
          
        if (error) {
          console.error('Error updating check-out time:', error);
          throw error;
        }
        
        console.log('Check-out record updated:', data);
        
        if (data) {
          setCurrentAttendance(data);
          setCheckInStatus('out');
          
          // Calculate duration
          const checkIn = new Date(data.check_in_time);
          const checkOut = new Date(data.check_out_time);
          const durationMinutes = Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60));
          const hours = Math.floor(durationMinutes / 60);
          const minutes = durationMinutes % 60;
          
          toast({
            title: "Checked Out Successfully",
            description: `Thank you for your visit! Duration: ${hours}h ${minutes}m`,
          });
        } else {
          throw new Error('Failed to update check-out time');
        }
      }
      
    } catch (error: any) {
      console.error('Error recording attendance:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to record attendance. Please try again.",
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  // Load status on component mount and when user/session changes
  useEffect(() => {
    console.log('AttendanceCheckIn component mounted/updated');
    console.log('User:', user);
    console.log('Session:', session);
    checkCurrentStatus();
  }, [user, session]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Attendance</CardTitle>
        <CardDescription>Check in when you arrive and check out when you leave</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center p-6">
              <Loader className="h-6 w-6 animate-spin text-gym-secondary" />
              <span className="ml-2">Loading status...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md border">
                <div>
                  <p className="font-medium">Status</p>
                  {checkInStatus === 'in' ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>Checked In</span>
                    </div>
                  ) : checkInStatus === 'out' ? (
                    <div className="flex items-center text-gray-600">
                      <XCircle className="h-4 w-4 mr-1" />
                      <span>Checked Out</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-600">
                      <XCircle className="h-4 w-4 mr-1" />
                      <span>Not Checked In</span>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={recordAttendance}
                  disabled={isChecking || !user || !session}
                  className={checkInStatus === 'in' ? 'bg-red-500 hover:bg-red-600' : ''}
                >
                  {isChecking ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    checkInStatus === 'in' ? 'Check Out' : 'Check In'
                  )}
                </Button>
              </div>
              
              {currentAttendance && (
                <div className="text-sm text-gray-600">
                  <p>
                    Check-in time: {new Date(currentAttendance.check_in_time).toLocaleTimeString()}
                  </p>
                  {currentAttendance.check_out_time && (
                    <p>
                      Check-out time: {new Date(currentAttendance.check_out_time).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceCheckIn;
