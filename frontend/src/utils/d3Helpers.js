import * as d3 from 'd3';

export const colorScales = {
  categorical: d3.scaleOrdinal(d3.schemeCategory10),
  sequential: d3.scaleSequential(d3.interpolatePlasma),
  diverging: d3.scaleDiverging(d3.interpolateRdBu)
};

export const formatNumber = d3.format(",");
export const formatPercent = d3.format(".1%");

export const createTooltip = () => {
  return d3.select("body")
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