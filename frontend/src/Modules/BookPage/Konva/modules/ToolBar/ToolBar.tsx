import { useState, useRef, useEffect } from "react";
import { useAtom } from "jotai";
import { 
    ChevronDown, 
    ChevronRight, 
    ChevronUp, 
    GripVertical, 
    Trash2, 
    X, 
    Type, 
    Bold, 
    Italic, 
    Underline, 
    AlignLeft, 
    AlignCenter, 
    AlignRight, 
    AlignJustify,
    Palette,
    Circle
} from "lucide-react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { arrowsAtom, canvaElementsAtom } from "../../konvaAtoms";
import { toolbarConfig } from "./ToolBar.config";
import { Button } from "../../../../../components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../../../../components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../../../../../components/ui/collapsible";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import ToolBarItem from "./ToolBarItem";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../../../../components/ui/tooltip";
import { Separator } from "../../../../../components/ui/separator";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../../components/ui/select";
import { Slider } from "../../../../../components/ui/slider";
import { Input } from "../../../../../components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { CanvaElementSkeleton, CircleElement, SpecificCircleElement } from "../../../../../endPointTypes/types";

type ToolBarProps = {
    selectedItemsIds: string[];
};

export default function ToolBar({ selectedItemsIds }: ToolBarProps) {
    const [canvaElements, setCanvaElements] = useAtom(canvaElementsAtom);
    const [arrows, setArrows] = useAtom(arrowsAtom);
    const [openGroups, setOpenGroups] = useState<string[]>([]);
    const [minimized, setMinimized] = useState(false);
    const [position, setPosition] = useState({ x: 16, y: 16 });
    const dragControls = useDragControls();
    const cardRef = useRef<HTMLDivElement>(null);

    // Text formatting state
    const [fontFamily, setFontFamily] = useState("Inter");
    const [fontSize, setFontSize] = useState(16);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderlined, setIsUnderlined] = useState(false);
    const [textAlign, setTextAlign] = useState("left");
    const [textColor, setTextColor] = useState("#000000");
   let controlShape: any = canvaElements.find(
     (element) => element.id === selectedItemsIds[0]
   );
    // Track window dimensions to ensure the toolbar stays in bounds
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    // Add a resize listener
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Ensure the toolbar stays in bounds when window is resized
    useEffect(() => {
        if (cardRef.current) {
            const cardWidth = cardRef.current.offsetWidth;
            const cardHeight = cardRef.current.offsetHeight;
            
            // Adjust position if needed to stay in bounds
            let newX = position.x;
            let newY = position.y;
            
            if (newX + cardWidth > windowSize.width) {
                newX = windowSize.width - cardWidth - 16;
            }
            
            if (newY + cardHeight > windowSize.height) {
                newY = windowSize.height - cardHeight - 16;
            }
            
            if (newX !== position.x || newY !== position.y) {
                setPosition({ x: newX, y: newY });
            }
        }
    }, [windowSize, position, minimized]);

    // Load text formatting settings from selected element
    useEffect(() => {
        if (controlShape && controlShape.type === 'text') {
            // Get properties from the main element
            setTextColor(controlShape.fill || '#000000');
            
            // Get properties from the textElement if it exists
            if (controlShape.textElement) {
                setFontFamily(controlShape.textElement.fontFamily || 'Inter');
                setFontSize(controlShape.textElement.fontSize || 16);
                setIsItalic(controlShape.textElement.fontStyle === "italic");
                setIsUnderlined(controlShape.textElement.textDecoration === "underline");
            }
        }
    }, [selectedItemsIds, controlShape]);

    // Add radius state for circles
    const [radius, setRadius] = useState(50);
    const [hachureGap, setHachureGap] = useState(5);
    const [hachureAngle, setHachureAngle] = useState(45);
    const [roughness, setRoughness] = useState(1);
    const [fillStyle, setFillStyle] = useState("solid");
    
    // Load circle properties when a circle is selected
    useEffect(() => {
        if (controlShape && controlShape.type === 'circle' && controlShape.circleElement) {
            // Set circle specific properties
            setRadius(controlShape.circleElement.radius || 50);
            setHachureGap(controlShape.circleElement.hachureGap || 5);
            setHachureAngle(controlShape.circleElement.hachureAngle || 45);
            setRoughness(controlShape.circleElement.roughness || 1);
            setFillStyle(controlShape.circleElement.fillStyle || "solid");
            
            // Set common properties
            setTextColor(controlShape.fill || '#000000');
        }
    }, [selectedItemsIds, controlShape]);

    const updateItems = (property: { [key: string]: any }) => {
        setCanvaElements((elements) =>
            elements.map((element) =>
                selectedItemsIds.includes(element.id)
                    ? { ...element, ...property }
                    : element
            )
        );
        setArrows((elements) =>
            elements.map((element) =>
                selectedItemsIds.includes(element.id)
                    ? { ...element, ...property }
                    : element
            )
        );
    };

    // Text formatting handlers
    const updateTextFormat = (property: { [key: string]: any }) => {
        if (controlShape.type === 'text') {
            // Handle properties that go directly on the CanvaElementSkeleton
            const canvasProps: { [key: string]: any } = {};
            // Handle properties that go in the textElement
            const textProps: { [key: string]: any } = {};
            
            Object.entries(property).forEach(([key, value]) => {
                // Properties that should be on the main canvas element
                if (['fill', 'opacity', 'rotation', 'x', 'y', 'width', 'height'].includes(key)) {
                    canvasProps[key] = value;
                } 
                // Properties that belong in the textElement
                else if (['fontFamily', 'fontSize', 'text', 'fontWeight', 'fontStyle', 'textDecoration'].includes(key)) {
                    textProps[key] = value;
                }
            });
            
            // Update the main canvas element
            if (Object.keys(canvasProps).length > 0) {
                setCanvaElements((elements) =>
                    elements.map((element) =>
                        selectedItemsIds.includes(element.id)
                            ? { ...element, ...canvasProps }
                            : element
                    )
                );
            }
            
            // Update the textElement property
            if (Object.keys(textProps).length > 0) {
                setCanvaElements((elements) =>
                    elements.map((element) => {
                        if (selectedItemsIds.includes(element.id) && element.type === 'text') {
                            return {
                                ...element,
                                textElement: {
                                    ...element.textElement,
                                    ...textProps
                                }
                            } as CanvaElementSkeleton;
                        }
                        return element;
                    })
                );
            }
        } else {
            // For non-text elements, just update the main properties
            updateItems(property);
        }
    };

    const toggleBold = () => {
        const newValue = !isBold;
        setIsBold(newValue);
        updateTextFormat({ fontWeight: newValue ? 'bold' : 'normal' });
    };

    const toggleItalic = () => {
        const newValue = !isItalic;
        setIsItalic(newValue);
        updateTextFormat({ fontStyle: newValue ? 'italic' : 'normal' });
    };

    const toggleUnderline = () => {
        const newValue = !isUnderlined;
        setIsUnderlined(newValue);
        updateTextFormat({ textDecoration: newValue ? 'underline' : 'none' });
    };

    const handleFontFamilyChange = (value: string) => {
        setFontFamily(value);
        updateTextFormat({ fontFamily: value });
    };

    const handleFontSizeChange = (value: number[]) => {
        const newSize = value[0];
        setFontSize(newSize);
        updateTextFormat({ fontSize: newSize });
    };


    const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setTextColor(newColor);
        updateTextFormat({ fill: newColor });
    };

    // Update circle properties
    const updateCircleFormat = (property: { [key: string]: any }) => {
        if (controlShape.type === 'circle') {
            // Handle properties that go directly on the CanvaElementSkeleton
            const canvasProps: { [key: string]: any } = {};
            // Handle properties that go in the circleElement
            const circleProps: { [key: string]: any } = {};
            
            Object.entries(property).forEach(([key, value]) => {
                // Properties that should be on the main canvas element
                if (['fill', 'opacity', 'rotation', 'x', 'y', 'width', 'height', 'strokeWidth', 'stroke'].includes(key)) {
                    canvasProps[key] = value;
                } 
                // Properties that belong in the circleElement
                else if (['radius', 'fillStyle', 'roughness', 'seed', 'hachureGap', 'hachureAngle'].includes(key)) {
                    circleProps[key] = value;
                }
            });
            
            // Update the main canvas element
            if (Object.keys(canvasProps).length > 0) {
                setCanvaElements((elements) =>
                    elements.map((element) =>
                        selectedItemsIds.includes(element.id)
                            ? { ...element, ...canvasProps }
                            : element
                    )
                );
            }
            
            // Update the circleElement property
            if (Object.keys(circleProps).length > 0) {
                setCanvaElements((elements) =>
                    elements.map((element) => {
                        if (selectedItemsIds.includes(element.id) && element.type === 'circle') {
                            return {
                                ...element,
                                circleElement: {
                                    ...element.circleElement,
                                    ...circleProps
                                }
                            } as CanvaElementSkeleton;
                        }
                        return element;
                    })
                );
            }
        } else {
            // For non-circle elements, just update the main properties
            updateItems(property);
        }
    };
    
    // Handle radius change for circles
    const handleRadiusChange = (value: number[]) => {
        const newRadius = value[0];
        setRadius(newRadius);
        updateCircleFormat({ radius: newRadius });
    };
    
    // Handle hachure gap change for circles
    const handleHachureGapChange = (value: number[]) => {
        const newGap = value[0];
        setHachureGap(newGap);
        updateCircleFormat({ hachureGap: newGap });
    };
    
    // Handle hachure angle change for circles
    const handleHachureAngleChange = (value: number[]) => {
        const newAngle = value[0];
        setHachureAngle(newAngle);
        updateCircleFormat({ hachureAngle: newAngle });
    };
    
    // Handle roughness change for circles
    const handleRoughnessChange = (value: number[]) => {
        const newRoughness = value[0];
        setRoughness(newRoughness);
        updateCircleFormat({ roughness: newRoughness });
    };
    
    // Handle fill style change for circles
    const handleFillStyleChange = (value: string) => {
        setFillStyle(value);
        updateCircleFormat({ fillStyle: value });
    };
    
    // Handle circle color change
    const handleCircleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setTextColor(newColor);
        updateCircleFormat({ fill: newColor });
    };

    if (!controlShape)
        controlShape = arrows.find(
            (element) => element.id === selectedItemsIds[0]
        );

    if (!selectedItemsIds.length || !controlShape) {
        return null;
    }

    const controls = toolbarConfig[controlShape.type] || [];
    const isTextElement = controlShape.type === 'text';
    const isCircleElement = controlShape.type === 'circle';

    const toggleGroup = (groupName: string) => {
        setOpenGroups((prev) =>
            prev.includes(groupName)
                ? prev.filter((g) => g !== groupName)
                : [...prev, groupName]
        );
    };

    const deleteSelectedItems = () => {
        setCanvaElements((elements) =>
            elements.filter((element) => !selectedItemsIds.includes(element.id))
        );
        setArrows((elements) =>
            elements.filter((element) => !selectedItemsIds.includes(element.id))
        );
    };

    const handleDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
        dragControls.start(event);
    };

    // Get proper element type display name
    const getElementTypeDisplayName = () => {
        if (controlShape.type === 'text') return 'Text';
        if (controlShape.type === 'image') return 'Image';
        if (controlShape.type === 'shape') return 'Shape';
        if (controlShape.type === 'arrow') return 'Arrow';
        return controlShape.type.charAt(0).toUpperCase() + controlShape.type.slice(1);
    };

    return (
        <motion.div
            className="absolute z-50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
                opacity: 1, 
                scale: 1,
                x: position.x,
                y: position.y
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            dragConstraints={{
                left: 0,
                right: windowSize.width - (cardRef.current?.offsetWidth || 300),
                top: 0,
                bottom: windowSize.height - (cardRef.current?.offsetHeight || 400)
            }}
            onDragEnd={(_, info) => {
                setPosition((prev) => ({
                    x: prev.x + info.offset.x,
                    y: prev.y + info.offset.y
                }));
            }}
        >
            <Card 
                ref={cardRef}
                className="w-72 bg-card/95 text-card-foreground backdrop-blur-sm shadow-lg border-primary/20"
                style={{ display: "flex", flexDirection: "column" }}
            >
                <CardHeader 
                    className="p-3 flex flex-row items-center justify-between space-y-0 border-b cursor-move flex-shrink-0"
                    onPointerDown={handleDragStart}
                >
                    <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium">
                            {minimized ? `Element: ${getElementTypeDisplayName()}` : 'Element Properties'}
                        </CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setMinimized(!minimized)}
                        >
                            {minimized ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => deleteSelectedItems()}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                </CardHeader>
                
                <AnimatePresence>
                    {!minimized && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <CardContent className="p-0">
                                <ScrollArea className="h-64" type="always">
                                    <div className="p-3 space-y-2">
                                        {/* Circle formatting tools */}
                                        {isCircleElement && (
                                            <Collapsible
                                                open={openGroups.includes("Circle Properties")}
                                                onOpenChange={() => toggleGroup("Circle Properties")}
                                                className="mb-1"
                                            >
                                                <CollapsibleTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-between py-2 px-3 text-sm h-8 bg-muted/50 hover:bg-muted"
                                                    >
                                                        <div className="flex items-center">
                                                            <Circle className="h-4 w-4 mr-2" />
                                                            Circle Properties
                                                        </div>
                                                        <motion.div
                                                            animate={{ rotate: openGroups.includes("Circle Properties") ? 180 : 0 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <ChevronDown className="h-4 w-4" />
                                                        </motion.div>
                                                    </Button>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="py-2 px-3 space-y-3 border-l-2 border-muted ml-2 mt-1">
                                                    {/* Radius */}
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between">
                                                            <label className="text-xs text-muted-foreground">Radius</label>
                                                            <span className="text-xs font-medium">{radius}px</span>
                                                        </div>
                                                        <Slider 
                                                            value={[radius]} 
                                                            min={5} 
                                                            max={200} 
                                                            step={1} 
                                                            onValueChange={handleRadiusChange} 
                                                        />
                                                    </div>
                                                    
                                                    {/* Fill Style */}
                                                    <div className="space-y-1">
                                                        <label className="text-xs text-muted-foreground">Fill Style</label>
                                                        <Select value={fillStyle} onValueChange={handleFillStyleChange}>
                                                            <SelectTrigger className="w-full h-8 text-xs">
                                                                <SelectValue placeholder="Select Fill Style" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="solid">Solid</SelectItem>
                                                                <SelectItem value="hachure">Hachure</SelectItem>
                                                                <SelectItem value="cross-hatch">Cross-Hatch</SelectItem>
                                                                <SelectItem value="zigzag">Zigzag</SelectItem>
                                                                <SelectItem value="dots">Dots</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    
                                                    {/* Roughness */}
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between">
                                                            <label className="text-xs text-muted-foreground">Roughness</label>
                                                            <span className="text-xs font-medium">{roughness}</span>
                                                        </div>
                                                        <Slider 
                                                            value={[roughness]} 
                                                            min={0} 
                                                            max={3} 
                                                            step={0.1} 
                                                            onValueChange={handleRoughnessChange} 
                                                        />
                                                    </div>
                                                    
                                                    {fillStyle !== 'solid' && (
                                                        <>
                                                            {/* Hachure Gap */}
                                                            <div className="space-y-1">
                                                                <div className="flex justify-between">
                                                                    <label className="text-xs text-muted-foreground">Hachure Gap</label>
                                                                    <span className="text-xs font-medium">{hachureGap}px</span>
                                                                </div>
                                                                <Slider 
                                                                    value={[hachureGap]} 
                                                                    min={1} 
                                                                    max={20} 
                                                                    step={1} 
                                                                    onValueChange={handleHachureGapChange} 
                                                                />
                                                            </div>
                                                            
                                                            {/* Hachure Angle */}
                                                            <div className="space-y-1">
                                                                <div className="flex justify-between">
                                                                    <label className="text-xs text-muted-foreground">Hachure Angle</label>
                                                                    <span className="text-xs font-medium">{hachureAngle}°</span>
                                                                </div>
                                                                <Slider 
                                                                    value={[hachureAngle]} 
                                                                    min={0} 
                                                                    max={180} 
                                                                    step={5} 
                                                                    onValueChange={handleHachureAngleChange} 
                                                                />
                                                            </div>
                                                        </>
                                                    )}
                                                    
                                                    {/* Fill Color */}
                                                    <div className="space-y-1">
                                                        <label className="text-xs text-muted-foreground">Fill Color</label>
                                                        <div className="flex items-center space-x-2">
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button 
                                                                        variant="outline" 
                                                                        size="sm" 
                                                                        className="h-8 flex items-center gap-2"
                                                                    >
                                                                        <div 
                                                                            className="w-4 h-4 rounded-sm border border-gray-300" 
                                                                            style={{ backgroundColor: textColor }}
                                                                        />
                                                                        <Palette className="h-4 w-4" />
                                                                        {textColor}
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-3">
                                                                    <div className="flex flex-col gap-2">
                                                                        <div className="grid grid-cols-5 gap-1">
                                                                            {["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", 
                                                                                "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#008000",
                                                                                "#800000", "#008080", "#000080", "#FFC0CB", "#A52A2A",
                                                                                "#808080", "#C0C0C0", "#FFD700", "#4B0082", "#FFFFFF"
                                                                            ].map(color => (
                                                                                <div 
                                                                                    key={color}
                                                                                    className="w-6 h-6 rounded-sm border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                                                                                    style={{ backgroundColor: color }}
                                                                                    onClick={() => {
                                                                                        setTextColor(color);
                                                                                        updateCircleFormat({ fill: color });
                                                                                    }}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                        <div className="flex items-center mt-2">
                                                                            <label className="text-xs mr-2">Custom:</label>
                                                                            <Input
                                                                                type="color"
                                                                                value={textColor}
                                                                                onChange={handleCircleColorChange}
                                                                                className="w-8 h-8 p-0 border-0"
                                                                            />
                                                                            <Input 
                                                                                type="text" 
                                                                                value={textColor}
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value;
                                                                                    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                                                                        setTextColor(value);
                                                                                        if (value.length === 7) {
                                                                                            updateCircleFormat({ fill: value });
                                                                                        }
                                                                                    }
                                                                                }}
                                                                                className="w-24 h-8 ml-2 text-xs"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        )}
                                        
                                        {/* Show text formatting tools if it's a text element */}
                                        {isTextElement && (
                                            <Collapsible
                                                open={openGroups.includes("Text Formatting")}
                                                onOpenChange={() => toggleGroup("Text Formatting")}
                                                className="mb-1"
                                            >
                                                <CollapsibleTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-between py-2 px-3 text-sm h-8 bg-muted/50 hover:bg-muted"
                                                    >
                                                        <div className="flex items-center">
                                                            <Type className="h-4 w-4 mr-2" />
                                                            Text Formatting
                                                        </div>
                                                        <motion.div
                                                            animate={{ rotate: openGroups.includes("Text Formatting") ? 180 : 0 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <ChevronDown className="h-4 w-4" />
                                                        </motion.div>
                                                    </Button>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="py-2 px-3 space-y-3 border-l-2 border-muted ml-2 mt-1">
                                                    {/* Font Family */}
                                                    <div className="space-y-1">
                                                        <label className="text-xs text-muted-foreground">Font Family</label>
                                                        <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
                                                            <SelectTrigger className="w-full h-8 text-xs">
                                                                <SelectValue placeholder="Select Font" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Inter">Inter</SelectItem>
                                                                <SelectItem value="Arial">Arial</SelectItem>
                                                                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                                                <SelectItem value="Georgia">Georgia</SelectItem>
                                                                <SelectItem value="Courier New">Courier New</SelectItem>
                                                                <SelectItem value="Verdana">Verdana</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    
                                                    {/* Font Size */}
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between">
                                                            <label className="text-xs text-muted-foreground">Font Size</label>
                                                            <span className="text-xs font-medium">{fontSize}px</span>
                                                        </div>
                                                        <Slider 
                                                            value={[fontSize]} 
                                                            min={8} 
                                                            max={72} 
                                                            step={1} 
                                                            onValueChange={handleFontSizeChange} 
                                                        />
                                                    </div>
                                                    
                                                    {/* Text Style */}
                                                    <div className="space-y-1">
                                                        <label className="text-xs text-muted-foreground">Text Style</label>
                                                        <div className="flex space-x-1">
                                                           
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button 
                                                                            variant={isItalic ? "default" : "outline"} 
                                                                            size="icon" 
                                                                            className="h-8 w-8" 
                                                                            onClick={toggleItalic}
                                                                        >
                                                                            <Italic className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Italic</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                            
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button 
                                                                            variant={isUnderlined ? "default" : "outline"} 
                                                                            size="icon" 
                                                                            className="h-8 w-8" 
                                                                            onClick={toggleUnderline}
                                                                        >
                                                                            <Underline className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Underline</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                    </div>
                                                    
                                                   
                                                    
                                                    {/* Text Color */}
                                                    <div className="space-y-1">
                                                        <label className="text-xs text-muted-foreground">Text Color</label>
                                                        <div className="flex items-center space-x-2">
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button 
                                                                        variant="outline" 
                                                                        size="sm" 
                                                                        className="h-8 flex items-center gap-2"
                                                                    >
                                                                        <div 
                                                                            className="w-4 h-4 rounded-sm border border-gray-300" 
                                                                            style={{ backgroundColor: textColor }}
                                                                        />
                                                                        <Palette className="h-4 w-4" />
                                                                        {textColor}
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-3">
                                                                    <div className="flex flex-col gap-2">
                                                                        <div className="grid grid-cols-5 gap-1">
                                                                            {["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", 
                                                                              "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#008000",
                                                                              "#800000", "#008080", "#000080", "#FFC0CB", "#A52A2A",
                                                                              "#808080", "#C0C0C0", "#FFD700", "#4B0082", "#FFFFFF"
                                                                            ].map(color => (
                                                                                <div 
                                                                                    key={color}
                                                                                    className="w-6 h-6 rounded-sm border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                                                                                    style={{ backgroundColor: color }}
                                                                                    onClick={() => {
                                                                                        setTextColor(color);
                                                                                        updateTextFormat({ fill: color });
                                                                                    }}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                        <div className="flex items-center mt-2">
                                                                            <label className="text-xs mr-2">Custom:</label>
                                                                            <Input
                                                                                type="color"
                                                                                value={textColor}
                                                                                onChange={handleTextColorChange}
                                                                                className="w-8 h-8 p-0 border-0"
                                                                            />
                                                                            <Input 
                                                                                type="text" 
                                                                                value={textColor}
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value;
                                                                                    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                                                                        setTextColor(value);
                                                                                        if (value.length === 7) {
                                                                                            updateTextFormat({ fill: value });
                                                                                        }
                                                                                    }
                                                                                }}
                                                                                className="w-24 h-8 ml-2 text-xs"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        )}
                                        
                                        {controls.map((controlGroup: any) => (
                                            <Collapsible
                                                key={controlGroup.groupName}
                                                open={openGroups.includes(controlGroup.groupName)}
                                                onOpenChange={() => toggleGroup(controlGroup.groupName)}
                                                className="mb-1"
                                            >
                                                <CollapsibleTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-between py-2 px-3 text-sm h-8 bg-muted/50 hover:bg-muted"
                                                    >
                                                        {controlGroup.groupName}
                                                        <motion.div
                                                            animate={{ rotate: openGroups.includes(controlGroup.groupName) ? 180 : 0 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <ChevronDown className="h-4 w-4" />
                                                        </motion.div>
                                                    </Button>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="py-2 px-3 space-y-3 border-l-2 border-muted ml-2 mt-1">
                                                    {controlGroup.controls.map((control: any) => (
                                                        <ToolBarItem
                                                            key={control.property}
                                                            property={control.property}
                                                            label={control.label}
                                                            controlItem={(controlShape as any)[control.property]}
                                                            updateItems={updateItems}
                                                            controlType={control.type}
                                                            options={control.options}
                                                        />
                                                    ))}
                                                </CollapsibleContent>
                                            </Collapsible>
                                        ))}
                                    </div>
                                </ScrollArea>
                                <div className="p-3 border-t">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="w-full text-sm"
                                        onClick={deleteSelectedItems}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Element
                                    </Button>
                                </div>
                            </CardContent>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </motion.div>
    );
}
