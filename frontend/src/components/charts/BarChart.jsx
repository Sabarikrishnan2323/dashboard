import React from 'react';
import * as d3 from 'd3';
import D3BaseChart from './D3BaseChart';

const BarChart = ({ data, width = 500, height = 400, horizontal = false }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-64 text-gray-500">No data available</div>;
  }

  const renderBarChart = (svg) => {
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 10, bottom: 120, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const sortedData = [...data].sort((a, b) => b.count - a.count).slice(0, 15);

    if (horizontal) {
     
      const yScale = d3.scaleBand()
        .domain(sortedData.map(d => d._id || 'Unknown'))
        .range([0, innerHeight])
        .padding(0.1);

      const xScale = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => d.count)])
        .range([0, innerWidth])
        .nice();

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      
      g.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.5em")
        .attr("dy", "-0.3em")
        .style("font-size", "10px");

      
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("x", innerWidth / 2)
        .attr("y", 35)
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .text("Count");

     
      g.selectAll(".bar")
        .data(sortedData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("y", d => yScale(d._id || 'Unknown'))
        .attr("x", 0)
        .attr("height", yScale.bandwidth())
        .attr("width", d => xScale(d.count))
        .attr("fill", "#3b82f6")
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
          d3.select(this).attr("fill", "#1d4ed8");
        })
        .on("mouseout", function(event, d) {
          d3.select(this).attr("fill", "#3b82f6");
        })
        .append("title")
        .text(d => `${d._id}: ${d.count} items`);

      
      g.selectAll(".bar-label")
        .data(sortedData)
        .enter().append("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d.count) + 5)
        .attr("y", d => yScale(d._id || 'Unknown') + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(d => d.count)
        .style("font-size", "10px")
        .style("fill", "#374151");

    } else {
     
      const xScale = d3.scaleBand()
        .domain(sortedData.map(d => d._id || 'Unknown'))
        .range([0, innerWidth])
        .padding(0.1);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => d.count)])
        .range([innerHeight, 0])
        .nice();

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", "10px");

      
      g.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -innerHeight / 2)
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .text("Count");

     
      g.selectAll(".bar")
        .data(sortedData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d._id || 'Unknown'))
        .attr("y", d => yScale(d.count))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d.count))
        .attr("fill", "#3b82f6")
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
          d3.select(this).attr("fill", "#1d4ed8");
        })
        .on("mouseout", function(event, d) {
          d3.select(this).attr("fill", "#3b82f6");
        })
        .append("title")
        .text(d => `${d._id}: ${d.count} items`);

    
      g.selectAll(".bar-label")
        .data(sortedData)
        .enter().append("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d._id || 'Unknown') + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.count) - 5)
        .attr("text-anchor", "middle")
        .text(d => d.count)
        .style("font-size", "10px")
        .style("fill", "#374151");
    }
  };

  return (
    <D3BaseChart
      data={data}
      renderFunction={renderBarChart}
      width={width}
      height={height}
      className="w-full"
    />
  );
};

export default BarChart;