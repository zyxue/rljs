import React, { Component, PropTypes } from 'react';


class TerminatingState extends Component {
    render() {
        const {xmin, ymin, xmax, ymax} = this.props.coords;
        const x = xmin;
        const y = ymin;
        const height = ymax - ymin;
        const width = xmax - xmin;
        return (
            <rect x={x} y={y}
                  height={height} width={width}
                  stroke="black"
                  strokeWidth="0.1"
                  fill="green"
                  fillOpacity="0.5"
            >
            </rect>
        );
    }
}

TerminatingState.propTypes = {
    coords: React.PropTypes.shape({
        xmin: PropTypes.number,
        ymin: PropTypes.number,
        xmid: PropTypes.number,
        ymid: PropTypes.number,
        xmax: PropTypes.number,
        ymax: PropTypes.number
    })
};

export default TerminatingState;
