import { useEffect, useState, useCallback, useRef } from "react";
import { Slider } from "../../components/ui/slider";
import { Button } from "../../components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { debounce } from "lodash";

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
  const [displayPage, setDisplayPage] = useState(currentPage);
  const isDraggingRef = useRef(false);
  
  // Update slider when currentPage changes (only when not dragging)
  useEffect(() => {
    if (!isDraggingRef.current && totalPages > 0) {
      setSliderValue((currentPage / totalPages) * 100);
      setDisplayPage(currentPage);
    }
  }, [currentPage, totalPages]);
  
  // Super-debounced navigation function
  const debouncedNavigate = useCallback(
    debounce((page: number) => {
      onNavigate(page);
      isDraggingRef.current = false;
    }, 300),
    [onNavigate]
  );
  
  // Handle slider drag start
  const handleSliderDragStart = () => {
    isDraggingRef.current = true;
  };
  
  // Handle slider change with optimized performance
  const handleSliderChange = (value: number[]) => {
    const newValue = value[0];
    setSliderValue(newValue);
    
    // Just update the display page immediately for visual feedback
    const targetPage = Math.max(1, Math.round((newValue / 100) * totalPages));
    setDisplayPage(targetPage);
    
    // But only navigate when dragging stops
    debouncedNavigate(targetPage);
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
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border p-3 flex items-center z-50 progress-bar-container">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handlePrevPage}
        disabled={currentPage <= 1}
        className="text-foreground"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex-1 mx-4 flex items-center gap-4">
        <div 
          className="flex-1"
          onMouseDown={handleSliderDragStart}
          onTouchStart={handleSliderDragStart}
        >
          <Slider
            value={[sliderValue]}
            max={100}
            step={5}
            onValueChange={handleSliderChange}
          />
        </div>
        <span className="text-sm text-foreground whitespace-nowrap min-w-[80px] text-right">
          {displayPage} / {totalPages}
        </span>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleNextPage}
        disabled={currentPage >= totalPages}
        className="text-foreground"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
} 