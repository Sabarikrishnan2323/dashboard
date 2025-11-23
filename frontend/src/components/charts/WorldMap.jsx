import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import D3BaseChart from './D3BaseChart';

const WorldMap = ({ data, width = '100%', height = 400 }) => {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(world => {
        setGeoData(world);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error loading map data:", error);
        setLoading(false);
      });
  }, []);

  const renderWorldMap = (svg) => {
    svg.selectAll("*").remove();

    if (!geoData || !data) return;

    
    const container = svg.node().parentElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    
    const margin = { top: 5, right: 5, bottom: 5, left: 5 };
    const innerWidth = Math.max(containerWidth - margin.left - margin.right, 100);
    const innerHeight = Math.max(containerHeight - margin.top - margin.bottom, 100);

    
    const countryData = {};
    data.forEach(d => {
      if (d._id && d.count) {
        countryData[d._id] = d.count;
      }
    });

    
    const projection = d3.geoNaturalEarth1()
      .scale(innerWidth / 5) 
      .translate([innerWidth / 2, innerHeight / 2]);

    const path = d3.geoPath().projection(projection);

    const maxCount = d3.max(Object.values(countryData)) || 1;
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, maxCount]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    
    const countries = topojson.feature(geoData, geoData.objects.countries);

    
    g.selectAll(".country")
      .data(countries.features)
      .enter().append("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("fill", d => {
        const countryName = d.properties.name;
        const count = countryData[countryName];
        return count ? colorScale(count) : "#f0f0f0";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.3) 
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("stroke-width", 1)
          .attr("stroke", "#000");

        const countryName = d.properties.name;
        const count = countryData[countryName] || 0;
        
        let tooltip = d3.select("body").select(".world-map-tooltip");
        if (tooltip.empty()) {
          tooltip = d3.select("body").append("div")
            .attr("class", "world-map-tooltip")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("background", "rgba(0, 0, 0, 0.8)")
            .style("color", "white")
            .style("padding", "6px")
            .style("border-radius", "3px")
            .style("font-size", "11px");
        }
        
        tooltip
          .style("visibility", "visible")
          .html(`
            <strong>${countryName}</strong><br/>
            Count: ${count}
          `);
      })
      .on("mousemove", function(event) {
        d3.select(".world-map-tooltip")
          .style("top", (event.pageY - 8) + "px")
          .style("left", (event.pageX + 8) + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("stroke-width", 0.3)
          .attr("stroke", "#fff");
        d3.select(".world-map-tooltip").style("visibility", "hidden");
      });

    
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full text-gray-500 text-sm">Loading map...</div>;
  }

  return (
    <div className="w-full h-full min-h-[300px]">
      <D3BaseChart
        data={data}
        renderFunction={renderWorldMap}
        width={width}
        height={height}
        className="w-full h-full"
      />
    </div>
  );
};

export default WorldMap;