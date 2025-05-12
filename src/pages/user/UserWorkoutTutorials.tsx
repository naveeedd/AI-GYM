import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const UserWorkoutTutorials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTutorial, setSelectedTutorial] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const tutorials = [
    {
      id: 1,
      title: "Barbell Bench Press",
      category: "chest",
      level: "beginner",
      duration: "4:35",
      views: "12.5K",
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Replace with actual video URL
    },
    {
      id: 2,
      title: "Barbell Squat Form Guide",
      category: "legs",
      level: "intermediate",
      duration: "6:12",
      views: "18.7K",
      thumbnail: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 3,
      title: "Proper Deadlift Technique",
      category: "back",
      level: "intermediate",
      duration: "8:45",
      views: "22.3K",
      thumbnail: "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 4,
      title: "Pull-Up Progression Guide",
      category: "back",
      level: "beginner",
      duration: "7:20",
      views: "14.1K",
      thumbnail: "https://images.unsplash.com/photo-1598971639058-a4865723a1e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 5,
      title: "Overhead Press Technique",
      category: "shoulders",
      level: "intermediate",
      duration: "5:15",
      views: "9.8K",
      thumbnail: "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 6,
      title: "Barbell Row Mastery",
      category: "back",
      level: "intermediate",
      duration: "6:30",
      views: "11.2K",
      thumbnail: "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 7,
      title: "Cable Flyes for Chest",
      category: "chest",
      level: "beginner",
      duration: "4:10",
      views: "8.5K",
      thumbnail: "https://images.unsplash.com/photo-1571388208497-71bedc66e932?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 8,
      title: "Leg Press Variations",
      category: "legs",
      level: "beginner",
      duration: "5:40",
      views: "10.3K",
      thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 9,
      title: "Advanced Dumbbell Curl Techniques",
      category: "arms",
      level: "advanced",
      duration: "7:15",
      views: "7.6K",
      thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 10,
      title: "Tricep Pushdown Mastery",
      category: "arms",
      level: "beginner",
      duration: "3:50",
      views: "9.1K",
      thumbnail: "https://images.unsplash.com/photo-1597347316205-38f2cb73e9ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    }
  ];
  
  const filteredTutorials = tutorials.filter(tutorial => 
    tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutorial.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutorial.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTutorialClick = (tutorial: any) => {
    setSelectedTutorial(tutorial);
    setIsPlaying(false);
    setIsMuted(false);
  };

  const handleCloseDialog = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setSelectedTutorial(null);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    // Cleanup video when component unmounts
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
      }
    };
  }, []);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Workout Tutorials</h1>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input 
          placeholder="Search tutorials by name, muscle group, or difficulty level..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Tutorials</TabsTrigger>
          <TabsTrigger value="chest">Chest</TabsTrigger>
          <TabsTrigger value="back">Back</TabsTrigger>
          <TabsTrigger value="legs">Legs</TabsTrigger>
          <TabsTrigger value="shoulders">Shoulders</TabsTrigger>
          <TabsTrigger value="arms">Arms</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTutorials.map(tutorial => (
              <TutorialCard 
                key={tutorial.id} 
                tutorial={tutorial} 
                onClick={() => handleTutorialClick(tutorial)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="chest" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTutorials
              .filter(tutorial => tutorial.category === "chest")
              .map(tutorial => (
                <TutorialCard 
                  key={tutorial.id} 
                  tutorial={tutorial} 
                  onClick={() => handleTutorialClick(tutorial)}
                />
              ))
            }
          </div>
        </TabsContent>
        
        <TabsContent value="back" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTutorials
              .filter(tutorial => tutorial.category === "back")
              .map(tutorial => (
                <TutorialCard 
                  key={tutorial.id} 
                  tutorial={tutorial} 
                  onClick={() => handleTutorialClick(tutorial)}
                />
              ))
            }
          </div>
        </TabsContent>
        
        <TabsContent value="legs" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTutorials
              .filter(tutorial => tutorial.category === "legs")
              .map(tutorial => (
                <TutorialCard 
                  key={tutorial.id} 
                  tutorial={tutorial} 
                  onClick={() => handleTutorialClick(tutorial)}
                />
              ))
            }
          </div>
        </TabsContent>
        
        <TabsContent value="shoulders" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTutorials
              .filter(tutorial => tutorial.category === "shoulders")
              .map(tutorial => (
                <TutorialCard 
                  key={tutorial.id} 
                  tutorial={tutorial} 
                  onClick={() => handleTutorialClick(tutorial)}
                />
              ))
            }
          </div>
        </TabsContent>
        
        <TabsContent value="arms" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTutorials
              .filter(tutorial => tutorial.category === "arms")
              .map(tutorial => (
                <TutorialCard 
                  key={tutorial.id} 
                  tutorial={tutorial} 
                  onClick={() => handleTutorialClick(tutorial)}
                />
              ))
            }
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Recommended Tutorials</CardTitle>
          <CardDescription>Based on your recent workouts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.slice(0, 3).map(tutorial => (
              <div key={tutorial.id} className="flex gap-4">
                <div className="h-20 w-32 flex-shrink-0 relative rounded-md overflow-hidden">
                  <img 
                    src={tutorial.thumbnail} 
                    alt={tutorial.title} 
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                    {tutorial.duration}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-sm line-clamp-2">{tutorial.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full capitalize">
                      {tutorial.category}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full capitalize">
                      {tutorial.level}
                    </span>
                  </div>
                  <button className="text-gym-secondary text-xs mt-2">Watch Now</button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedTutorial} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedTutorial?.title}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full"
              poster={selectedTutorial?.thumbnail}
              preload="metadata"
              playsInline
              controls={false}
            >
              <source src={selectedTutorial?.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-white/80"
                    onClick={togglePlay}
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-white/80"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                  </Button>
                </div>
                <div className="text-white text-sm">
                  {selectedTutorial?.duration}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full capitalize">
                {selectedTutorial?.category}
              </span>
              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full capitalize">
                {selectedTutorial?.level}
              </span>
              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                {selectedTutorial?.views} views
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface TutorialCardProps {
  tutorial: {
    id: number;
    title: string;
    category: string;
    level: string;
    duration: string;
    views: string;
    thumbnail: string;
  };
  onClick: () => void;
}

const TutorialCard = ({ tutorial, onClick }: TutorialCardProps) => {
  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <div className="relative">
        <img 
          src={tutorial.thumbnail} 
          alt={tutorial.title} 
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="h-12 w-12 text-white" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {tutorial.duration}
        </div>
      </div>
      <CardContent className="pt-4">
        <h3 className="font-medium line-clamp-2 mb-2">{tutorial.title}</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full capitalize">
            {tutorial.category}
          </span>
          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full capitalize">
            {tutorial.level}
          </span>
          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
            {tutorial.views} views
          </span>
        </div>
        <Button size="sm" className="w-full">
          Watch Tutorial
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserWorkoutTutorials;
