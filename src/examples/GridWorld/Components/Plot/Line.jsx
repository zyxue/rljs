import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';

import './Line.css';


class Line extends Component {
    drawLine() {
        const context = this.setContext();

        const {height, width, margin, data, title, xlabel, ylabel} = this.props;

        /* http://bl.ocks.org/d3noob/b3ff6ae1c120eea654b5 */
        var x = d3.scale.linear().domain([0, data.length]).range([0, width]);
        var y = d3.scale.linear().domain([0, d3.max(data)]).range([height, 0]);

        var valueLine = d3.svg.line()
                          .x(function(d, i) {return x(i + 1); })
                          .y(function(d)    {return y(d); });

        context.append('path')
               .attr('class', 'line')
               .attr('d', valueLine(data));

        // Define the axes
        var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(4);
        var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);

        // Add the X Axis
        context.append('g')
               .attr('class', 'x axis')
               .style("font-size", "10px")
               .attr('transform', 'translate(0,' + height + ')')
               .call(xAxis);

        // Add the Y Axis
        context.append('g')
               .attr('class', 'y axis')
               .style("font-size", "10px")
               .call(yAxis);

        if (title !== undefined)
            context.append('text')
                   .attr("x", (width / 2))
                   .attr("y", 0)
                   .attr("text-anchor", "middle")
                   .attr("dominant-baseline", "text-after-edge")
                   .style("font-size", ".8em")
                   .text(title);

        if (xlabel !== undefined)
            context.append('text')
                   .attr("text-anchor", "middle")
                   .attr("transform", "translate("+ (width/2) +","+(height + (margin.bottom || 0))+")")
                   .attr("dominant-baseline", "text-after-edge")
                   .style("font-size", ".8em")
                   .text(xlabel);

        if (ylabel !== undefined)
            context.append("text")
                   .attr("text-anchor", "middle")
                   /* /1.27 is a very brittle setting after careful adjustment to make it look better */
                   .attr("transform", "translate("+ -margin.left / 1.27 +","+(height/2)+")rotate(-90)")
                   .style("font-size", ".8em")
                   .text(ylabel);
    }

    redrawLine() {
        const context = d3.select('#' + this.props.id);
        context.remove();
        this.drawLine();
    }

    propTypes: {
        id: PropTypes.string,
        height: PropTypes.number,
        width: PropTypes.number
    }

    setContext() {
        const {height, width, margin, id} = this.props;
        return d3.select(this.refs.lineDiv).append('svg')
                 // parentheses are important to ensure the correct order of evaluation
                 .attr('height', height + (margin.top || 0) + (margin.bottom || 0))
                 .attr('width', width + (margin.left || 0) + (margin.right || 0))
                 .attr('id', id)
                 .append('g')
                 .attr("transform",
                       "translate(" + margin.left + "," + margin.top + ")");
    }

    componentDidMount() {
        this.drawLine();
    }

    componentDidUpdate() {
        this.redrawLine();
    }

    render () {
        return (
            <div className="plot" ref="lineDiv"></div>
        );
    }
}


export default Line;
