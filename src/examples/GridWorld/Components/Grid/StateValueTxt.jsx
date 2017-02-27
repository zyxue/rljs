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
                      textAnchor="start"
                      dominantBaseline="text-after-edge"
                      fontSize=".7em" fill="blue">
                    v{stateValue.toPrecision(5)}
                </text>
        );
    }
}

export default StateValueTxt;
