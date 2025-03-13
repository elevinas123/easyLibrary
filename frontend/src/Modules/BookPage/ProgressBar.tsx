import { useEffect, useState } from "react";
import { Slider } from "../../components/ui/slider";
import { Button } from "../../components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ProgressBarProps = {
  currentPage: number;
  totalPages: number;
  onNavigate: (page: number) => void;
};

export default function ProgressBar({
  currentPage,
  totalPages,
  onNavigate,
}: ProgressBarProps) {
  const [sliderValue, setSliderValue] = useState(0);
  
  // Update slider when currentPage changes
  useEffect(() => {
    if (totalPages > 0) {
      setSliderValue((currentPage / totalPages) * 100);
    }
  }, [currentPage, totalPages]);
  
  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0]);
    const targetPage = Math.round((value[0] / 100) * totalPages);
    onNavigate(targetPage);
  };
  
  // Handle navigation buttons
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onNavigate(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onNavigate(currentPage + 1);
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-700 p-2 flex items-center z-50">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handlePrevPage}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex-1 mx-4 flex items-center">
        <Slider
          value={[sliderValue]}
          max={100}
          step={0.1}
          onValueChange={handleSliderChange}
          className="flex-1"
        />
        <span className="ml-4 text-sm text-gray-300 whitespace-nowrap">
          {currentPage} / {totalPages}
        </span>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleNextPage}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
} 