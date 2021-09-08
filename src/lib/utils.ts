import React from 'react';

interface ITouchOrClickCoordsResult {
  readonly clientX: number;
  readonly clientY: number;
  readonly pageX: number;
  readonly pageY: number;
  readonly screenX: number;
  readonly screenY: number;
}

export const touchOrClick = (
  e: MouseEvent | React.MouseEvent | React.TouchEvent | TouchEvent,
): ITouchOrClickCoordsResult => {
  const event = e as any;
  if (event && event.touches) {
    return {
      clientX: event.touches[0].clientX,
      clientY: event.touches[0].clientY,
      pageX: event.touches[0].pageX,
      pageY: event.touches[0].pageY,
      screenX: event.touches[0].screenX,
      screenY: event.touches[0].screenY,
    };
  } else {
    return {
      clientX: event.clientX,
      clientY: event.clientY,
      pageX: event.pageX,
      pageY: event.pageY,
      screenX: event.screenX,
      screenY: event.screenY,
    };
  }
};
