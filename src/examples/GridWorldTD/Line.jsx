import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';

import './Line.css';

/* draws the grid based on agent.env, agent.V and agent.P */

class Line extends Component {
    drawLine() {
        const context = this.setContext();

        const {height, width, agent} = this.props;

        let data = agent.numStepsPerEpisode;

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
               .style("font-size", "12px")
               .attr('transform', 'translate(0,' + height + ')')
               .call(xAxis);

        // Add the Y Axis
        context.append('g')
               .attr('class', 'y axis')
               .style("font-size", "10px")
               .call(yAxis);

        // Add a title
        context.append('text')
               .attr("x", (width / 2))
               .attr("y", 0)
               .attr("text-anchor", "middle")
               .style("font-size", "16px")
        /* .style("text-decoration", "underline")*/
               .text("# steps/episode");
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
        const {height, width, id} = this.props;
        /* for simplicity to make margin on all sides the same, and 1/3 of the
        length on each dimension is used as margin to show axis ticks */
        let margin = this.margin = height * 1 / 3;
        return d3.select(this.refs.lineDiv).append('svg')
                 .attr('height', height + margin)
                 .attr('width', width + margin)
                 .attr('id', id)
                 .append('g')
                 .attr("transform",
                       "translate(" + margin / 2 + "," + margin / 2 + ")");
    }

    componentDidMount() {
        this.drawLine();
    }

    componentDidUpdate() {
        this.redrawLine();
    }

    render () {
        return (
            <div ref="lineDiv"></div>
        );
    }
}


export default Line;
