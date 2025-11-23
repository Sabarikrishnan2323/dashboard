import React from 'react';
import * as d3 from 'd3';
import D3BaseChart from './D3BaseChart';

const PieChart = ({ data, width = 400, height = 400 }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-64 text-gray-500">No data available</div>;
  }
  const midAngle = d => d.startAngle + (d.endAngle - d.startAngle) / 2;

  const renderPieChart = (svg) => {
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const radius = Math.min(width, height) / 2 - Math.max(margin.top, margin.right, margin.bottom, margin.left);
    
    
    const topData = [...data].sort((a, b) => b.count - a.count).slice(0, 10);
    const total = d3.sum(topData, d => d.count);
    
    const color = d3.scaleOrdinal()
      .domain(topData.map(d => d._id))
      .range(d3.quantize(d3.interpolateRainbow, topData.length));

    const pie = d3.pie()
      .value(d => d.count)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    
    const labelArc = d3.arc()
    .innerRadius(radius + 20)
    .outerRadius(radius + 20);


    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    
    const arcs = g.selectAll(".arc")
      .data(pie(topData))
      .enter().append("g")
      .attr("class", "arc");

    
    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data._id))
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("d", d3.arc()
            .innerRadius(0)
            .outerRadius(radius * 1.05)
          );
        
        tooltip
          .style("visibility", "visible")
          .html(`
            <strong>${d.data._id}</strong><br/>
            Count: ${d.data.count}<br/>
            Percentage: ${((d.data.count / total) * 100).toFixed(1)}%
          `);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("d", arc);
        tooltip.style("visibility", "hidden");
      });

    
    arcs.append("text")
      .attr("transform", d => `translate(${labelArc.centroid(d)})`)
      .style("text-anchor", d => (midAngle(d) < Math.PI ? "start" : "end"))
      .attr("dy", "0.35em")
      .style("text-anchor", "middle")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .style("pointer-events", "none")
      .text(d => {
        const percent = (d.data.count / total) * 100;
        return percent > 5 ? `${percent.toFixed(1)}%` : "";
      });

    
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 150}, 20)`);

    const legendItems = legend.selectAll(".legend-item")
      .data(topData)
      .enter().append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendItems.append("rect")
      .attr("x", 160)
      .attr("y", 40)
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", d => color(d._id));

    legendItems.append("text")
      .attr("x", 180)
      .attr("y", 46)
      .attr("dy", "0.35em")
      .style("font-size", "10px")
      .text(d => {
        const name = d._id.length > 20 ? d._id.substring(0, 20) + "..." : d._id;
        return `${name} (${d.count})`;
      })
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).style("font-weight", "bold");
      })
      .on("mouseout", function(event, d) {
        d3.select(this).style("font-weight", "normal");
      });

    
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("background", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px");
  };

  return (
    <D3BaseChart
      data={data}
      renderFunction={renderPieChart}
      width={width}
      height={height}
      className="w-full"
    />
  );
};

export default PieChart;

