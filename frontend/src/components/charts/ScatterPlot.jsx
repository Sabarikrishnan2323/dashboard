import React from 'react';
import * as d3 from 'd3';
import D3BaseChart from './D3BaseChart';

const ScatterPlot = ({ data, width = 600, height = 400 }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-64 text-gray-500">No data available</div>;
  }

  const renderScatterPlot = (svg) => {
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 120, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

   
    const validData = data.filter(d => 
      d.intensity != null && d.likelihood != null
    );

    const xScale = d3.scaleLinear()
      .domain(d3.extent(validData, d => d.intensity))
      .range([0, innerWidth])
      .nice();

    const yScale = d3.scaleLinear()
      .domain(d3.extent(validData, d => d.likelihood))
      .range([innerHeight, 0])
      .nice();

    const colorScale = d3.scaleSequential(d3.interpolatePlasma)
      .domain(d3.extent(validData, d => d.relevance || 0));

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("x", innerWidth / 2)
      .attr("y", 35)
      .attr("fill", "black")
      .style("text-anchor", "middle")
      .text("Intensity");

   
    g.append("g")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
      .attr("x", -innerHeight / 2)
      .attr("fill", "black")
      .style("text-anchor", "middle")
      .text("Likelihood");

    
    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickFormat("")
      )
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.2);

    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickFormat("")
      )
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.2);

   
    g.selectAll(".dot")
      .data(validData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.intensity))
      .attr("cy", d => yScale(d.likelihood))
      .attr("r", 5)
      .attr("fill", d => colorScale(d.relevance || 0))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 8)
          .attr("stroke-width", 2);
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 5)
          .attr("stroke-width", 1);
      })
      .append("title")
      .text(d => `Intensity: ${d.intensity}\nLikelihood: ${d.likelihood}\nRelevance: ${d.relevance || 'N/A'}`);

    const legendWidth = 20;
    const legendHeight = 150;

    const legend = g.append("g")
      .attr("transform", `translate(${innerWidth + 10}, 0)`);

    const legendScale = d3.scaleLinear()
      .domain(colorScale.domain())
      .range([legendHeight, 0]);

    const legendAxis = d3.axisRight(legendScale)
      .ticks(5);

    legend.append("g")
      .call(legendAxis);

    const defs = svg.append("defs");
    const linearGradient = defs.append("linearGradient")
      .attr("id", "linear-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");

    linearGradient.selectAll("stop")
      .data(d3.range(0, 1.1, 0.1))
      .enter().append("stop")
      .attr("offset", d => `${d * 100}%`)
      .attr("stop-color", d => colorScale(d * (colorScale.domain()[1] - colorScale.domain()[0]) + colorScale.domain()[0]));

    legend.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#linear-gradient)");

    legend.append("text")
      .attr("x", legendWidth / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Relevance");
  };

  return (
    <D3BaseChart
      data={data}
      renderFunction={renderScatterPlot}
      width={width}
      height={height}
      className="w-full"
    />
  );
};

export default ScatterPlot;