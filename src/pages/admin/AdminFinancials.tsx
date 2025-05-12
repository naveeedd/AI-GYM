
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp, Download, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  useFinancialStats, 
  useRevenueSources,
  useMembershipRevenue,
  useRecentTransactions 
} from "@/hooks/supabase/useFinancialData";
import RevenueChart from "@/components/financials/RevenueChart";
import ExpenseChart from "@/components/financials/ExpenseChart";

const AdminFinancials = () => {
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'MMMM'));
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const { data: stats, isLoading: statsLoading } = useFinancialStats(currentMonth, currentYear);
  const { data: revenueSources, isLoading: revenueSourcesLoading } = useRevenueSources(currentMonth, currentYear);
  const { data: membershipRevenue, isLoading: membershipRevenueLoading } = useMembershipRevenue(currentMonth, currentYear);
  const { data: transactions, isLoading: transactionsLoading } = useRecentTransactions();
  
  // Calculate percentage changes
  const revenueChange = stats && stats.previous_month_revenue
    ? ((stats.total_revenue - stats.previous_month_revenue) / stats.previous_month_revenue) * 100
    : 0;
  
  const expensesChange = stats && stats.previous_month_expenses
    ? ((stats.total_expenses - stats.previous_month_expenses) / stats.previous_month_expenses) * 100
    : 0;
  
  const profitChange = stats && stats.previous_month_profit
    ? ((stats.net_profit - stats.previous_month_profit) / stats.previous_month_profit) * 100
    : 0;
    
  const membershipsChange = stats && stats.previous_month_memberships
    ? ((stats.active_memberships - stats.previous_month_memberships) / stats.previous_month_memberships) * 100
    : 0;

  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Financial Dashboard</h1>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border rounded-md">
            <Button variant="ghost" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              {currentMonth} {currentYear}
            </Button>
          </div>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Monthly Revenue Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <>
                <Skeleton className="h-8 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </>
            ) : stats ? (
              <>
                <div className="text-3xl font-bold">{formatAmount(stats.total_revenue)}</div>
                <div className="flex items-center gap-1 text-sm mt-1">
                  <div className={`flex items-center ${revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {revenueChange >= 0 ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    <span>{Math.abs(revenueChange).toFixed(1)}%</span>
                  </div>
                  <span className="text-gray-500">vs last month</span>
                </div>
              </>
            ) : (
              <div className="text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>
        
        {/* Monthly Expenses Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <>
                <Skeleton className="h-8 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </>
            ) : stats ? (
              <>
                <div className="text-3xl font-bold">{formatAmount(stats.total_expenses)}</div>
                <div className="flex items-center gap-1 text-sm mt-1">
                  <div className={`flex items-center ${expensesChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {expensesChange <= 0 ? (
                      <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUp className="h-3 w-3" />
                    )}
                    <span>{Math.abs(expensesChange).toFixed(1)}%</span>
                  </div>
                  <span className="text-gray-500">vs last month</span>
                </div>
              </>
            ) : (
              <div className="text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>
        
        {/* Net Profit Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <>
                <Skeleton className="h-8 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </>
            ) : stats ? (
              <>
                <div className="text-3xl font-bold">{formatAmount(stats.net_profit)}</div>
                <div className="flex items-center gap-1 text-sm mt-1">
                  <div className={`flex items-center ${profitChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {profitChange >= 0 ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    <span>{Math.abs(profitChange).toFixed(1)}%</span>
                  </div>
                  <span className="text-gray-500">vs last month</span>
                </div>
              </>
            ) : (
              <div className="text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>
        
        {/* Active Memberships Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-normal">Active Memberships</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <>
                <Skeleton className="h-8 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </>
            ) : stats ? (
              <>
                <div className="text-3xl font-bold">{stats.active_memberships}</div>
                <div className="flex items-center gap-1 text-sm mt-1">
                  <div className={`flex items-center ${membershipsChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {membershipsChange >= 0 ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    <span>{Math.abs(membershipsChange).toFixed(1)}%</span>
                  </div>
                  <span className="text-gray-500">vs last month</span>
                </div>
              </>
            ) : (
              <div className="text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          {/* Revenue Chart */}
          <RevenueChart />
        </div>
        
        <div>
          {/* Revenue Sources Card */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Revenue Sources</CardTitle>
              <CardDescription>Current month</CardDescription>
            </CardHeader>
            <CardContent>
              {revenueSourcesLoading ? (
                <div className="space-y-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-2 w-full mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ))}
                  <div className="border-t pt-3 mt-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </div>
                </div>
              ) : revenueSources && revenueSources.length > 0 ? (
                <div className="h-[286px] flex flex-col justify-between">
                  <div className="space-y-6">
                    {revenueSources.map(source => (
                      <div key={source.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{source.name}</span>
                          <span className="font-medium">{formatAmount(source.amount)}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-gym-primary rounded-full" 
                            style={{width: `${source.percentage}%`}}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{source.percentage.toFixed(1)}% of total</div>
                      </div>
                    ))}
                  </div>
                  
                  {stats && (
                    <div className="border-t pt-3 mt-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Total Revenue</span>
                        <span className="font-bold">{formatAmount(stats.total_revenue)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[286px] flex items-center justify-center">
                  <p className="text-gray-500">No revenue data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-5 w-20 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : transactions && transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${
                        transaction.transaction_type === 'revenue' 
                          ? 'bg-green-100' 
                          : 'bg-red-100'
                      } flex items-center justify-center flex-shrink-0`}>
                        {transaction.transaction_type === 'revenue' ? (
                          <ArrowDown className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowUp className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.category}</p>
                        <p className="text-xs text-gray-500">{transaction.description || 'No description'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        transaction.transaction_type === 'revenue' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.transaction_type === 'revenue' ? '+' : '-'}
                        {formatAmount(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(parseISO(transaction.transaction_date), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No transactions available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Expense Breakdown Card */}
        <ExpenseChart />
        
        {/* Membership Plan Revenue Card */}
        <Card>
          <CardHeader>
            <CardTitle>Membership Plan Revenue</CardTitle>
            <CardDescription>Current month</CardDescription>
          </CardHeader>
          <CardContent>
            {membershipRevenueLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-2 w-full mb-1" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                ))}
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-3 w-64" />
                </div>
                
                <Skeleton className="h-9 w-full" />
              </div>
            ) : membershipRevenue && membershipRevenue.length > 0 ? (
              <div className="space-y-6">
                {membershipRevenue.map(plan => {
                  const planPercentage = stats ? (plan.amount / stats.total_revenue) * 100 : 0;
                  return (
                    <div key={plan.id}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{plan.plan_name} Plan</span>
                        <span className="text-sm">{formatAmount(plan.amount)}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${
                            plan.plan_name === 'Premium' 
                              ? 'bg-gym-secondary' 
                              : plan.plan_name === 'Basic' 
                                ? 'bg-blue-500' 
                                : 'bg-purple-500'
                          }`} 
                          style={{width: `${planPercentage}%`}}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{plan.active_members} active members</div>
                    </div>
                  );
                })}
                
                {stats && membershipRevenue.length > 0 && (
                  <div className="pt-4 border-t">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Average Revenue Per Member</span>
                      <span className="font-bold">
                        {formatAmount(stats.total_revenue / stats.active_memberships)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {profitChange >= 0 ? 'Increased' : 'Decreased'} by {Math.abs(profitChange).toFixed(1)}% from last month
                    </div>
                  </div>
                )}
                
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Financial Report
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No membership revenue data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminFinancials;
