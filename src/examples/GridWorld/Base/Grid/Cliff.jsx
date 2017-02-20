import React, { Component, PropTypes } from 'react';

import Frame from './Frame.jsx';

class Cliff extends Component {
    render () {
        const {state, updateSelectedStateId} = this.props;
        const {xmin, ymin, xmax, ymax} = state.coords;
        return  (
            <g>
                <rect x={xmin} y={ymin}
                  height={ymax - ymin} width={xmax - xmin}
                  stroke="black"
                  strokeWidth={0.1}
                  fillOpacity={0.5}
                  fill='#AAA'
                  cursor="pointer">
                </rect>
                <Frame x={xmin}
                       y={ymin}
                       height={ymax - ymin}
                       width={xmax - xmin}
                       onClick={updateSelectedStateId.bind(this, state.id)}
                />
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
