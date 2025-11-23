import React from 'react';
import * as d3 from 'd3';
import D3BaseChart from './D3BaseChart';

const LineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No yearly trend data available
      </div>
    );
  }

  const renderLineChart = (svg) => {
    
    svg.selectAll("*").remove();

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;
    
    const margin = { top: 40, right: 80, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    
    const filteredData = data
      .filter(d => d._id?.year && d._id.year !== null && d._id.year !== undefined)
      .sort((a, b) => a._id.year - b._id.year);

    if (filteredData.length === 0) {
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .text("No valid year data available");
      return;
    }

    
    const xScale = d3.scaleLinear()
      .domain(d3.extent(filteredData, d => d._id.year))
      .range([0, innerWidth])
      .nice();

    const yScale = d3.scaleLinear()
      .domain([
        0, 
        d3.max(filteredData, d => Math.max(
          d.avgIntensity || 0, 
          d.avgLikelihood || 0, 
          d.avgRelevance || 0
        )) * 1.1
      ])
      .range([innerHeight, 0])
      .nice();

    
    const lineGenerator = d3.line()
      .x(d => xScale(d._id.year))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    
    const datasets = [
      {
        name: "Intensity",
        values: filteredData.map(d => ({ ...d, value: d.avgIntensity || 0 })),
        color: "#3b82f6"
      },
      {
        name: "Likelihood", 
        values: filteredData.map(d => ({ ...d, value: d.avgLikelihood || 0 })),
        color: "#ef4444"
      },
      {
        name: "Relevance",
        values: filteredData.map(d => ({ ...d, value: d.avgRelevance || 0 })),
        color: "#10b981"
      }
    ];

    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
      .append("text")
      .attr("x", innerWidth / 2)
      .attr("y", 40)
      .attr("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Year");

    
    g.append("g")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -innerHeight / 2)
      .attr("fill", "black")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Average Value");

    
    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickFormat("")
      )
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.3)
      .style("stroke", "#ccc");

    
    datasets.forEach(dataset => {
      g.append("path")
        .datum(dataset.values)
        .attr("fill", "none")
        .attr("stroke", dataset.color)
        .attr("stroke-width", 3)
        .attr("d", lineGenerator);

      
      g.selectAll(`.dot-${dataset.name}`)
        .data(dataset.values)
        .enter().append("circle")
        .attr("class", `dot-${dataset.name}`)
        .attr("cx", d => xScale(d._id.year))
        .attr("cy", d => yScale(d.value))
        .attr("r", 4)
        .attr("fill", dataset.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .append("title")
        .text(d => `${dataset.name}: ${d.value?.toFixed(2)}\nYear: ${d._id.year}`);
    });

    
    const legend = g.append("g")
      .attr("transform", `translate(${innerWidth - 120}, 0)`);

    legend.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 130)
      .attr("height", datasets.length * 25 + 10)
      .attr("fill", "white")
      .attr("stroke", "#ddd")
      .attr("rx", 4);

    datasets.forEach((dataset, i) => {
      const legendItem = legend.append("g")
        .attr("transform", `translate(10, ${15 + i * 25})`);

      legendItem.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 20)
        .attr("y2", 0)
        .attr("stroke", dataset.color)
        .attr("stroke-width", 3);

      legendItem.append("text")
        .attr("x", 30)
        .attr("y", 0)
        .attr("dy", "0.35em")
        .style("font-size", "12px")
        .style("fill", "#374151")
        .text(dataset.name);
    });
  };

  return (
    <D3BaseChart
      data={data}
      renderFunction={renderLineChart}
      className="w-full h-full"
    />
  );
};

export default LineChart;