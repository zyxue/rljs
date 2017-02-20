import React, { Component, PropTypes } from 'react';

class Cliff extends Component {
    render () {
        const {xmin, ymin, xmax, ymax} = this.props.state.coords;
        return  (
            <g>
                <rect x={xmin} y={ymin}
                  height={ymax - ymin} width={xmax - xmin}
                  stroke="black"
                  strokeWidth={0.1}
                  fillOpacity={1}
                  fill='#AAA'
                  cursor="pointer">
                </rect>
            </g>
        );
    }
}


Cliff.propTypes =  {
    xmin: PropTypes.number,
    ymin: PropTypes.number,
    xmax: PropTypes.number,
    ymax: PropTypes.number
};


export default Cliff;
