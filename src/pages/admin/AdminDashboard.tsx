import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader, Users, ShoppingBag, UserCheck, DollarSign, Package, AlertCircle } from 'lucide-react';
import { DashboardStats } from '@/types/supabase-extensions';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTypedQuery } from '@/hooks/supabase/useTypedQuery';
import { getFakeEmail } from '@/hooks/supabase/useUserEmail';

interface RecentUser {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  created_at: string;
  email?: string;
}

interface RecentOrder {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  payment_status: string;
  user_name?: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [planDistribution, setPlanDistribution] = useState<{name: string, count: number}[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        // Fetch total users count
        const { data: totalUsers, error: totalUsersError } = await supabase
          .from('profiles')
          .select('count')
          .single();
          
        if (totalUsersError) throw totalUsersError;
        
        // Fetch total admins count
        const { data: totalAdmins, error: totalAdminsError } = await supabase
          .from('profiles')
          .select('count')
          .eq('role', 'admin')
          .single();
          
        if (totalAdminsError) throw totalAdminsError;
        
        // Fetch active subscriptions count
        const { data: activeSubscriptions, error: activeSubscriptionsError } = await supabase
          .from('user_subscriptions')
          .select('count')
          .eq('is_active', true)
          .gt('end_date', new Date().toISOString())
          .single();
          
        if (activeSubscriptionsError) throw activeSubscriptionsError;
        
        // Fetch today's attendance count
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { data: todayAttendance, error: todayAttendanceError } = await supabase
          .from('attendance_records')
          .select('count')
          .gte('check_in_time', today.toISOString())
          .single();
          
        if (todayAttendanceError) throw todayAttendanceError;
        
        // Fetch today's orders count
        const { data: todayOrders, error: todayOrdersError } = await supabase
          .from('orders')
          .select('count')
          .gte('created_at', today.toISOString())
          .single();
          
        if (todayOrdersError) throw todayOrdersError;
        
        // Fetch today's revenue sum
        const { data: todayRevenue, error: todayRevenueError } = await supabase
          .from('orders')
          .select('total_amount')
          .gte('created_at', today.toISOString());
          
        if (todayRevenueError) throw todayRevenueError;
        
        // Calculate today's revenue sum
        const revenueSum = todayRevenue?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
        
        // Fetch low stock items count
        const { data: lowStockItems, error: lowStockItemsError } = await supabase
          .from('products')
          .select('count')
          .lt('stock_quantity', 10)
          .single();
          
        if (lowStockItemsError) throw lowStockItemsError;
        
        // Create stats object
        const adminStats: DashboardStats = {
          total_users: parseInt(String(totalUsers?.count || '0')),
          total_admins: parseInt(String(totalAdmins?.count || '0')),
          total_regular_users: parseInt(String(totalUsers?.count || '0')) - parseInt(String(totalAdmins?.count || '0')),
          active_subscriptions: parseInt(String(activeSubscriptions?.count || '0')),
          today_attendance: parseInt(String(todayAttendance?.count || '0')),
          today_orders: parseInt(String(todayOrders?.count || '0')),
          today_revenue: revenueSum,
          low_stock_items: parseInt(String(lowStockItems?.count || '0'))
        };
        
        setStats(adminStats);
        
        // Fetch membership plan distribution
        const { data: plans } = await supabase
          .from('membership_plans')
          .select('id, name')
          .eq('is_active', true);
        
        if (plans) {
          const planStats = await Promise.all(plans.map(async (plan) => {
            const { data, error } = await supabase
              .from('user_subscriptions')
              .select('count')
              .eq('plan_id', plan.id)
              .eq('is_active', true)
              .gt('end_date', new Date().toISOString())
              .single();
              
            if (error) throw error;
            
            return {
              name: plan.name,
              count: parseInt(String(data?.count || '0'))
            };
          }));
          
          setPlanDistribution(planStats);
        }
        
        // Fetch recent users
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, role, created_at')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (profilesError) throw profilesError;
        
        if (profilesData) {
          // Generate fake emails for users since we can't access auth.users
          const usersWithEmails = profilesData.map(profile => ({
            ...profile,
            email: getFakeEmail(profile.id)
          }));
          
          setRecentUsers(usersWithEmails);
        }
        
        // Fetch recent orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('id, user_id, total_amount, status, created_at, payment_status')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (ordersError) throw ordersError;
        
        if (ordersData) {
          // Get user names separately for each order
          const ordersWithUserNames = await Promise.all(
            ordersData.map(async (order) => {
              const { data: userData } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', order.user_id)
                .maybeSingle();
                
              return {
                ...order,
                user_name: userData?.full_name || 'Unknown'
              };
            })
          );
          
          setRecentOrders(ordersWithUserNames);
        }
        
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardStats();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-gym-secondary" />
      </div>
    );
  }
  
  // Helper functions to format numbers and ensure they're strings
  const formatNumber = (value: number | undefined): string => {
    return value !== undefined ? value.toString() : "0";
  };
  
  // Helper function for formatting revenue with 2 decimal places
  const formatRevenue = (value: number | undefined): string => {
    return value !== undefined ? value.toFixed(2) : "0.00";
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the admin dashboard. Here's what's happening in your gym.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-600" />
              Total Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.total_users || 0}</p>
            <p className="text-sm text-muted-foreground">
              {stats?.total_regular_users || 0} regular users, {stats?.total_admins || 0} admins
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <UserCheck className="mr-2 h-5 w-5 text-green-600" />
              Today's Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.today_attendance || 0}</p>
            <p className="text-sm text-muted-foreground">
              people visited the gym today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5 text-purple-600" />
              Today's Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.today_orders || 0}</p>
            <p className="text-sm text-muted-foreground">
              orders processed today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-yellow-600" />
              Today's Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${stats?.today_revenue ? stats.today_revenue.toFixed(2) : '0.00'}</p>
            <p className="text-sm text-muted-foreground">
              total revenue generated today
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Recently registered members</CardDescription>
          </CardHeader>
          <CardContent>
            {recentUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="font-medium p-3">User</th>
                      <th className="font-medium p-3">Role</th>
                      <th className="font-medium p-3">Joined</th>
                      <th className="font-medium p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                              {user.avatar_url ? (
                                <img 
                                  src={user.avatar_url}
                                  alt={user.full_name || "User"} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-xs font-medium">
                                  {user.full_name?.charAt(0) || "U"}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{user.full_name || "Anonymous"}</p>
                              {user.email && <p className="text-xs text-gray-500">{user.email}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-3 text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <Button size="sm" variant="outline">View Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No users found
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => navigate('/admin/members')}
                variant="outline"
              >
                View All Members
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Inventory Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Low Stock Items</p>
                  <p className="text-sm font-medium text-red-500">{stats?.low_stock_items || 0} items</p>
                </div>
                {stats?.low_stock_items ? (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <p className="text-sm text-red-700">
                      {stats.low_stock_items} items are running low on stock. Check inventory and restock soon.
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <p className="text-sm text-green-700">
                      All items are well-stocked. No action needed.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Quick Inventory Actions</p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => navigate('/admin/inventory')}
                  >
                    View inventory status
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => navigate('/admin/inventory')}
                  >
                    Add new products
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from the store</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="font-medium p-3">Order ID</th>
                      <th className="font-medium p-3">Customer</th>
                      <th className="font-medium p-3">Amount</th>
                      <th className="font-medium p-3">Status</th>
                      <th className="font-medium p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="p-3 font-medium">{order.id.substring(0, 8)}</td>
                        <td className="p-3">{order.user_name}</td>
                        <td className="p-3">${order.total_amount.toFixed(2)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3 text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No recent orders found
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => navigate('/admin/orders')}
                variant="outline"
              >
                View All Orders
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your gym</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button 
                className="h-auto p-4 justify-start items-start flex-col" 
                variant="outline"
                onClick={() => navigate('/admin/members')}
              >
                <Users className="h-6 w-6 mb-2" />
                <span className="font-medium">Manage Members</span>
                <span className="text-xs text-muted-foreground mt-1">
                  View and edit user profiles
                </span>
              </Button>
              
              <Button 
                className="h-auto p-4 justify-start items-start flex-col" 
                variant="outline"
                onClick={() => navigate('/admin/inventory')}
              >
                <Package className="h-6 w-6 mb-2" />
                <span className="font-medium">Inventory</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Manage products and stock
                </span>
              </Button>
              
              <Button 
                className="h-auto p-4 justify-start items-start flex-col" 
                variant="outline"
                onClick={() => navigate('/admin/attendance')}
              >
                <UserCheck className="h-6 w-6 mb-2" />
                <span className="font-medium">Attendance</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Track gym visits
                </span>
              </Button>
              
              <Button 
                className="h-auto p-4 justify-start items-start flex-col" 
                variant="outline"
                onClick={() => navigate('/admin/orders')}
              >
                <ShoppingBag className="h-6 w-6 mb-2" />
                <span className="font-medium">Orders</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Manage purchases
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
