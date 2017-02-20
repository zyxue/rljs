import React, { Component, PropTypes } from 'react';

import Frame from '../Base/Grid/Frame.jsx';
import StateCoordTxt from '../Base/Grid/StateCoordTxt.jsx';
import StateIdTxt from '../Base/Grid/StateIdTxt.jsx';
import StateRewardTxt from '../Base/Grid/StateRewardTxt.jsx';
import PolicyArrows from '../Base/Grid/PolicyArrows.jsx';
import QTriangle from './QTriangle.jsx';

// In contrast to Cliff.jsx, this file defines the UI of a normal cell

class Cell extends Component {
    handleStateMouseClick(rect, state) {
        /* to be overwritten */
    }

    render () {
        const state = this.props.state;
        const {xmin, ymin, xmax, ymax} = state.coords;
        const qTriangles = state.allowedActions.map((action) => {
            return (
                <QTriangle key={action}
                           coords={state.coords}
                           action={action}
                           qVal={state.Q[action]}
                           zVal={state.Z[action]}>
                </QTriangle>
            );
        })

        return (
            <g className="cell">
                {qTriangles}
                <StateCoordTxt x={xmin} y={ymin} coordX={state.x} coordY={state.y}></StateCoordTxt>
                <StateIdTxt x={xmax} y={ymin} stateId={state.id}></StateIdTxt>
                <StateRewardTxt x={xmax} y={ymax} reward={state.reward}></StateRewardTxt>
                <PolicyArrows state={state} arrowHeadDefId={this.props.arrowHeadDefId}></PolicyArrows>
                <Frame x={xmin} y={ymin} height={ymax - ymin} width={xmax - xmin}></Frame>
            </g>
        );
    }
}

export default Cell;
