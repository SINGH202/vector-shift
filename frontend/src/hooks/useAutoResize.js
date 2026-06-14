import { useLayoutEffect, useState } from 'react';

export function useAutoResize(ref, value, {
  minWidth = 220,
  minHeight = 80,
  maxWidth = 400,
  maxHeight = 300,
} = {}) {
  const [size, setSize] = useState({ width: minWidth, height: minHeight });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.style.height = 'auto';
    element.style.width = `${minWidth}px`;

    const nextWidth = Math.min(Math.max(element.scrollWidth + 16, minWidth), maxWidth);
    const nextHeight = Math.min(Math.max(element.scrollHeight + 8, minHeight), maxHeight);

    setSize({ width: nextWidth, height: nextHeight });
  }, [value, ref, minWidth, minHeight, maxWidth, maxHeight]);

  return size;
}
