import React from 'react';
import { useD3 } from '../../hooks/useD3';

const D3BaseChart = ({ 
  data, 
  renderFunction, 
  className = "" 
}) => {
  const ref = useD3(renderFunction, [data]);

  return (
    <div className={`w-full h-full ${className}`}>
      <svg
        ref={ref}
        className="w-full h-full"
        style={{
          minHeight: '300px',
          border: "1px solid #f0f0f0",
          borderRadius: "8px",
          background: "#fff"
        }}
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
};

export default D3BaseChart;