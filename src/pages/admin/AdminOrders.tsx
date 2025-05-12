import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface OrderStats {
  today_orders: number;
  yesterday_orders: number;
  pending_orders: number;
  monthly_revenue: number;
  top_product: {
    name: string;
    units_sold: number;
  };
}

const AdminOrders = () => {
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        setIsLoading(true);
        
        // Get today's date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get yesterday's date at midnight
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Get first day of current month
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Fetch today's orders count
        const { data: todayOrders, error: todayError } = await supabase
          .from('orders')
          .select('count')
          .gte('created_at', today.toISOString())
          .single();

        // Fetch yesterday's orders count
        const { data: yesterdayOrders, error: yesterdayError } = await supabase
          .from('orders')
          .select('count')
          .gte('created_at', yesterday.toISOString())
          .lt('created_at', today.toISOString())
          .single();

        // Fetch pending orders count
        const { data: pendingOrders, error: pendingError } = await supabase
          .from('orders')
          .select('count')
          .eq('status', 'pending')
          .single();

        // Fetch monthly revenue
        const { data: monthlyRevenue, error: revenueError } = await supabase
          .from('orders')
          .select('total_amount')
          .gte('created_at', firstDayOfMonth.toISOString());

        // Fetch top selling product
        const { data: topProduct, error: topProductError } = await supabase
          .from('order_items')
          .select('product_id, quantity, products(name)')
          .gte('created_at', firstDayOfMonth.toISOString())
          .order('quantity', { ascending: false })
          .limit(1)
          .single();

        if (todayError || yesterdayError || pendingError || revenueError || topProductError) {
          throw new Error('Error fetching order statistics');
        }

        // Calculate monthly revenue
        const totalRevenue = monthlyRevenue?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

        setStats({
          today_orders: parseInt(String(todayOrders?.count || '0')),
          yesterday_orders: parseInt(String(yesterdayOrders?.count || '0')),
          pending_orders: parseInt(String(pendingOrders?.count || '0')),
          monthly_revenue: totalRevenue,
          top_product: {
            name: topProduct?.products?.name || 'No data',
            units_sold: topProduct?.quantity || 0
          }
        });

      } catch (error) {
        console.error('Error fetching order statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Today's Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.today_orders || 0}</div>
            <div className="text-sm text-gray-500">
              {stats && stats.today_orders > stats.yesterday_orders ? (
                <span className="text-green-500">+{stats.today_orders - stats.yesterday_orders}</span>
              ) : (
                <span className="text-red-500">{stats ? stats.today_orders - stats.yesterday_orders : 0}</span>
              )} from yesterday
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.pending_orders || 0}</div>
            <div className="text-sm text-gray-500">Need processing</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats?.monthly_revenue.toFixed(2) || '0.00'}</div>
            <div className="text-sm text-gray-500">This month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Top Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold">{stats?.top_product.name}</div>
            <div className="text-sm text-gray-500">{stats?.top_product.units_sold || 0} units sold</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Manage customer orders</CardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Search orders..." 
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Button>+ New Order</Button>
              </div>
            </div>
            
            <Tabs defaultValue="all" className="mt-4">
              <TabsList>
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="font-medium p-4">Order ID</th>
                    <th className="font-medium p-4">Customer</th>
                    <th className="font-medium p-4">Order Date</th>
                    <th className="font-medium p-4">Status</th>
                    <th className="font-medium p-4">Amount</th>
                    <th className="font-medium p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-4">
                      <span className="font-medium">#ORD-7352</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                          <img 
                            src="https://randomuser.me/api/portraits/men/32.jpg" 
                            alt="User" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <span>John Smith</span>
                      </div>
                    </td>
                    <td className="p-4">April 27, 2025</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        Pending
                      </span>
                    </td>
                    <td className="p-4">$124.99</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button size="sm">Process</Button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4">
                      <span className="font-medium">#ORD-7351</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                          <img 
                            src="https://randomuser.me/api/portraits/women/44.jpg" 
                            alt="User" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <span>Sarah Johnson</span>
                      </div>
                    </td>
                    <td className="p-4">April 27, 2025</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        Processing
                      </span>
                    </td>
                    <td className="p-4">$89.95</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button size="sm">Ship</Button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4">
                      <span className="font-medium">#ORD-7350</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                          <img 
                            src="https://randomuser.me/api/portraits/men/45.jpg" 
                            alt="User" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <span>Robert Williams</span>
                      </div>
                    </td>
                    <td className="p-4">April 26, 2025</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        Shipped
                      </span>
                    </td>
                    <td className="p-4">$245.50</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button size="sm">Track</Button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4">
                      <span className="font-medium">#ORD-7349</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                          <img 
                            src="https://randomuser.me/api/portraits/women/33.jpg" 
                            alt="User" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <span>Emily Davis</span>
                      </div>
                    </td>
                    <td className="p-4">April 26, 2025</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Delivered
                      </span>
                    </td>
                    <td className="p-4">$59.99</td>
                    <td className="p-4">
                      <Button variant="outline" size="sm">View</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Showing 4 of 25 orders
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Revenue by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 flex items-center justify-center rounded-md">
                <p className="text-gray-500">Sales chart placeholder</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>This month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1593095948071-474c5cc2591d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                      alt="Product" 
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium">FitLife Whey Protein</h3>
                    <div className="text-xs text-gray-500">42 units</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$49.99</div>
                    <div className="text-xs text-green-500">$2,099.58</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1606889464198-fcb18894cf50?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                      alt="Product" 
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium">Pre-Workout Energy</h3>
                    <div className="text-xs text-gray-500">37 units</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$39.99</div>
                    <div className="text-xs text-green-500">$1,479.63</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1579722821273-0f6c1ddde163?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                      alt="Product" 
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium">BCAA Recovery Drink</h3>
                    <div className="text-xs text-gray-500">28 units</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$34.99</div>
                    <div className="text-xs text-green-500">$979.72</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1622484212850-eb596d769edc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                      alt="Product" 
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium">Protein Bars (12pk)</h3>
                    <div className="text-xs text-gray-500">24 units</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$29.99</div>
                    <div className="text-xs text-green-500">$719.76</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
