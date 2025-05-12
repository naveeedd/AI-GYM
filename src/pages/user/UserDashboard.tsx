import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Activity, Clock, Users, Dumbbell, ShoppingBag, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Define the UserStats type based on the user_stats_view database view
type UserStats = {
  user_id: string | null;
  recent_visits: number | null;
  total_visits_month: number | null;
  membership_status: string | null;
  membership_days_left: number | null;
};

const UserDashboard = () => {
  const { user, profile } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // Fetch user stats
        const { data: stats, error: statsError } = await supabase
          .from('user_stats_view')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (statsError) throw statsError;
        setUserStats(stats);
        
        // Here we would fetch upcoming classes
        // For demo purposes, we'll leave this empty for now
        setUpcomingClasses([]);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-20" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Member';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {userName}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your fitness journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Calendar className="mr-2 h-5 w-5" />
              Membership Status
            </CardTitle>
            <CardDescription>Your current subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{userStats?.membership_status || 'Not Active'}</p>
            {userStats?.membership_days_left && (
              <p className="text-sm text-muted-foreground mt-1">
                {userStats.membership_days_left} days remaining
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Link to="/user/subscription" className="w-full">
              <Button variant="outline" className="w-full">
                Manage Subscription
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Activity className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your gym attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{userStats?.recent_visits || 0} visits</p>
            <p className="text-sm text-muted-foreground mt-1">
              in the last 7 days
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/user/attendance" className="w-full">
              <Button variant="outline" className="w-full">
                View Attendance
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Clock className="mr-2 h-5 w-5" />
              Monthly Activity
            </CardTitle>
            <CardDescription>Your monthly progress</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{userStats?.total_visits_month || 0} visits</p>
            <p className="text-sm text-muted-foreground mt-1">
              this month
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/user/attendance" className="w-full">
              <Button variant="outline" className="w-full">
                Check Statistics
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Users className="mr-2 h-5 w-5" />
              Classes
            </CardTitle>
            <CardDescription>Upcoming group classes</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingClasses.length > 0 ? (
              <div>
                {upcomingClasses.map((cls) => (
                  <div key={cls.id} className="mb-2">
                    <p className="font-medium">{cls.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(cls.start_time).toLocaleDateString()} at {new Date(cls.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg font-medium">Find a class that fits your schedule</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Browse Classes
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Shop
            </CardTitle>
            <CardDescription>Browse our products</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">Find supplements and gear</p>
          </CardContent>
          <CardFooter>
            <Link to="/user/products" className="w-full">
              <Button variant="outline" className="w-full">
                Shop Products
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
