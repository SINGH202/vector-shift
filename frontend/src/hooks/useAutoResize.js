import { useLayoutEffect, useState } from 'react';

export function useAutoResize(ref, value, {
  minWidth = 220,
  minHeight = 60,
  maxWidth = 400,
  maxHeight = 300,
  chromeOffset = 0,
} = {}) {
  const [size, setSize] = useState({
    width: minWidth,
    minHeight: minHeight + chromeOffset,
    textareaHeight: minHeight,
  });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.style.height = 'auto';
    element.style.width = 'auto';
    element.style.minWidth = `${minWidth - 48}px`;

    const textareaHeight = Math.min(
      Math.max(element.scrollHeight + 4, minHeight),
      maxHeight,
    );
    const nextWidth = Math.min(
      Math.max(element.scrollWidth + 32, minWidth),
      maxWidth,
    );
    const nextMinHeight = textareaHeight + chromeOffset;

    element.style.height = `${textareaHeight}px`;
    element.style.width = '100%';
    element.style.minWidth = '';

    setSize({ width: nextWidth, minHeight: nextMinHeight, textareaHeight });
  }, [value, ref, minWidth, minHeight, maxWidth, maxHeight, chromeOffset]);

  return size;
}
