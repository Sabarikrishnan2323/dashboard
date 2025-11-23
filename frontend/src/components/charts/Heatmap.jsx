import React from 'react';
import * as d3 from 'd3';
import D3BaseChart from './D3BaseChart';

const Heatmap = ({ data, width = 450, height = 300 }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-64 text-gray-500">No data available</div>;
  }

  const renderHeatmap = (svg) => {
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 80, bottom: 60, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const topics = [...new Set(data.map(d => d.topic))].slice(0, 15);
    const regions = [...new Set(data.map(d => d.region))].filter(Boolean).slice(0, 10);

    
    const matrix = [];
    topics.forEach(topic => {
      regions.forEach(region => {
        const matchingData = data.filter(d => d.topic === topic && d.region === region); 
        const value = matchingData.length > 0 ? matchingData[0].count : 0;
        matrix.push({ topic, region, value });
      });
    });

    const xScale = d3.scaleBand().domain(regions).range([0, innerWidth]).padding(0.05);
    const yScale = d3.scaleBand().domain(topics).range([0, innerHeight]).padding(0.05);
    const colorScale = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, d3.max(matrix, d => d.value)]);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    
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

    
    g.selectAll(".heatmap-cell")
      .data(matrix)
      .enter().append("rect")
      .attr("class", "heatmap-cell")
      .attr("x", d => xScale(d.region))
      .attr("y", d => yScale(d.topic))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", d => colorScale(d.value))
      .attr("stroke", "#fff")
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("stroke-width", 2).attr("stroke", "#000");
        tooltip.style("visibility", "visible")
          .html(`<strong>${d.topic}</strong><br/>Region: ${d.region}<br/>Count: ${d.value}`);
      })
      .on("mousemove", function(event) {
        tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("stroke-width", 1).attr("stroke", "#fff");
        tooltip.style("visibility", "hidden");
      });

    g.append("g").attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "10px");

    g.append("g").call(d3.axisLeft(yScale)).selectAll("text").style("font-size", "10px");
  };

  return (
    <D3BaseChart
      data={data}
      renderFunction={renderHeatmap}
      width={width}
      height={height}
      className="w-full"
    />
  );
};

export default Heatmap;
