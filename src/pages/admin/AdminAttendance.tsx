import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type AttendanceRecord = Database['public']['Views']['admin_attendance_view']['Row'];

const AdminAttendance = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [manualCheckInSearch, setManualCheckInSearch] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState<string | null>(null);

  // Fetch attendance records
  const fetchAttendanceRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_attendance_view')
        .select('*')
        .order('check_in_time', { ascending: false });

      if (error) throw error;
      setAttendanceRecords(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch attendance records",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchAttendanceRecords();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchAttendanceRecords, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Filter records based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRecords(attendanceRecords);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = attendanceRecords.filter(record => 
      record.full_name.toLowerCase().includes(query) ||
      record.email.toLowerCase().includes(query) ||
      record.membership_plan?.toLowerCase().includes(query)
    );
    setFilteredRecords(filtered);
  }, [searchQuery, attendanceRecords]);

  // Handle check-out
  const handleCheckOut = async (attendanceId: string) => {
    if (isCheckingOut === attendanceId) return;
    
    setIsCheckingOut(attendanceId);
    try {
      const { error } = await supabase
        .from('attendance_records')
        .update({ 
          check_out_time: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', attendanceId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member has been checked out successfully",
      });

      // Refresh the attendance records
      await fetchAttendanceRecords();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to check out member",
      });
    } finally {
      setIsCheckingOut(null);
    }
  };

  // Handle manual check-in
  const handleManualCheckIn = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('attendance_records')
        .insert({
          user_id: userId,
          check_in_time: new Date().toISOString(),
          location: 'Main Gym',
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member has been checked in successfully",
      });

      // Refresh the attendance records
      await fetchAttendanceRecords();
      setManualCheckInSearch('');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to check in member",
      });
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  // Get current stats
  const currentStats = {
    currentlyCheckedIn: attendanceRecords.filter(r => r.is_currently_checked_in).length,
    totalToday: attendanceRecords.filter(r => 
      new Date(r.check_in_time).toDateString() === new Date().toDateString()
    ).length,
    totalThisMonth: attendanceRecords.filter(r => 
      new Date(r.check_in_time).getMonth() === new Date().getMonth() &&
      new Date(r.check_in_time).getFullYear() === new Date().getFullYear()
    ).length
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Attendance Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Current Status</CardTitle>
            <CardDescription>Members currently in the gym</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gym-primary">{currentStats.currentlyCheckedIn}</div>
            <div className="flex gap-2 items-center mt-2 text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Active now</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Today</CardTitle>
            <CardDescription>Check-ins for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gym-primary">{currentStats.totalToday}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>This Month</CardTitle>
            <CardDescription>{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gym-primary">{currentStats.totalThisMonth}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/4">
          <Tabs defaultValue="current">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="current">Currently Checked In</TabsTrigger>
                <TabsTrigger value="history">Check-in History</TabsTrigger>
              </TabsList>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Search members..." 
                  className="pl-10 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <TabsContent value="current" className="mt-0">
              <Card>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex justify-center items-center p-6">
                      <Loader className="h-6 w-6 animate-spin text-gym-secondary" />
                      <span className="ml-2">Loading attendance...</span>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 text-left">
                            <th className="font-medium p-4">Member Name</th>
                            <th className="font-medium p-4">Membership</th>
                            <th className="font-medium p-4">Check-in Time</th>
                            <th className="font-medium p-4">Duration</th>
                            <th className="font-medium p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filteredRecords
                            .filter(record => record.is_currently_checked_in)
                            .map(record => (
                              <tr key={record.attendance_id}>
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                      <img 
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(record.full_name)}&background=random`}
                                        alt={record.full_name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <div className="font-medium">{record.full_name}</div>
                                      <div className="text-xs text-gray-500">{record.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">{record.membership_plan || 'N/A'}</td>
                                <td className="p-4">
                                  {new Date(record.check_in_time).toLocaleTimeString()}
                                </td>
                                <td className="p-4">
                                  {formatDuration(record.duration_minutes)}
                                </td>
                                <td className="p-4">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleCheckOut(record.attendance_id)}
                                    disabled={isCheckingOut === record.attendance_id}
                                  >
                                    {isCheckingOut === record.attendance_id ? (
                                      <>
                                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                                        Processing...
                                      </>
                                    ) : (
                                      'Check Out'
                                    )}
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <Card>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex justify-center items-center p-6">
                      <Loader className="h-6 w-6 animate-spin text-gym-secondary" />
                      <span className="ml-2">Loading history...</span>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 text-left">
                            <th className="font-medium p-4">Member Name</th>
                            <th className="font-medium p-4">Date</th>
                            <th className="font-medium p-4">Check-in</th>
                            <th className="font-medium p-4">Check-out</th>
                            <th className="font-medium p-4">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filteredRecords
                            .filter(record => !record.is_currently_checked_in)
                            .map(record => (
                              <tr key={record.attendance_id}>
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                      <img 
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(record.full_name)}&background=random`}
                                        alt={record.full_name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <div className="font-medium">{record.full_name}</div>
                                      <div className="text-xs text-gray-500">{record.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  {new Date(record.check_in_time).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                  {new Date(record.check_in_time).toLocaleTimeString()}
                                </td>
                                <td className="p-4">
                                  {record.check_out_time 
                                    ? new Date(record.check_out_time).toLocaleTimeString()
                                    : 'N/A'
                                  }
                                </td>
                                <td className="p-4">
                                  {formatDuration(record.duration_minutes)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="w-full lg:w-1/4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manual Check-in</CardTitle>
              <CardDescription>Process a member check-in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Search member by name or ID..." 
                    className="pl-10"
                    value={manualCheckInSearch}
                    onChange={(e) => setManualCheckInSearch(e.target.value)}
                  />
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => handleManualCheckIn(manualCheckInSearch)}
                  disabled={!manualCheckInSearch.trim()}
                >
                  Check In Member
                </Button>
                <Button variant="outline" className="w-full">Scan Membership Card</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Attendance by Day</CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-8 bg-gym-secondary rounded-full"></div>
                    <span>Monday</span>
                  </div>
                  <span className="font-medium">178</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-8 bg-gym-secondary rounded-full"></div>
                    <span>Sunday</span>
                  </div>
                  <span className="font-medium">122</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-8 bg-gym-secondary rounded-full"></div>
                    <span>Saturday</span>
                  </div>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-8 bg-gym-secondary rounded-full"></div>
                    <span>Friday</span>
                  </div>
                  <span className="font-medium">192</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-8 bg-gym-secondary rounded-full"></div>
                    <span>Thursday</span>
                  </div>
                  <span className="font-medium">184</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance;
