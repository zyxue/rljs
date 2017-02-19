import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';

import './Grid.css';
import Cell from './Cell.jsx';
import Cliff from './Cliff.jsx';
import {calcCoords} from './gridUtils.js';

/* adapted from
https://github.com/alanbsmith/react-d3-example/blob/master/src/ProgressArc.js */


class Grid extends Component {
    /* drawGrid() {
     *     const context = this.setContext();
     *     this.addDimensionsToStates();
     *     this.drawCells(context);
     *     this.drawAgent(context);
     * }

     * redrawCell() {
     *     const context = d3.select('#' + this.props.id);
     *     context.remove();
     *     this.drawGrid();
     * }
     */

    /* setContext() {
     *     const {height, width, id} = this.props;
     *     let context = d3.select(this.refs.gridDiv).append('svg')
     *                     .attr('height', height)
     *                     .attr('width', width)
     *                     .attr('id', id)
     *                     .append('g');

     *     context.append("defs")
     *            .append("marker")
     *            .attr("id", "arrowhead")
     *            .attr("refX", 3)
     *            .attr("refY", 2)
     *            .attr("markerWidth", 3)
     *            .attr("markerHeight", 4)
     *            .attr("orient", "auto")
     *            .append("path")
     *            .style('stroke', 'black')
     *            .style('fill', 'black')
     *            .style('stroke-linejoin', "miter")
     *            .attr("d", "M 0,0 V 4 L3,2 Z");
     *     return context;
     * }*/

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

    /* 
     *     componentDidMount() {
     *         this.drawGrid();
     *     }
     * 
     *     componentDidUpdate() {
     *         this.redrawGrid();
     *     }*/

    render () {
        const {height, width} = this.props;
        const env = this.props.agent.env;
        this.addDimensionsToStates();
        const grid = env.states.map((state) => {
            return (
                state.isCliff ?
                <Cliff key={state.id} state={state} /> :
                <Cell key={state.id} state={state} />
            )
        });

        return (
            <div>
                <svg height={height} width={width}>{grid}</svg>
            </div>
        );
    }
}

export default Grid;
