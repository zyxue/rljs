import React, { Component, PropTypes } from 'react';

import StateCoordTxt from '../../Base/Grid/StateCoordTxt.jsx';
import StateIdTxt from '../../Base/Grid/StateIdTxt.jsx';
import StateRewardTxt from '../../Base/Grid/StateRewardTxt.jsx';
import PolicyArrows from '../../Base/Grid/PolicyArrows.jsx';
import QTriangle from './QTriangle.jsx';


class Cell extends Component {
    componentDidMount() {
        this.rect.addEventListener('click', this.props.handleClick);
    }

    componentWillUnmount(){
        this.rect.removeEventListener('click', this.props.handleClick);
    }

    render () {
        const {state, legendsCtrl} = this.props;
        const {xmin, ymin, xmax, ymax} = state.coords;
        const height = ymax - ymin;
        const width = xmax - xmin;

        const qTriangles = state.allowedActions.map((action) => {
            return (
                <QTriangle key={action}
                           coords={state.coords}
                           action={action}
                           qVal={state.Q[action]}
                           zVal={state.Z[action]}
                           legCtrl={legendsCtrl}
                >
                </QTriangle>
            );
        });

        return (
            <g className="cell">
                {qTriangles}
                {legendsCtrl.stateCoord
                 ? <StateCoordTxt x={xmin} y={ymin} coordX={state.x} coordY={state.y}></StateCoordTxt>
                 : null
                }
                {legendsCtrl.stateId
                 ? <StateIdTxt x={xmax} y={ymin} stateId={state.id}></StateIdTxt>
                 : null
                }
                {legendsCtrl.reward
                 ? <StateRewardTxt x={xmax} y={ymax} reward={state.reward}></StateRewardTxt>
                 : null
                }
                {legendsCtrl.policy
                 ? <PolicyArrows state={state} arrowHeadDefId={this.props.arrowHeadDefId}></PolicyArrows>
                 : null
                }

                <rect x={xmin}
                      y={ymin}
                      height={height}
                      width={width}

                      ref={(ref) => {this.rect = ref;}}

                      stroke="black"
                      strokeWidth={0.2}
                      fillOpacity={0}
                      cursor="pointer"
                >
                </rect>
            </g>
        );
    }
}

export default Cell;
