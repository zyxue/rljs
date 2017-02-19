import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';


class Cliff extends Component {
    render () {
        const {xmin, ymin, xmax, ymax} = this.props.state.coords;
        return  (
            <rect x={xmin} y={ymin}
                  height={ymax - ymin} width={xmax - xmin}
                  stroke="black"
                  strokeWidth={0.1}
                  fillOpacity={1}
                  fill='#AAA'
                  cursor="pointer">
            </rect>

        );
    }
}

export default Cliff;
