import React, { Component, PropTypes } from 'react';

import Cell from './Cell.jsx';
import Cliff from './Cliff.jsx';
import ArrowHeadDef from './ArrowHeadDef.jsx';
import {calcCoords} from './gridUtils.js';

import './Grid.css';

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

        return (
            <div>
                <svg height={height} width={width}>
                    <ArrowHeadDef markerId={arrowHeadDefId}></ArrowHeadDef>;
                    {grid}
                </svg>
            </div>
        );
    }
}

export default Grid;
