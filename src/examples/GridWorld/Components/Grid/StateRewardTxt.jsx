import React, { Component, PropTypes } from 'react';


class StateRewardTxt extends Component {
    propTypes: {
        x: PropTypes.number,
        y: PropTypes.number,
        reward: PropTypes.number
    }

    render() {
        const {x, y, reward} = this.props;
        return (
                <text x={x} y={y}
                      textAnchor="end" dominantBaseline="text-after-edge"
                      fontSize=".7em" fontWeight="450" fill="blue">
                    r{reward}
                </text>
        );
    }
}

export default StateRewardTxt;
