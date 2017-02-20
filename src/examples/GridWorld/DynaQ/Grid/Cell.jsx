import React, { Component, PropTypes } from 'react';

import Frame from '../../Base/Grid/Frame.jsx';
import StateCoordTxt from '../../Base/Grid/StateCoordTxt.jsx';
import StateIdTxt from '../../Base/Grid/StateIdTxt.jsx';
import StateRewardTxt from '../../Base/Grid/StateRewardTxt.jsx';
import PolicyArrows from '../../Base/Grid/PolicyArrows.jsx';
import QTriangle from './QTriangle.jsx';

// In contrast to Cliff.jsx, this file defines the UI of a normal cell

class Cell extends Component {
    handleStateMouseClick(rect, state) {
        /* to be overwritten */
    }

    render () {
        const {state, legCtrl, updateSelectedStateId} = this.props;
        const {xmin, ymin, xmax, ymax} = state.coords;
        const qTriangles = state.allowedActions.map((action) => {
            return (
                <QTriangle key={action}
                           coords={state.coords}
                           action={action}
                           qVal={state.Q[action]}
                           zVal={state.Z[action]}
                           legCtrl={legCtrl}
                >
                </QTriangle>
            );
        })

        return (
            <g className="cell">
                {qTriangles}
                {legCtrl.stateCoord ? <StateCoordTxt x={xmin} y={ymin} coordX={state.x} coordY={state.y}></StateCoordTxt> : null}
                {legCtrl.stateId    ? <StateIdTxt x={xmax} y={ymin} stateId={state.id}></StateIdTxt> : null}
                {legCtrl.reward     ? <StateRewardTxt x={xmax} y={ymax} reward={state.reward}></StateRewardTxt> : null}
                {legCtrl.policy     ? <PolicyArrows state={state} arrowHeadDefId={this.props.arrowHeadDefId}></PolicyArrows> : null}
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

export default Cell;
