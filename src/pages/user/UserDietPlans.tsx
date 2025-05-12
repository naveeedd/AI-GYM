import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const UserDietPlans = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    currentWeight: '',
    height: '',
    age: '',
    gender: '',
    activityLevel: '',
    goalType: '',
    targetWeight: '',
    dietaryRestrictions: '',
    allergies: '',
    mealPreference: ''
  });

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

  const generateDietPlan = async () => {
    setIsLoading(true);
    try {
      const prompt = `Create a detailed diet plan for a person with the following specifications:
        Current Weight: ${formData.currentWeight} kg
        Height: ${formData.height} cm
        Age: ${formData.age} years
        Gender: ${formData.gender}
        Activity Level: ${formData.activityLevel}
        Goal: ${formData.goalType}
        Target Weight: ${formData.targetWeight} kg
        Dietary Restrictions: ${formData.dietaryRestrictions}
        Allergies: ${formData.allergies}
        Meal Preference: ${formData.mealPreference}

        Please provide:
        1. Daily calorie target
        2. Macronutrient breakdown
        3. Meal timing and frequency
        4. Sample meal plan for a week
        5. Recommended foods and portions
        6. Foods to avoid
        7. Hydration guidelines
        8. Supplement recommendations (if any)
        9. Tips for meal preparation and planning`;

      const response = await fetch('https://api.chatanywhere.org/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-spUOn8SGBvqHtJbFuJLSy7cgKoO6dU7pQKjvdHsZxiQwLlsy'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional nutritionist and dietitian. Provide detailed, personalized diet plans.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        setDietPlan(data.choices[0].message.content);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error('Error generating diet plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate diet plan. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Diet Plan Generator</h1>
        <p className="text-muted-foreground">
          Get a personalized diet plan based on your goals and requirements
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Requirements</CardTitle>
            <CardDescription>Fill in your details to generate a personalized diet plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currentWeight">Current Weight (kg)</Label>
                <Input
                  id="currentWeight"
                  name="currentWeight"
                  type="number"
                  value={formData.currentWeight}
                  onChange={handleInputChange}
                  placeholder="e.g., 70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="e.g., 175"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="e.g., 25"
                />
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
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activityLevel">Activity Level</Label>
              <Select
                value={formData.activityLevel}
                onValueChange={(value) => handleSelectChange('activityLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                  <SelectItem value="light">Lightly active (light exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="very">Very active (hard exercise 6-7 days/week)</SelectItem>
                  <SelectItem value="extra">Extra active (very hard exercise & physical job)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="goalType">Goal Type</Label>
                <Select
                  value={formData.goalType}
                  onValueChange={(value) => handleSelectChange('goalType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="general_health">General Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                <Input
                  id="targetWeight"
                  name="targetWeight"
                  type="number"
                  value={formData.targetWeight}
                  onChange={handleInputChange}
                  placeholder="e.g., 65"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
              <Textarea
                id="dietaryRestrictions"
                name="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={handleInputChange}
                placeholder="e.g., Vegetarian, Vegan, Halal, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                placeholder="List any food allergies"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mealPreference">Meal Preference</Label>
              <Select
                value={formData.mealPreference}
                onValueChange={(value) => handleSelectChange('mealPreference', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select meal preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">No Preference</SelectItem>
                  <SelectItem value="high_protein">High Protein</SelectItem>
                  <SelectItem value="low_carb">Low Carb</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={generateDietPlan}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Diet Plan...
                </>
              ) : (
                'Generate Diet Plan'
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Personalized Diet Plan</CardTitle>
            <CardDescription>Generated based on your requirements</CardDescription>
          </CardHeader>
          <CardContent>
            {dietPlan ? (
              <div className="prose prose-sm max-w-none">
                {dietPlan.split('\n').map((line, index) => (
                  <p key={index} className="mb-2">{line}</p>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Fill in your requirements and click "Generate Diet Plan" to get started
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDietPlans;
