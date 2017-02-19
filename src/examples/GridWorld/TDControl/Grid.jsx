import React, { Component, PropTypes } from 'react';

import Cell from './Cell.jsx';

import Frame from '../Base/Grid/Frame.jsx';
import Cliff from '../Base/Grid/Cliff.jsx';
import StartingState from '../Base/Grid/StartingState.jsx';
import ArrowHeadDef from '../Base/Grid/ArrowHeadDef.jsx';
import {calcCoords} from '../Base/Grid/gridUtils.js';


class Grid extends Component {
    propTypes: {
        id: PropTypes.string,
        height: PropTypes.number,
        width: PropTypes.number
    }

    render () {
        const {height, width, agent} = this.props;

        // add coords per cell to enable draw inside the cell
        const {numRows, numCols} = agent.env;
        const cellHeight = height / numRows;
        const cellWidth = width  / numCols;
        agent.env.states.forEach(function (st) {
            st.coords = calcCoords(st.x, st.y, cellHeight, cellWidth);
        });

        const arrowHeadDefId = "arrow-head";
        const grid = agent.env.states.map((state) => {
            return (
                state.isCliff ?
                <Cliff key={state.id} state={state} /> :
                <Cell  key={state.id} state={state} arrowHeadDefId={arrowHeadDefId} />
            );
        });

        // add this to make the border look more symmetric as border lines
        // between neighbouring cells are drawn multiple times
        const frame = [1, 2, 3].map(() => {
            return <Frame x={0} y={0} height={height} width={width}></Frame>
        })

        return (
            <div>
                <svg height={height} width={width}>
                    {frame}
                    <ArrowHeadDef markerId={arrowHeadDefId}></ArrowHeadDef>
                    {grid}
                    <StartingState coords={agent.env.getStartingState().coords}></StartingState>
                </svg>
            </div>
        );
    }
}

export default Grid;
