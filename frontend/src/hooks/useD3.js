import { useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';

export const useD3 = (renderChartFn, dependencies = []) => {
  const ref = useRef();
  const renderFn = useCallback(renderChartFn, dependencies);

  useEffect(() => {
    if (ref.current) {
      
      d3.select(ref.current).selectAll("*").remove();
      
      
      renderFn(d3.select(ref.current));
    }

    return () => {
      
      if (ref.current) {
        d3.select(ref.current).selectAll("*").remove();
      }
    };
  }, [renderFn]);

  return ref;
};