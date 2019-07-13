import React from 'react';
import * as d3 from 'd3';

import './Chart.css';



class Chart extends React.Component {

    componentDidMount() {
        let req = new XMLHttpRequest();
        let dataURL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
        req.open("GET", dataURL, true);
        req.send();
        req.onload = () => {
            let json = JSON.parse(req.responseText);
            let rawData = json.data;
            let source = json.source_name;
            
            const data = rawData.map( (elt) => {
                let quarter;
                let quarterNumeral = elt[0].slice(5,7)
                switch (quarterNumeral) {
                    case '01':
                        quarter = 'Q1';
                        break;
                    case '04':
                        quarter = 'Q2';
                        break;
                    case '07':
                        quarter = 'Q3';
                        break;
                    case '10':
                        quarter = 'Q4';
                        break;
                    default:
                        quarter = "null";
                        break;
                }
                let year = elt[0].slice(0, 4);
                let tooltipYear = quarter + " " + year;

                let tooltipDollars = '$' + elt[1].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion';
                return [elt[0], elt[1], tooltipYear, tooltipDollars];
            })
    
            // set size & padding of graphing area
            const height = 500;
            const width = 900;
            const padding = 40;
            const barwidth = (width - (2 * padding)) / data.length;


            // set scale of graph based on data
            let years = rawData.map( (elt) => new Date(elt[0]) );
            const xScale = d3.scaleTime()
                             .domain([d3.min(years), d3.max(years)])
                             .range([padding, width - padding]);
            const yScale = d3.scaleLinear()
                             .domain([0, d3.max(data, (d) => d[1])])
                             .range([height - padding, padding]);

            const xAxis = d3.axisBottom(xScale);
            const yAxis = d3.axisLeft(yScale);

            const svg = d3.select("#chart")
                          .append("svg")
                          .attr("preserveASpectRatio", "xMinYMin meet")
                          .attr("viewBox", "0 0 " + width + " " + height)
                          .attr("id", "chart-content");

            const tooltip = d3.select("#chart")
                              .append("div")
                              .attr("class", "tooltip")
                              .attr("id","tooltip")
                              .style("opacity",0);
            
            svg.append("text")
               .attr("class", "legend")
               .attr('x', padding + 20)
               .attr('y', padding + 20)
               .text("U.S. Annual Gross Domest Product (in billions)")
            
            svg.append("text")
               .attr("class","footnote")
               .attr('x', width - padding - 190)
               .attr('y', height)
               .text("Source: " + source)
            
            svg.selectAll("rect")
               .data(data)
               .enter()
               .append("rect")
               .attr("class", "bar")
               .attr("data-date", (d) => d[0])
               .attr("data-gdp", (d) => d[1])
               .attr("x", (d,i) => { return padding + (i * (barwidth)); })
               .attr("y", (d) => yScale(d[1]) )
               .attr("width", barwidth)
               .attr("height", (d) => height - padding - yScale(d[1]))
               .on("mouseover", (d,i) => {
                   tooltip.transition()
                          .duration(200)
                          .style('opacity',.9);
                    tooltip.html(d[2] + ":<br>" + d[3])
                           .attr('data-date', d[0])
                           .style('left', padding + (i * barwidth) + "px")
                           .style('top', yScale(d[1]) + 30 + "px");
               })
               .on('mouseout', (d) => {
                   tooltip.transition()
                          .duration(200)
                          .style('opacity',0);
               })
            
            svg.append("g")
               .attr("transform", "translate(0, " + (height - padding) + ")")
               .attr("id","x-axis")
               .call(xAxis);
            
            svg.append("g")
               .attr("transform", "translate(" + padding + ", 0)")
               .attr("id","y-axis")
               .call(yAxis);

        }    
    }

    render() {
        return (
            <div id="chart-container" class="ui container">
                <div id="chart"></div>
            </div>
        );
    }

}

export default Chart;