import React, { Component, PropTypes } from 'react';

import PolicyArrows from './PolicyArrows.jsx';

// In contrast to Cliff.jsx, this file defines the UI of a normal cell


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

class StateIdTxt extends Component {
    propTypes: {
        x: PropTypes.number,
        y: PropTypes.number,
        stateId: PropTypes.number
    }

    render() {
        const {x, y, stateId} = this.props;
        return (
                <text x={x} y={y}
                      textAnchor="end"
                      dominantBaseline="text-before-edge"
                      fontSize=".7em" fill="blue">
                    {stateId}
                </text>
        );
    }
}

class StateCoordTxt extends Component {
    render() {
        const {x, y, coordX, coordY} = this.props;
        return (
                <text x={x} y={y}
                      textAnchor="start"
                      dominantBaseline="text-before-edge"
                      fontSize=".7em"
                      fill="blue">
                    ({coordX}, {coordY})
                </text>
        );
    }
}

class RewardTxt extends Component {
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


class Cell extends Component {
    handleStateMouseClick(rect, state) {
        /* to be overwritten */
    }

    render () {
        const state = this.props.state;
        const {xmin, ymin, xmax, ymax} = state.coords;
        return (
            <g className="cell">
                <StateCoordTxt x={xmin} y={ymin} coordX={state.x} coordY={state.y}></StateCoordTxt>
                <StateIdTxt x={xmax} y={ymin} stateId={state.id}></StateIdTxt>
                <RewardTxt x={xmax} y={ymax} reward={state.reward}></RewardTxt>
                <CellFrame x={xmin} y={ymin} height={ymax - ymin} width={xmax - xmin}></CellFrame>
                <PolicyArrows state={state} arrowHeadDefId={this.props.arrowHeadDefId}></PolicyArrows>
            </g>
        );
    }
}

export default Cell;
