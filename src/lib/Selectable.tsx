import { AnimatePresence, motion } from 'framer-motion';
import { useState, useRef, FC } from 'react';
import { useIntersect } from './useIntersect';
import classNames from 'classnames';

const ITEMS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const ITEMS2 = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];

interface IProps {
  itemClassName?: string;
  selectAreaClassName?: string;
  isEnabled?: boolean;
}

const SELECT_AREA_CLASS = '__drag-tools__select_area__';

export const Selectable: FC<IProps> = ({ itemClassName, selectAreaClassName, isEnabled = true }) => {
  const [isSelecting, setSelecting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const selectingRef = useRef<HTMLDivElement>(null);
  const selectingStartCoordsRef = useRef<[number, number]>([0, 0]);
  const [selected, setSelected] = useState<string[]>([]);

  const { calculateIntersections, flushBoxesCache } = useIntersect(
    `.${SELECT_AREA_CLASS}`,
    '.Item',
    () => {},
    e => e.dataset.id,
    setSelected,
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
    setSelected([]);
  };

  const handleMouseUp = () => {
    setSelecting(false);
  };

  return (
    <div onMouseUp={handleMouseUp} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}>
      <div className='Container' ref={contentRef}>
        {ITEMS.map(i => (
          <div key={i} data-id={i} className={`Item Item1 ${selected.includes(i) && ' Selected'}`}>
            {i}
          </div>
        ))}
        {ITEMS2.map(i => (
          <div key={i} data-id={i} className={`Item ${selected.includes(i) && ' Selected'}`}>
            {i}
          </div>
        ))}
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
            className={classNames(selectAreaClassName, SELECT_AREA_CLASS)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
