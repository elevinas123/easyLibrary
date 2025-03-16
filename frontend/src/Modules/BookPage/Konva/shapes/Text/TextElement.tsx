import { KonvaEventObject } from "konva/lib/Node";
import { v4 as uuidv4 } from "uuid";
import { useAtom } from "jotai";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { Stage } from "konva/lib/Stage";
import {
    ForwardedRef,
    forwardRef,
    MutableRefObject,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import {
    CanvaElementSkeleton,
    SpecificTextElement,
} from "../../../../../endPointTypes/types";
import { getPos } from "../../functions/getPos";
import { measureTextWidth } from "../../functions/measureTextWidth";
import {
    activeToolAtom,
    bookIdAtom,
    canvaElementsAtom,
    offsetPositionAtom,
    scaleAtom,
    selectedItemsIdsAtom,
} from "../../konvaAtoms";
import CreateText from "./CreateText";
import { isSpecificTextElement } from "../../../../../endPointTypes/typeGuards";

type TextElementProps = {
    createElement: (element: CanvaElementSkeleton) => void;
    updateElement: (element: CanvaElementSkeleton) => void;
    deleteElement: (id: string) => void;
    inputRef: MutableRefObject<HTMLInputElement | null>;
};

export type TextElementRef = {
    handleMouseDown: (e: KonvaEventObject<MouseEvent>) => void;
    handleMouseUp: () => void;
    handleDragMove: (
        node: Shape<ShapeConfig> | Stage
    ) => Partial<SpecificTextElement>;
    handleDoubleClick: (e: KonvaEventObject<MouseEvent>) => void;
    handleKeyDown: (e: KeyboardEvent) => void;
    handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void;
};

function TextElement(
    { createElement, updateElement, deleteElement, inputRef }: TextElementProps,
    ref: ForwardedRef<TextElementRef>
) {
    const [activeTool] = useAtom(activeToolAtom);
    const [canvaElements] = useAtom(canvaElementsAtom);
    const [offsetPosition] = useAtom(offsetPositionAtom);
    const [scale] = useAtom(scaleAtom);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentItem, setCurrentItem] = useState<SpecificTextElement | null>(null);
    const [bookId] = useAtom(bookIdAtom);
    const [selectedItemsIds, setSelectedItemsIds] = useAtom(selectedItemsIdsAtom);
    const previousSelectionRef = useRef<string[]>([]);
    
    useImperativeHandle(ref, () => ({
        handleMouseDown,
        handleMouseUp,
        handleDragMove,
        handleDoubleClick,
        handleKeyDown,
        handleInputChange,
    }));
    
    // When text editing starts, hide the transformer
    useEffect(() => {
        if (isEditing && currentItem) {
            // Store the current selection before clearing it
            previousSelectionRef.current = [...selectedItemsIds];
            
            // Clear selections to hide transformer
            setSelectedItemsIds([]);
        }
    }, [isEditing]);
    
    // Create a full-overlay text editor that directly handles input
    useEffect(() => {
        if (!isEditing || !currentItem) {
            // Hide the editor when not editing
            const existingEditor = document.getElementById('text-editor');
            if (existingEditor) {
                existingEditor.style.display = 'none';
            }
            return;
        }

        // Create or get the editor element
        let editor = document.getElementById('text-editor') as HTMLDivElement;
        if (!editor) {
            editor = document.createElement('div');
            editor.id = 'text-editor';
            editor.contentEditable = 'true'; // Make directly editable
            document.body.appendChild(editor);
        }

        // Get stage container reference
        const stageContainer = document.querySelector('.konvajs-content');
        const containerRect = stageContainer?.getBoundingClientRect() || { left: 0, top: 0 };
        
        // Calculate position - adjust for scale and offset
        const x = (currentItem.x * scale + offsetPosition.x) + containerRect.left;
        const y = (currentItem.y * scale + offsetPosition.y) + containerRect.top;
        const width = currentItem.width * scale;
        const height = currentItem.height * scale;
        
        // Style the editor to look like the text element
        editor.style.position = 'fixed';
        editor.style.left = `${x}px`;
        editor.style.top = `${y}px`;
        editor.style.width = `${width}px`;
        editor.style.minWidth = '150px';
        editor.style.minHeight = '30px';
        editor.style.padding = '5px';
        editor.style.background = 'rgba(255, 255, 255, 0.97)';
        editor.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        editor.style.borderRadius = '4px';
        editor.style.border = '1px solid #3f87ff';
        editor.style.zIndex = '1000';
        editor.style.fontFamily = currentItem.textElement.fontFamily || 'Arial';
        editor.style.fontSize = `${currentItem.textElement.fontSize * scale}px`;
        editor.style.color = currentItem.fill || '#333';
        editor.style.display = 'block';
        editor.style.outline = 'none';
        editor.style.overflow = 'auto';
        editor.style.resize = 'both'; // Allow resizing (optional)
        editor.style.whiteSpace = 'pre-wrap'; // Preserve whitespace and wrap
        editor.style.transition = 'all 0.2s ease';
        editor.style.animation = 'text-editor-pulse 1s ease-in-out 1'; // Add subtle animation
        
        // Append animation style if it doesn't exist
        if (!document.getElementById('text-editor-styles')) {
            const style = document.createElement('style');
            style.id = 'text-editor-styles';
            style.textContent = `
                @keyframes text-editor-pulse {
                    0% { box-shadow: 0 0 0 rgba(63, 135, 255, 0.5); }
                    50% { box-shadow: 0 0 10px rgba(63, 135, 255, 0.8); }
                    100% { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Set the text content
        editor.textContent = currentItem.textElement.text;
        
        // Handle text changes
        const handleInput = () => {
            updateTextElement(editor.textContent || '');
        };
        
        // Handle special keys
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                finishEditing();
                e.preventDefault();
            } else if (e.key === 'Enter' && !e.shiftKey) {
                finishEditing();
                e.preventDefault();
            }
        };
        
        // Finish editing when clicking outside
        const handleClickOutside = (e: MouseEvent) => {
            if (editor && !editor.contains(e.target as Node) && e.target !== editor) {
                finishEditing();
            }
        };
        
        // Focus the editor
        editor.focus();
        
        // Position cursor at the end of text
        const range = document.createRange();
        const sel = window.getSelection();
        if (editor.childNodes.length > 0) {
            const lastNode = editor.childNodes[editor.childNodes.length - 1];
            range.setStart(lastNode, lastNode.textContent?.length || 0);
            range.collapse(true);
            sel?.removeAllRanges();
            sel?.addRange(range);
        }
        
        // Set up event listeners
        editor.addEventListener('input', handleInput);
        editor.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        
        // Clean up event listeners when done
        return () => {
            editor.removeEventListener('input', handleInput);
            editor.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEditing, currentItem, scale, offsetPosition]);
    
    // The finishEditing function now only needs to handle the editor
    const finishEditing = () => {
        setIsEditing(false);
        
        const editor = document.getElementById('text-editor');
        if (editor) {
            editor.style.display = 'none';
        }
        
        // Restore selection
        if (currentItem) {
            setTimeout(() => {
                setSelectedItemsIds([currentItem.id]);
            }, 50);
        }
    };
    
    // Create new text element on mouse down (when Text tool is active)
    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if (!bookId) return;
        const pos = getPos(offsetPosition, scale, e);
        if (!pos) return;
        if (activeTool !== "Text") return;
        
        // Create a new text element with better defaults
        const id = uuidv4();
        const newText = CreateText({
            x: pos.x,
            y: pos.y,
            bookId: bookId,
            id,
            text: "Enter text here",
            fontSize: 16,
            fill: "#333333",
        });
        
        setCurrentItem(newText);
        createElement(newText);
        
        // Start editing after a short delay to ensure element is created
        setTimeout(() => {
            setIsEditing(true);
        }, 50);
    };
    
    // Handle mouse up - only reset current item if not editing
    const handleMouseUp = () => {
        if (!isEditing) {
            setCurrentItem(null);
        }
    };
    
    // Handle dragging text elements
    const handleDragMove = (
        node: Shape<ShapeConfig> | Stage
    ): Partial<SpecificTextElement> => {
        return {
            x: node.x(),
            y: node.y(),
        };
    };
    
    // Find elements at a specific position
    const getItemsAtPosition = (pos: { x: number; y: number }) => {
        return canvaElements.filter((item) => {
            return (
                pos.x >= item.x &&
                pos.x <= item.x + item.width &&
                pos.y >= item.y &&
                pos.y <= item.y + item.height
            );
        });
    };
    
    // Handle double-click to edit existing text
    const handleDoubleClick = (e: KonvaEventObject<MouseEvent>) => {
        // Only allow editing when the Select tool is active
        if (activeTool !== "Select") return;
        
        const pos = getPos(offsetPosition, scale, e);
        if (!pos) return;

        const clickedItem = getItemsAtPosition(pos).find((item) =>
            isSpecificTextElement(item)
        );

        if (clickedItem) {
            // Store current selection and hide transformer
            previousSelectionRef.current = [...selectedItemsIds];
            setSelectedItemsIds([]);
            
            // Set the current item and start editing
            setCurrentItem(clickedItem);
            
            // Short delay to ensure transformer is hidden
            setTimeout(() => {
                setIsEditing(true);
            }, 50);
        }
    };
    
    // Handle keyboard events (like Delete)
    const handleKeyDown = (e: KeyboardEvent) => {
        if (isEditing) return;
        if (!currentItem) return;
        
        if (e.key === "Delete" || e.key === "Backspace") {
            deleteElement(currentItem.id);
        }
    };
    
    // Update text element content and dimensions
    const updateTextElement = (text: string) => {
        if (!currentItem) return;
        
        // Calculate new dimensions based on text content
        const fontSize = currentItem.textElement.fontSize || 16;
        const fontFamily = currentItem.textElement.fontFamily || 'Arial';
        
        // Ensure reasonable minimum width
        const textWidth = measureTextWidth(text, fontSize, fontFamily);
        const newWidth = Math.max(textWidth + 20, 60);
        const newHeight = Math.max(fontSize * 1.5, 30);
        
        // Create updated element
        const updatedElement = {
            ...currentItem,
            textElement: {
                ...currentItem.textElement,
                text
            },
            width: newWidth,
            height: newHeight,
            points: [
                { x: currentItem.x, y: currentItem.y },
                { x: currentItem.x + newWidth, y: currentItem.y },
                { x: currentItem.x + newWidth, y: currentItem.y + newHeight },
                { x: currentItem.x, y: currentItem.y + newHeight }
            ]
        };
        
        // Update local state and parent component
        setCurrentItem(updatedElement);
        updateElement(updatedElement);
        
        // Update editor size if it exists
        const editor = document.getElementById('text-editor');
        if (editor) {
            editor.style.width = `${newWidth * scale}px`;
        }
    };
    
    // React change handler (kept for interface compatibility)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (currentItem && isEditing) {
            updateTextElement(e.target.value);
        }
    };
    
    // Add this helper function to your component
    const calculateInputPosition = () => {
        if (!currentItem) return { x: 0, y: 0 };
        
        // Get stage and its container
        const stageContainer = document.querySelector('.konvajs-content');
        const stage = stageContainer?.querySelector('canvas');
        
        if (!stageContainer || !stage) return { x: 0, y: 0 };
        
        const containerRect = stageContainer.getBoundingClientRect();
        
        // Calculate the relative position in the stage
        // This factors in the scale and offset correctly
        const x = (currentItem.x * scale + offsetPosition.x) + containerRect.left;
        const y = (currentItem.y * scale + offsetPosition.y) + containerRect.top;
        
        return { x, y };
    };
    
    // Then in your useEffect
    // Component renders nothing directly - just handles logic
    return null;
}

export default forwardRef(TextElement);
