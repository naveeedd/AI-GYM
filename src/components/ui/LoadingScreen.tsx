
import { Loader } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Loader className="w-12 h-12 text-gym-secondary animate-spin mb-4" />
      <h2 className="text-xl font-medium text-gym-primary animate-pulse-light">Loading...</h2>
    </div>
  );
};

export default LoadingScreen;
