import React, { Component, PropTypes } from 'react';

import Cell from './Cell.jsx';

import Frame from '../Base/Grid/Frame.jsx';
import Cliff from '../Base/Grid/Cliff.jsx';
import StartingState from '../Base/Grid/StartingState.jsx';
import TerminalState from '../Base/Grid/TerminalState.jsx';
import ArrowHeadDef from '../Base/Grid/ArrowHeadDef.jsx';
import Agent from '../Base/Grid/Agent.jsx';
import {calcCoords} from '../Base/Grid/gridUtils.js';


class Grid extends Component {
    propTypes: {
        id: PropTypes.string,
        height: PropTypes.number,
        width: PropTypes.number
    }

    render () {
        const {height, width, agent, legendsCtrl} = this.props;

        // add coords per cell to enable drawing inside the cell
        const {numRows, numCols} = agent.env;
        agent.env.states.forEach(function (st) {
            st.coords = calcCoords(
                st.x, st.y, height / numRows, width / numCols);
        });

        const arrowHeadDefId = "arrow-head";
        const grid = agent.env.states.map((state) => {
            return (
                state.isCliff ?
                <Cliff key={state.id} state={state} /> :
                <Cell  key={state.id} state={state}
                       arrowHeadDefId={arrowHeadDefId}
                      legCtrl={legendsCtrl}
                />
            );
        });

        // add this to make the border look more symmetric as border lines
        // between neighbouring cells are drawn multiple times
        const frame = [1, 2, 3].map((_, idx) => {
            return <Frame key={idx} x={0} y={0} height={height} width={width}></Frame>
        })

        return (
            <div>
                <svg height={height} width={width}>
                    {frame}
                    <StartingState coords={agent.env.getStartingState().coords}></StartingState>
                    <TerminalState coords={agent.env.getTerminalState().coords}></TerminalState>
                    <ArrowHeadDef markerId={arrowHeadDefId}></ArrowHeadDef>
                    {grid}
                    <Agent agentState={agent.s0} agentAction={agent.a0}></Agent>
                </svg>
            </div>
        );
    }
}

export default Grid;
