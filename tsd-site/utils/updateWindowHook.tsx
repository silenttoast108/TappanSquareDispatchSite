'use client';
import { useState, useLayoutEffect } from 'react';

//the point of this function is to ensure that textloop animation in audioWidget renders appropriately even when window size is changed
export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateSize();

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size
}