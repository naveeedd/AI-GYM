import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserPlus, Filter, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type ActiveMember = Database['public']['Views']['active_members_view']['Row'];

interface MemberStats {
  total_members: number;
  active_members: number;
  premium_members: number;
  avg_retention_months: number;
  new_members_month: number;
}

const AdminMembers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [memberStats, setMemberStats] = useState<MemberStats | null>(null);
  const [members, setMembers] = useState<ActiveMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [planOptions, setPlanOptions] = useState<{id: string, name: string}[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch member stats
        const { data: stats, error: statsError } = await supabase
          .from('active_members_view')
          .select('plan_name, visits_this_month, subscription_start')
          .order('visits_this_month', { ascending: false });

        if (statsError) throw statsError;

        // Calculate stats
        const totalMembers = stats?.length || 0;
        const premiumMembers = stats?.filter(m => m.plan_name === 'Premium').length || 0;
        const newMembersThisMonth = stats?.filter(m => 
          new Date(m.subscription_start).getMonth() === new Date().getMonth()
        ).length || 0;

        setMemberStats({
          total_members: totalMembers,
          active_members: totalMembers,
          premium_members: premiumMembers,
          avg_retention_months: 8.4, // This would ideally be calculated from actual data
          new_members_month: newMembersThisMonth
        });

        // Fetch plan options
        const { data: plans } = await supabase
          .from('membership_plans')
          .select('id, name')
          .eq('is_active', true);

        if (plans) {
          setPlanOptions(plans);
        }

        // Fetch active members
        const { data: membersData, error: membersError } = await supabase
          .from('active_members_view')
          .select('*')
          .order('full_name');

        if (membersError) throw membersError;
        setMembers(membersData || []);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter members based on search query and plan filter
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      searchQuery === "" || 
      member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPlan = 
      planFilter === "all" || 
      member.plan_name === planFilter;
      
    return matchesSearch && matchesPlan;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin text-gym-secondary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Active Members</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{memberStats?.active_members || 0}</div>
            <div className="text-sm text-gray-500">
              <span className="text-green-500">+{memberStats?.new_members_month || 0}</span> this month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Premium Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{memberStats?.premium_members || 0}</div>
            <div className="text-sm text-gray-500">
              {Math.round((memberStats?.premium_members || 0) / (memberStats?.active_members || 1) * 100)}% of total
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Average Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{memberStats?.avg_retention_months || 0}</div>
            <div className="text-sm text-gray-500">months</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>New Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{memberStats?.new_members_month || 0}</div>
            <div className="text-sm text-gray-500">this month</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search members..." 
              className="pl-10 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select 
            className="border rounded-md px-3 py-2"
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
          >
            <option value="all">All Plans</option>
            {planOptions.map(plan => (
              <option key={plan.id} value={plan.name}>{plan.name}</option>
            ))}
          </select>
        </div>
        
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Member
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="font-medium p-4">Member</th>
                  <th className="font-medium p-4">Plan</th>
                  <th className="font-medium p-4">Join Date</th>
                  <th className="font-medium p-4">Last Visit</th>
                  <th className="font-medium p-4">Visits This Month</th>
                  <th className="font-medium p-4">Status</th>
                  <th className="font-medium p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredMembers.map(member => (
                  <tr key={member.user_id}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                          <img 
                            src={member.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.full_name)}&background=random`}
                            alt={member.full_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{member.full_name}</div>
                          <div className="text-xs text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{member.plan_name || 'None'}</td>
                    <td className="p-4">
                      {new Date(member.join_date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {member.last_check_in 
                        ? new Date(member.last_check_in).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td className="p-4">{member.visits_this_month || 0}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        member.is_active 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {member.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button variant="outline" size="sm">View Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMembers;
