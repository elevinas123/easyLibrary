import { useAtom } from "jotai";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Stage } from "react-konva";
import { ChaptersData } from "../../../endPointTypes/types";
import { useSettings } from "../../../hooks/useSettings";
import { ProcessedElement } from "../../../preprocess/epub/htmlToBookElements";
import Chapters from "../Chapters";
import Tools from "./components/Tools";
import { isPointInPolygon } from "./functions/getElementsUnderMouse";
import { getPos } from "./functions/getPos";
import {
  activeToolAtom,
  canvaElementsAtom,
  currentHighlightAtom,
  hoveredItemsAtom,
  newArrowAtom,
  offsetPositionAtom,
  scaleAtom,
  selectedItemsIdsAtom,
  navigationSourceAtom,
  lockPageUpdatesAtom,
  displayPageAtom,
} from "./konvaAtoms";
import HoverHighlightLayer from "./modules/BookTextLayers/HoverHighlightLayer";
import HoverOptionsTab from "./modules/BookTextLayers/HoverOptionsTab";
import MainLayer, { MainLayerRef } from "./modules/BookTextLayers/MainLayer";
import MainNotesLayer, {
  MainNotesLayerRef,
} from "./modules/NotesLayer/MainNotesLayer";
import ToolBar from "./modules/ToolBar/ToolBar";
import { throttle } from "lodash";

export type VisibleArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};
// ... other type definitions

type KonvaStageProps = {
  bookElements: ProcessedElement[];
  chaptersData: ChaptersData[] | undefined;
  onPageChange?: (page: number, position: number) => void;
  onNavigate?: (page: number) => void;
  totalPages: number;
};

const KonvaStage = forwardRef<
  { navigateToPage: (page: number) => void },
  KonvaStageProps
>(
  (
    { bookElements, chaptersData, onPageChange, onNavigate, totalPages },
    ref
  ) => {
    const { settings } = useSettings();
    const width = 1200;
    const [activeTool] = useAtom(activeToolAtom);
    const stageRef = useRef<any>(null);
    const [scale, setScale] = useAtom(scaleAtom); // State to handle scale
    const [isDragging, setIsDragging] = useState(false); // New state to track dragging
    const [offsetPosition, setOffsetPosition] = useAtom(offsetPositionAtom);
    const viewportBuffer = 200;
    const mainNotesLayerRef = useRef<MainNotesLayerRef | null>(null);
    const [, setHoveredItems] = useAtom(hoveredItemsAtom);
    const [newArrow] = useAtom(newArrowAtom);
    const [canvaElements] = useAtom(canvaElementsAtom);
    const [selectedItemsIds] = useAtom(selectedItemsIdsAtom);
    const [currentHighlight] = useAtom(currentHighlightAtom);
    const mainLayerRef = useRef<MainLayerRef | null>(null);
    const dragPosRef = useRef({ x: 0, y: 0 });
    const [navigationSource, setNavigationSource] =
      useAtom(navigationSourceAtom);
    const [lockPageUpdates, setLockPageUpdates] = useAtom(lockPageUpdatesAtom);
    const [displayPage, setDisplayPage] = useAtom(displayPageAtom);
    useEffect(() => {}, [canvaElements]);

    const [visibleArea, setVisibleArea] = useState<VisibleArea>({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });

    useEffect(() => {
      // Add event listener to the document to catch keydown events
      document.addEventListener("keydown", handleKeyDown);

      // Cleanup event listener on component unmount
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, []);
    useEffect(() => {
      const stage = stageRef.current;
      if (stage) {
        stage.on("wheel", handleWheel); // Attach wheel handler
      }

      return () => {
        if (stage) {
          stage.off("wheel", handleWheel); // Clean up listener
        }
      };
    }, []);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (mainNotesLayerRef.current) {
        mainNotesLayerRef.current.handleKeyDown(e);
      }
    };

    const handlePanWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
      // Set the navigation source to scroll
      setNavigationSource("scroll");

      const stage = stageRef.current;
      if (!stage) return;

      // Prevent default scrolling behavior
      e.evt.preventDefault();

      // Get the pointer position (optional, depends on how you want to calculate movement)
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      // Calculate vertical movement based on the wheel delta
      const dy = e.evt.deltaY;

      // Update the offset position to pan vertically
      setOffsetPosition((prev) => ({
        x: prev.x, // No horizontal movement
        y: prev.y - dy, // Move vertically based on the wheel delta
      }));

      stage.batchDraw();
    };

    const handleControlWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();
      const stage = stageRef.current;

      if (!stage) return;

      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();

      if (!pointer) return;

      const scaleBy = 1.1;
      const direction = e.evt.deltaY > 0 ? -1 : 1;
      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      // Limit the scale range
      const minScale = 0.5;
      const maxScale = 3;
      const clampedScale = Math.max(minScale, Math.min(maxScale, newScale));

      // Calculate the scaling factor
      const scaleFactor = clampedScale / oldScale;

      // Adjust the offset position to keep the zoom centered on the pointer
      const newPos = {
        x: pointer.x - (pointer.x - stage.x()) * scaleFactor,
        y: pointer.y - (pointer.y - stage.y()) * scaleFactor,
      };

      // Update state
      setScale(clampedScale);
      setOffsetPosition(newPos);
    };

    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
      if (e.evt.ctrlKey) {
        handleControlWheel(e);
      } else {
        handlePanWheel(e);
      }
    };

    const handleMouseDownForPan = () => {
      const stage = stageRef.current;
      setIsDragging(true);
      const pos = stage.getPointerPosition();
      if (pos) {
        dragPosRef.current = pos;
      }
    };

    const offsetPositionRef = useRef({ x: 0, y: 0 });
    useEffect(() => {
      offsetPositionRef.current = offsetPosition;
    }, [offsetPosition]);
    const handleMouseMoveForPan = () => {
      // Set navigation source to scroll
      setNavigationSource("scroll");

      const stage = stageRef.current;
      if (!stage || !isDragging) return;

      const pointer = stage.getPointerPosition();
      if (!pointer || !dragPosRef.current) return;

      // Calculate deltas by comparing pointer position with the stage's current position
      const dx = (pointer.x - dragPosRef.current.x) / scale;
      const dy = (pointer.y - dragPosRef.current.y) / scale;
      dragPosRef.current = {
        x: dragPosRef.current.x + dx * scale,
        y: dragPosRef.current.y + dy * scale,
      };
      // Update offset position based on deltas
      setOffsetPosition((prev) => ({
        x: prev.x + dx * scale,
        y: prev.y + dy * scale,
      }));

      stage.batchDraw();
    };

    useEffect(() => {
      const stage = stageRef.current;
      if (!stage) return;
      stage.position({
        x: offsetPosition.x,
        y: offsetPosition.y,
      });
      updateVisibleArea();
    }, [offsetPosition]);

    useEffect(() => {
      const stage = stageRef.current;
      if (!stage) return;
      stage.scale({ x: scale, y: scale });
      stage.position(offsetPosition);
      stage.batchDraw();
    }, [scale, offsetPosition]);

    const handleMouseUpForPan = () => {
      setIsDragging(false);
    };

    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
      if ((e.evt.target as HTMLElement).closest(".progress-bar-container")) {
        return;
      }

      if (activeTool === "Pan" || e.evt.buttons === 4) {
        handleMouseDownForPan();
        e.evt.preventDefault();
        return;
      }

      if (mainLayerRef.current) {
        mainLayerRef.current.handleMouseDown(e);
      }
      if (mainNotesLayerRef.current) {
        mainNotesLayerRef.current.handleMouseDown(e);
      }
    };

    const removeHoversNotUnderMouse = (e: KonvaEventObject<MouseEvent>) => {
      const pos = getPos(offsetPosition, scale, e);
      if (!pos) return;
      console.log("Removing hovers not under mouse", pos);
      setHoveredItems((prevItems) => {
        const filteredItems = prevItems.filter((item) => {
          const isInPolygon = isPointInPolygon(pos, item.points);

          const isArrowRelated =
            newArrow &&
            (item.id === newArrow.arrowElement.startId ||
              item.id === newArrow.arrowElement.endId);
          return (
            ((activeTool === "Arrow" || activeTool === "Select") &&
              (isInPolygon || isArrowRelated)) ||
            (item.id === currentHighlight.id &&
              (currentHighlight.editing || currentHighlight.creating))
          );
        });
        console.log("Filtered items", filteredItems);
        return filteredItems;
      });
    };

    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
      removeHoversNotUnderMouse(e);
      if (activeTool === "Pan" || e.evt.buttons === 4) {
        handleMouseMoveForPan();
        e.evt.preventDefault();
        return;
      }
      if (mainLayerRef.current) {
        mainLayerRef.current.handleMouseMove(e);
      }
      if (mainNotesLayerRef.current) {
        mainNotesLayerRef.current.handleMouseMove(e);
      }
    };

    const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
      if (activeTool === "Pan" || e.evt.buttons === 4) {
        handleMouseUpForPan();
        e.evt.preventDefault();
        return;
      }
      if (mainLayerRef.current) {
        mainLayerRef.current.handleMouseUp();
      }
      if (mainNotesLayerRef.current) {
        mainNotesLayerRef.current.handleMouseUp(e);
      }
    };

    const handleDoubleClick = (e: KonvaEventObject<MouseEvent>) => {
      if (mainNotesLayerRef.current) {
        mainNotesLayerRef.current.handleDoubleClick(e);
      }
    };

    const updateVisibleArea = () => {
      if (!stageRef.current) return;

      const stage = stageRef.current;

      const visibleArea = {
        x: (-stage.x() - viewportBuffer) / scale,
        y: (-stage.y() - viewportBuffer) / scale,
        width: (window.innerWidth + viewportBuffer * 2) / scale,
        height: (window.innerHeight + viewportBuffer * 2) / scale,
      };
      setVisibleArea(visibleArea);
    };

    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const smoothScroll = (
      targetX: number,
      targetY: number,
      duration: number
    ) => {
      const start = performance.now();
      const initialOffset = { ...offsetPositionRef.current };
      const deltaX = targetX - initialOffset.x;
      const deltaY = targetY - initialOffset.y;

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeInOutCubic(progress);

        setOffsetPosition({
          x: initialOffset.x + deltaX * easeProgress,
          y: initialOffset.y + deltaY * easeProgress,
        });

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    };
    const handleChapterClick = (chapterId: string) => {
      // Find the chapter and chapters data
      const chapter = chaptersData?.find((c) => c.id === chapterId);
      if (!chapter || !chaptersData) return;

      const chapterIndex = chaptersData.findIndex((c) => c.id === chapter.id);
      const targetY = -chapterIndex * 200 * (settings?.fontSize || 16) * scale;
      smoothScroll(offsetPosition.x, targetY, 500);
    };

    const navigateToPage = (page: number) => {
      if (!settings) return;

      // Don't bother with UI callbacks or locks
      // Just directly calculate the position and move there
      const linesPerPage = Math.floor(window.innerHeight / settings.fontSize);
      const targetLine = (page - 1) * linesPerPage;
      const targetY = -targetLine * settings.fontSize * scale;

      // Just update position directly
      setOffsetPosition({ x: offsetPosition.x, y: targetY });

      // Let the ProgressBar component handle its own UI updates
    };

    // Update on position change with throttling
    useEffect(() => {
      if (!settings) return;
      
      // Get the font size from settings with a fallback value
      const fontSize = settings.fontSize || 16;
      
      // Calculate the current line based on vertical position and scale
      const currentLine = Math.floor(-offsetPosition.y / fontSize / scale);

      // Calculate how many lines fit in a page
      const linesPerPage = Math.floor(window.innerHeight / fontSize / scale);

      // Calculate the current page (1-based)
      const currentPage = Math.min(
        Math.max(1, Math.floor(currentLine / linesPerPage) + 1),
        totalPages
      );
      if (onPageChange) {
        onPageChange(currentPage, offsetPosition.y);
      }
    }, [offsetPosition, scale, settings]); // Add scale and settings as dependencies

    useImperativeHandle(
      ref,
      () => ({
        navigateToPage,
      }),
      [settings, scale, offsetPosition]
    );

    return (
      <>
        <Chapters
          chapters={chaptersData}
          handleChapterClick={handleChapterClick}
        />
        <div className="w-full flex flex-col items-center relative h-screen overflow-y-scroll custom-scrollbar">
          <div className="h-screen w-full relative">
            <Tools />
            <ToolBar selectedItemsIds={selectedItemsIds} />
            <HoverOptionsTab />
            <Stage
              width={window.innerWidth}
              style={{
                backgroundColor: settings?.backgroundColor || "#111111",
              }}
              height={window.innerHeight}
              ref={stageRef}
              scaleX={scale}
              scaleY={scale}
              draggable={false}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onDblClick={handleDoubleClick}
            >
              <MainLayer
                visibleArea={visibleArea}
                bookElements={bookElements}
                fontSize={settings?.fontSize || 16}
                width={width}
                ref={mainLayerRef}
              />
              <HoverHighlightLayer />

              <MainNotesLayer ref={mainNotesLayerRef} />
            </Stage>
          </div>
        </div>
      </>
    );
  }
);

export default KonvaStage;
