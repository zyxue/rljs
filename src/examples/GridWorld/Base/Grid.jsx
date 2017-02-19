import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';

import './Grid.css';
import Cell from './Cell.jsx';
import Cliff from './Cliff.jsx';
import {calcCoords} from './gridUtils.js';


class Grid extends Component {
    addDimensionsToStates() {
        // assign geometrical dimensions to each state according to passed
        // height and width
        const {height, width, agent} = this.props;
        const {numRows, numCols} = agent.env;
        const cellHeight = height / numRows;
        const cellWidth = width  / numCols;

        let that = this;
        agent.env.states.forEach(function (st) {
            st.cellHeight = cellHeight;
            st.cellWidth = cellWidth;
            st.coords = calcCoords(st.x, st.y, cellHeight, cellWidth);
        });
    }

    propTypes: {
        id: PropTypes.string,
        height: PropTypes.number,
        width: PropTypes.number
    }

    render () {
        const {height, width} = this.props;
        const env = this.props.agent.env;
        this.addDimensionsToStates();
        const grid = env.states.map((state) => {
            return (
                state.isCliff ?
                <Cliff key={state.id} state={state} /> :
                <Cell  key={state.id} state={state} />
            );
        });

        return (
            <div>
                <svg height={height} width={width}>
                    {grid}
                </svg>
            </div>
        );
    }
}

export default Grid;
