import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';


// In contrast to Cliff.jsx, this file defines the UI of a normal cell


class CellFrame extends Component {
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
    // in contrast to cliff, this is a regular Cell
    drawCell() {
        const state = this.props.state
        const context = this.setContext();
        /* this.writeStateId(context, state);*/
        /* this.addDimensionsToStates();
         * this.drawCells(context);
         * this.drawAgent(context);*/
    }

    /* redrawCell() {
     *     const context = d3.select('#' + this.props.id);
     *     context.remove();
     *     this.drawGrid();
     * }*/

    handleStateMouseClick(rect, state) {
        /* to be overwritten */
    }


    drawPolicyArrow(cellContext, state, action) {
        let nx, ny;
        let {Q, coords} = state;
        /* maximum length of horizontal and vertical length */
        let maxH = state.cellWidth / 2;
        let maxV = state.cellHeight / 2;

        let minQ = Q[state.allowedActions[0]];
        state.allowedActions.forEach((a) => {
            if (Q[a] < minQ) minQ = Q[a];
        });

        let qSum = 0;
        let normedQval = null;
        state.allowedActions.forEach((a) => {
            let normed = Q[a] - minQ;
            qSum += normed
            if (a === action) normedQval = normed;
        });

        let ratio = (qSum > 0) ? Math.abs(normedQval) / qSum : 0;

        if (action === 0) {nx = - maxH * ratio; ny = 0;}
        if (action === 1) {nx = 0; ny = - maxV * ratio;}
        if (action === 2) {nx = maxH * ratio; ny = 0;}
        if (action === 3) {nx = 0; ny = maxV * ratio;}

        cellContext.append('line')
                   .attr('x1', coords.xmid)
                   .attr('y1', coords.ymid)
                   .attr('x2', coords.xmid + nx)
                   .attr('y2', coords.ymid + ny)
                   .attr('stroke', 'black')
                   .attr('stroke-width', 1 * Math.pow(1 + ratio, 2) )
                   .attr("marker-end", "url(#arrowhead)");
    }


    setContext() {
        const {height, width, id} = this.props.state;
        /* let context = d3.select(this.refs["cellDiv" + this.props.state.id]).append('g')
         *                 .attr('height', height)
         *                 .attr('width', width)
         *                 .attr('id', id)
         *                 .append('g');*/
    }
    
    /* componentDidMount() {
     *     this.drawCell();
     * }*/
    
    /* componentDidUpdate() {
     *     this.redrawCell();
     * }*/

    render () {
        const state = this.props.state;
        const {xmin, ymin, xmax, ymax} = state.coords;
        console.log(state.x, state.y);
        return (
            <g className="cell">
                <StateCoordTxt x={xmin} y={ymin} coordX={state.x} coordY={state.y}></StateCoordTxt>
                <StateIdTxt x={xmax} y={ymin} stateId={state.id}></StateIdTxt>
                <RewardTxt x={xmax} y={ymax} reward={state.reward}></RewardTxt>
                <CellFrame x={xmin} y={ymin} height={ymax - ymin} width={xmax - xmin}></CellFrame>
            </g>
        );
    }
}


export default Cell;
