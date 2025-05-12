import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, User, Mail, Phone, MapPin, Calendar, Scale, Ruler } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const UserProfile = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
    date_of_birth: '',
    gender: '',
    height_cm: '',
    weight_kg: '',
    emergency_contact: '',
    medical_conditions: '',
    fitness_goals: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Fetch user metrics
        const { data: metricsData, error: metricsError } = await supabase
          .from('user_metrics')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (metricsError && metricsError.code !== 'PGRST116') throw metricsError;

        // Update form data with fetched information
        setFormData(prev => ({
          ...prev,
          full_name: profileData?.full_name || '',
          email: user.email || '',
          phone_number: profileData?.phone_number || '',
          address: profileData?.address || '',
          date_of_birth: profileData?.date_of_birth || '',
          gender: profileData?.gender || '',
          height_cm: metricsData?.height_cm?.toString() || '',
          weight_kg: metricsData?.weight_kg?.toString() || '',
          emergency_contact: profileData?.emergency_contact || '',
          medical_conditions: profileData?.medical_conditions || '',
          fitness_goals: profileData?.fitness_goals || ''
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSaving(true);
      console.log('Starting profile update for user:', user.id);

      // First, check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      console.log('Profile check result:', { existingProfile, checkError });

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking profile:', checkError);
        throw checkError;
      }

      let profileError;
      if (!existingProfile) {
        console.log('Creating new profile...');
        // Create new profile if it doesn't exist
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: formData.full_name,
            phone_number: formData.phone_number,
            address: formData.address,
            date_of_birth: formData.date_of_birth || null,
            gender: formData.gender || null,
            emergency_contact: formData.emergency_contact,
            medical_conditions: formData.medical_conditions,
            fitness_goals: formData.fitness_goals,
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        profileError = error;
        console.log('Profile creation result:', { error });
      } else {
        console.log('Updating existing profile...');
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            phone_number: formData.phone_number,
            address: formData.address,
            date_of_birth: formData.date_of_birth || null,
            gender: formData.gender || null,
            emergency_contact: formData.emergency_contact,
            medical_conditions: formData.medical_conditions,
            fitness_goals: formData.fitness_goals,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
        profileError = error;
        console.log('Profile update result:', { error });
      }

      if (profileError) {
        console.error('Profile operation error:', profileError);
        throw profileError;
      }

      // Update user metrics if height or weight changed
      if (formData.height_cm || formData.weight_kg) {
        console.log('Updating user metrics...');
        const { error: metricsError } = await supabase
          .from('user_metrics')
          .insert({
            user_id: user.id,
            height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
            weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
            measurement_date: new Date().toISOString()
          });

        if (metricsError) {
          console.error('Metrics update error:', metricsError);
          throw metricsError;
        }
        console.log('Metrics updated successfully');
      }

      toast({
        title: 'Success',
        description: 'Profile updated successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal information and preferences
        </p>
            </div>
            
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic personal details</CardDescription>
                </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="pl-9"
                    placeholder="Enter your full name"
                  />
                      </div>
                    </div>
                    
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="pl-9 bg-muted"
                  />
                      </div>
                    </div>
                    
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="pl-9"
                    placeholder="Enter your phone number"
                  />
                      </div>
                    </div>
                    
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="pl-9"
                    placeholder="Enter your address"
                  />
                    </div>
                  </div>
                  
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className="pl-9"
                    />
                    </div>
                  </div>
                  
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleSelectChange('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                    </div>
                  </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
              <CardTitle>Health & Fitness</CardTitle>
              <CardDescription>Your health metrics and goals</CardDescription>
              </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="height_cm">Height (cm)</Label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="height_cm"
                      name="height_cm"
                      type="number"
                      value={formData.height_cm}
                      onChange={handleInputChange}
                      className="pl-9"
                      placeholder="Enter your height"
                    />
                      </div>
                    </div>
                    
                <div className="space-y-2">
                  <Label htmlFor="weight_kg">Weight (kg)</Label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="weight_kg"
                      name="weight_kg"
                      type="number"
                      value={formData.weight_kg}
                      onChange={handleInputChange}
                      className="pl-9"
                      placeholder="Enter your weight"
                    />
                  </div>
                </div>
                  </div>
                  
              <div className="space-y-2">
                <Label htmlFor="emergency_contact">Emergency Contact</Label>
                <Input
                  id="emergency_contact"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleInputChange}
                  placeholder="Name and phone number"
                />
                      </div>
                      
              <div className="space-y-2">
                <Label htmlFor="medical_conditions">Medical Conditions</Label>
                <Textarea
                  id="medical_conditions"
                  name="medical_conditions"
                  value={formData.medical_conditions}
                  onChange={handleInputChange}
                  placeholder="List any medical conditions or allergies"
                />
                      </div>
                      
              <div className="space-y-2">
                <Label htmlFor="fitness_goals">Fitness Goals</Label>
                <Textarea
                  id="fitness_goals"
                  name="fitness_goals"
                  value={formData.fitness_goals}
                  onChange={handleInputChange}
                  placeholder="Describe your fitness goals"
                />
                </div>
              </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardFooter>
            </Card>
          </div>
      </form>
    </div>
  );
};

export default UserProfile;
