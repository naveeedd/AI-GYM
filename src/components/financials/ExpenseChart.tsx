
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip
} from 'recharts';
import { useExpenseBreakdown } from '@/hooks/supabase/useFinancialData';
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ['#10b981', '#6366f1', '#3b82f6', '#f59e0b', '#6b7280'];

const ExpenseChart = () => {
  const { data: expenses, isLoading } = useExpenseBreakdown();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>Current month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <Skeleton className="h-64 w-full" />
          </div>
          
          <div className="space-y-2 mt-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!expenses || expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>Current month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 flex items-center justify-center rounded-md">
            <p className="text-gray-500">No expense data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartConfig = expenses.reduce((config, expense) => {
    config[expense.category] = {
      label: expense.category,
      theme: { light: '#000000', dark: '#000000' } // Will be overridden with COLORS
    };
    return config;
  }, {} as Record<string, any>);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>Current month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenses}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
                nameKey="category"
              >
                {expenses.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                    nameKey="category"
                    labelKey="amount"
                  />
                } 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <div className="space-y-2">
          {expenses.map((expense, index) => (
            <div key={expense.id} className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span>{expense.category}</span>
              </div>
              <span>${expense.amount.toLocaleString()} ({expense.percentage}%)</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;
