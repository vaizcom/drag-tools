import { AnimatePresence, motion } from 'framer-motion';
import { useState, useRef, FC } from 'react';
import { useIntersect } from './useIntersect';

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
    () => {},
    e => e.dataset.id,
    onSelect,
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isEnabled && isSelecting && selectingRef.current && contentRef.current && selectingStartCoordsRef.current) {
      const selecting = selectingRef.current;
      const selectingStartCoords = selectingStartCoordsRef.current;
      let left = selectingStartCoords[0];
      let top = selectingStartCoords[1];
      let width = e.clientX - selectingStartCoords[0];
      let height = e.clientY - selectingStartCoords[1];

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEnabled) {
      return;
    }
    selectingStartCoordsRef.current = [e.clientX, e.clientY];
    setSelecting(true);
    flushBoxesCache();
    onSelect([]);
  };

  const handleMouseUp = () => {
    setSelecting(false);
  };

  return (
    <div onMouseUp={handleMouseUp} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}>
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
