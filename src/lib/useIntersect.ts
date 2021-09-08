import { useCallback, useRef } from 'react';
import { diff } from 'fast-array-diff';

interface IDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const useIntersect = (
  areaSelector: string,
  itemsSelector: string,
  callback: () => void,
  extractId: (e: HTMLElement) => string | undefined,
  setSelected: (ids: string[]) => void,
  // Add here an IntersectionObserver to observe only visible items
) => {
  const selectedCache = useRef<string[]>([]);
  const boxes = useRef(new Map<string, IDimensions>());

  const getBox = (element: HTMLElement) => {
    const { x, y, width, height } = element.getBoundingClientRect();
    return { x, y, width, height };
  };

  const flushBoxesCache = () => {
    const elements = document.querySelectorAll(itemsSelector);
    elements.forEach((element: any) => {
      const id = extractId(element);
      if (id) {
        boxes.current.set(id, getBox(element));
      }
    });
    selectedCache.current = [];
    setSelected([]);
  };

  const isIntersecting = (rect1: IDimensions, rect2: IDimensions): boolean => {
    if (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    ) {
      return true;
    }
    return false;
  };

  const calculateIntersections = useCallback(() => {
    const area = document.querySelector(areaSelector);
    const elements = document.querySelectorAll(itemsSelector);
    const areaBox = area?.getBoundingClientRect();
    const ids: string[] = [];
    elements.forEach((element: any) => {
      const id = extractId(element);
      if (id && areaBox) {
        let box = boxes.current.get(id);
        if (!box) {
          box = getBox(element);
          boxes.current.set(id, box);
        }
        if (isIntersecting(areaBox, box)) {
          ids.push(id);
        }
      }
    });
    const cachedDiff = diff(selectedCache.current, ids);
    if (cachedDiff.added.length > 0 || cachedDiff.removed.length > 0) {
      console.log('xxx');
      setSelected(ids);
      selectedCache.current = ids;
    }
  }, [itemsSelector, areaSelector, extractId, setSelected]);

  return {
    calculateIntersections,
    flushBoxesCache,
  };
};
