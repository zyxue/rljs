import React, { Component, PropTypes } from 'react';


class StateValueTxt extends Component {
    propTypes: {
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        stateId: PropTypes.number.isRequired
    }

    render() {
        const {x, y, stateValue} = this.props;
        return (
                <text x={x} y={y}
                      textAnchor="end"
                      dominantBaseline="text-before-edge"
                      fontSize=".7em" fill="blue">
                    {stateValue.toPrecision(10)}
                </text>
        );
    }
}

export default StateValueTxt;
