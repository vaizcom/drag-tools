import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useRef, FC } from 'react';
import { useIntersect } from './useIntersect';
import { touchOrClick } from './utils';

interface IProps {
  itemClassName: string;
  selectAreaClassName: string;
  containerClassName: string;
  isEnabled?: boolean;
  onSelect?: (ids: string[]) => void;
}

export const Selectable: FC<IProps> = ({
  itemClassName,
  selectAreaClassName,
  containerClassName,
  isEnabled = true,
  onSelect = () => {},
  children,
}) => {
  const [isSelecting, setSelecting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const selectingRef = useRef<HTMLDivElement>(null);
  const selectingStartCoordsRef = useRef<[number, number]>([0, 0]);

  const { calculateIntersections, flushBoxesCache } = useIntersect(
    `.${selectAreaClassName}`,
    `.${itemClassName}`,
    e => e.dataset.id,
    onSelect,
  );

  const handleInteractMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isEnabled && isSelecting && selectingRef.current && contentRef.current && selectingStartCoordsRef.current) {
      const { clientX, clientY } = touchOrClick(e);
      const selecting = selectingRef.current;
      const selectingStartCoords = selectingStartCoordsRef.current;
      let left = selectingStartCoords[0];
      let top = selectingStartCoords[1];
      let width = clientX - selectingStartCoords[0];
      let height = clientY - selectingStartCoords[1];

      if (width < 0) {
        left = left + width;
        width = Math.abs(width);
      }

      if (height < 0) {
        top = top + height;
        height = Math.abs(height);
      }

      selecting.style.left = `${left}px`;
      selecting.style.top = `${top}px`;
      selecting.style.width = `${width}px`;
      selecting.style.height = `${height}px`;

      calculateIntersections();
    }
  };

  const handleInteractStart = (e: React.MouseEvent | React.TouchEvent) => {
    const itemNodes = document.querySelectorAll(`.${itemClassName}`);
    const element = e.target as HTMLElement;
    let elementIsItem = element.classList.contains(itemClassName);
    itemNodes.forEach(node => {
      if (node.contains(element)) {
        elementIsItem = true;
      }
    });
    if (!isEnabled || elementIsItem) {
      return;
    }
    const { clientX, clientY } = touchOrClick(e);
    selectingStartCoordsRef.current = [clientX, clientY];
    setSelecting(true);
    flushBoxesCache();
    onSelect([]);
  };

  const handleInteractEnd = () => {
    setSelecting(false);
  };

  return (
    <div
      onTouchStart={handleInteractStart}
      onTouchEnd={handleInteractEnd}
      onTouchMove={handleInteractMove}
      onMouseUp={handleInteractEnd}
      onMouseDown={handleInteractStart}
      onMouseMove={handleInteractMove}>
      <div className={containerClassName} ref={contentRef}>
        {children}
      </div>
      <AnimatePresence>
        {isSelecting && (
          <motion.div
            ref={selectingRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: 'spring',
              bounce: 0.05,
              duration: 0.15,
            }}
            className={selectAreaClassName}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
