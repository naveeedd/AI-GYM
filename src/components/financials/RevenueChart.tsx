
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { format } from 'date-fns';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// Sample data for the chart
// In a real app, this would come from an API call
const generateSampleData = (months = 6) => {
  const data = [];
  const now = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = format(date, 'MMM');
    
    // Generate some realistic looking data
    const baseRevenue = 40000 + Math.random() * 10000;
    const expenses = baseRevenue * (0.5 + Math.random() * 0.2);
    const profit = baseRevenue - expenses;
    
    data.push({
      name: monthName,
      revenue: Math.round(baseRevenue),
      expenses: Math.round(expenses),
      profit: Math.round(profit)
    });
  }
  
  return data;
};

const chartConfig = {
  revenue: {
    label: 'Revenue',
    theme: { light: '#10b981', dark: '#10b981' }
  },
  expenses: {
    label: 'Expenses',
    theme: { light: '#ef4444', dark: '#ef4444' }
  },
  profit: {
    label: 'Profit',
    theme: { light: '#6366f1', dark: '#6366f1' }
  }
};

const RevenueChart = () => {
  const [chartData, setChartData] = useState(generateSampleData(6));
  const [activeTab, setActiveTab] = useState('6m');
  
  useEffect(() => {
    // When tab changes, update the chart data
    const months = activeTab === '1m' ? 1 : 
                  activeTab === '3m' ? 3 : 
                  activeTab === '6m' ? 6 : 12;
    
    setChartData(generateSampleData(months));
  }, [activeTab]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue breakdown</CardDescription>
        
        <Tabs defaultValue="6m" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="1m">1M</TabsTrigger>
            <TabsTrigger value="3m">3M</TabsTrigger>
            <TabsTrigger value="6m">6M</TabsTrigger>
            <TabsTrigger value="1y">1Y</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => `$${value.toLocaleString()}`} 
                width={80}
              />
              <ChartTooltip content={<ChartTooltipContent formatter={(value: number) => `$${value.toLocaleString()}`} />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--color-revenue)" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="var(--color-expenses)" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="var(--color-profit)" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
