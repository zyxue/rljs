import React, { Component, PropTypes } from 'react';


class CellFrame extends Component {
    propTypes: {
        x: PropTypes.number,
        y: PropTypes.number,
        height: PropTypes.number,
        width: PropTypes.number
    }

    // simply a rectangle around a state cell
    render() {
        const {x, y, height, width} = this.props;
        return (
            <rect x={x} y={y}
                  height={height} width={width}
                  stroke="black"
                  strokeWidth={0.1}
                  fillOpacity={0}
                  cursor="pointer">
            </rect>
        );
    }
}

export default CellFrame;
