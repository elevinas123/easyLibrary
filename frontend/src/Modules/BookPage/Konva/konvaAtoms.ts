import {atom} from 'jotai';

import {CanvaElementSkeleton, Highlight, SettingsType, SpecificArrowElement, StartType} from '../../../endPointTypes/types';

import {DrawingToolNames} from './components/Tools';
import {FullHighlight, HighlightRect} from './modules/BookTextLayers/HighlightLayer';

export type ArrowHover = {
  points: HighlightPoints[]; id: string;
  type: StartType;
  rects?: HighlightRect[];
};

export type HighlightPoints = {
  x: number; y: number;
};

export const activeToolAtom = atom<DrawingToolNames>('Select');
export const stageStateAtom = atom({
  isDrawing: false,
  currentShape: null,
});
export const offsetPositionAtom = atom({
  x: -300,
  y: -200,
});
export type CurrentHighlight = {
  id?: string;
  editing: boolean;
  creating: boolean;
  mousePosition: { x: number; y: number };
  offsetPosition: { x: number; y: number };
  initialX?: number;
  initialY?: number;
};

export const highlightsAtom = atom<Highlight[]>([]);
export const highlightElementsAtom = atom<FullHighlight[]>([]);
export const currentHighlightAtom = atom<CurrentHighlight>({
  id: undefined,
  editing: false,
  creating: false,
  mousePosition: {x: 0, y: 0},
  offsetPosition: {x: 0, y: 0},
});
export const arrowsAtom = atom<SpecificArrowElement[]>([]);
export const hoveredItemsAtom = atom<ArrowHover[]>([]);
export const newArrowAtom = atom<SpecificArrowElement|null>(null);
export const canvaElementsAtom = atom<CanvaElementSkeleton[]>([]);
export const selectedArrowIdsAtom = atom<string[]>([]);
export const selectedItemsIdsAtom = atom<string[]>([]);
export const scaleAtom = atom(1);
export const bookIdAtom = atom<string|null>(null);
export const settingsAtom = atom<SettingsType|undefined>(undefined);
export const navigationSourceAtom = atom<'scroll' | 'progressBar' | null>(null);
export const lockPageUpdatesAtom = atom<boolean>(false);
export const displayPageAtom = atom<number>(1);
