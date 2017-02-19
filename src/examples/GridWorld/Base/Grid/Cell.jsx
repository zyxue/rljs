import React, { Component, PropTypes } from 'react';

import CellFrame from './CellFrame.jsx';
import StateCoordTxt from './StateCoordTxt.jsx';
import StateIdTxt from './StateIdTxt.jsx';
import StateRewardTxt from './StateRewardTxt.jsx';
import PolicyArrows from './PolicyArrows.jsx';

// In contrast to Cliff.jsx, this file defines the UI of a normal cell

class Cell extends Component {
    handleStateMouseClick(rect, state) {
        /* to be overwritten */
    }

    render () {
        const state = this.props.state;
        const {xmin, ymin, xmax, ymax} = state.coords;
        return (
            <g className="cell">
                <CellFrame x={xmin} y={ymin} height={ymax - ymin} width={xmax - xmin}></CellFrame>
                <StateCoordTxt x={xmin} y={ymin} coordX={state.x} coordY={state.y}></StateCoordTxt>
                <StateIdTxt x={xmax} y={ymin} stateId={state.id}></StateIdTxt>
                <StateRewardTxt x={xmax} y={ymax} reward={state.reward}></StateRewardTxt>
                <PolicyArrows state={state} arrowHeadDefId={this.props.arrowHeadDefId}></PolicyArrows>
            </g>
        );
    }
}

export default Cell;
