import classNames from 'classnames';
import { animate, motion, useMotionValue, Spring } from 'framer-motion';
import { FC, HTMLAttributes, useEffect, useRef } from 'react';
import { touchOrClick } from './utils';
import { useEffectOnce } from 'react-use';

interface ISortableCellProps extends HTMLAttributes<HTMLDivElement> {
  index: number;
  itemClassName: string;
}

type TAnchor = Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom' | 'width' | 'height'>;
type TXy = {
  x: number;
  y: number;
};

const ANIMATION_CONFIG: Spring = {
  type: 'spring',
  stiffness: 500,
  damping: 50,
};

export const SortableCell: FC<ISortableCellProps> = ({ children, itemClassName, className, index, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const refHold = useRef<boolean>(false);
  const refMoved = useRef<boolean>(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const parentAnchor = useRef<TAnchor>({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: 0,
    height: 0,
  });
  const startAnchorXy = useRef<TXy>({ x: 0, y: 0 });

  // const collectSiblings = () => {
  //   return document.querySelectorAll(`.${itemClassName}`);
  // };

  const handleInteractStart = (e: React.MouseEvent | React.TouchEvent) => {
    refHold.current = true;
    window.addEventListener('mousemove', handleInteractMove);
    window.addEventListener('touchmove', handleInteractMove);
    window.addEventListener('mouseup', handleInteractEnd);
    window.addEventListener('touchend', handleInteractEnd);
    if (ref.current) {
      parentAnchor.current = ref.current.getBoundingClientRect();
    }
  };

  const handleInteractEnd = (e: MouseEvent | TouchEvent) => {
    window.removeEventListener('mousemove', handleInteractMove);
    window.removeEventListener('touchmove', handleInteractMove);
    window.removeEventListener('mouseup', handleInteractEnd);
    window.removeEventListener('touchend', handleInteractEnd);
    refMoved.current = false;
    refHold.current = false;

    animate(x, 0, ANIMATION_CONFIG);
    animate(y, 0, ANIMATION_CONFIG);
  };

  const handleInteractMove = (e: MouseEvent | TouchEvent) => {
    if (!refHold.current) {
      return;
    }
    const { pageX, pageY } = touchOrClick(e);
    if (!refMoved.current) {
      startAnchorXy.current = {
        x: pageX - parentAnchor.current.left,
        y: pageY - parentAnchor.current.top,
      };
    }
    refMoved.current = true;
    if (innerRef.current && parentAnchor.current && startAnchorXy.current) {
      x.set(pageX - parentAnchor.current.left - startAnchorXy.current.x);
      y.set(pageY - parentAnchor.current.top - startAnchorXy.current.y);
    }
  };

  useEffectOnce(() => {
    return () => {
      window.removeEventListener('mousemove', handleInteractMove);
      window.removeEventListener('touchmove', handleInteractMove);
      window.removeEventListener('mouseup', handleInteractEnd);
      window.removeEventListener('touchend', handleInteractEnd);
    };
  });

  return (
    <div
      {...props}
      style={{ background: 'red' }}
      className={classNames(itemClassName, className)}
      data-index={index}
      ref={ref}
      onMouseDown={handleInteractStart}
      onTouchStart={handleInteractStart}>
      <motion.div style={{ x, y }} ref={innerRef}>
        {children}
      </motion.div>
    </div>
  );
};

export const Sortable: FC = ({ children }) => {
  return <div className='Container SortableContainer'>{children}</div>;
};
