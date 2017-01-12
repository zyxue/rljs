import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';

/* adapted from
https://github.com/alanbsmith/react-d3-example/blob/master/src/ProgressArc.js */


class Grid extends Component {
    handleMouseClick(rect, state) {
        /* console.debug('state: ', state);*/
        this.props.updateSelectedState(state);
        /* console.debug('selectedState: ' + this.props.selectedState);*/
    }

    drawGrid() {
        const context = this.setContext();
        this.drawCells(context);
        this.drawAgent(context);
    }

    redrawGrid() {
        const context = d3.select('#' + this.props.id);
        context.remove();
        this.drawGrid();
    }

    drawCells(context) {
        /* to be overwritten */
    }

    drawTrace(context) {
        /* todo */
    }

    drawCliff(context, state) {
        context.append('rect')
               .attr('x', state.coords.xmin)
               .attr('y', state.coords.ymin)
               .attr('height', state.cellHeight)
               .attr('width', state.cellWidth)
               .attr('stroke', 'black')
               .attr('stroke-width', 1)
               .attr('fill', '#AAA');
    }

    calcCoords(x, y, height, width) {
        /* the 6 numbers that define the coordinates of 5 points in side each
           square, useful for e.g. drawing triagles corresponding to Q values at
           each state */
        let xmin = x * width;
        let ymin = y * height;
        let xmax = (x + 1) * width;
        let ymax = (y + 1) * height;
        let xmid = (x + 0.5) * width;
        let ymid = (y + 0.5) * height;
        return {xmin:xmin, ymin:ymin,
                xmid:xmid, ymid:ymid,
                xmax:xmax, ymax:ymax};
    }

    /* writeStateValue(cellContext, val, coords) {
     *     cellContext.append('text')
     *                .attr('x', coords.xmid)
     *                .attr('y', coords.ymid)
     *                .attr("text-anchor", "middle")
     *                .attr("dominant-baseline", "middle")
     *                .attr('font-size', 10)
     *                .attr('fill', 'blue')
     *                .text(val.toFixed(2));
     * }
     */

    writeStateId(cellContext, state) {
        cellContext.append('text')
                   .attr('x', state.coords.xmax)
                   .attr('y', state.coords.ymin)
                   .attr("text-anchor", "end")
                   .attr("dominant-baseline", "text-before-edge")
                   .attr('font-size', 10)
                   .attr('fill', 'blue')
                   .text(state.id.toFixed(0));
    }

    writeStateCoord(cellContext, state) {
        cellContext.append('text')
                   .attr('x', state.coords.xmin)
                   .attr('y', state.coords.ymin)
                   .attr("text-anchor", "start")
                   .attr("dominant-baseline", "text-before-edge")

                   .attr('font-size', 10)
                   .attr('fill', 'blue')
                   .text('(' + state.x + ',' + state.y + ')');
    }

    writeReward(cellContext, state) {
        let reward = state.reward
        let color = 'blue';
        let fontWeight = reward > 0 ? 800 : 450;
        cellContext.append('text')
                   .attr('x', state.coords.xmax)
                   .attr('y', state.coords.ymax)
                   .attr("text-anchor", "end")
                   .attr("dominant-baseline", "text-after-edge")
                   .attr('font-size', 10)
                   .attr('font-weight', fontWeight)
        /* .attr('stroke', 'black')
         * .attr('stroke-width', 0.1)*/
                   .attr('fill', color)
                   .text('r' + reward.toFixed(1.1));
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

        let pa = cellContext.append('line')
                            .attr('x1', coords.xmid)
                            .attr('y1', coords.ymid)
                            .attr('x2', coords.xmid + nx)
                            .attr('y2', coords.ymid + ny)
                            .attr('stroke', 'black')
                            .attr('stroke-width', 1)
                            .attr("marker-end", "url(#arrowhead)");
    }


    drawAgent(context) {
        const {height, width, agent, updateAgentAction} = this.props;
        const {numRows, numCols} = agent.env;
        const cellHeight = height / numRows;
        const cellWidth = width  / numCols;

        let x = agent.env.stox(agent.s0.id);
        let y = agent.env.stoy(agent.s0.id);
        let coords = this.calcCoords(x, y, cellHeight, cellWidth);
        this.drawAgentAction(context, agent.a0, coords, {color: 'blue'});
        context.append('circle')
               .attr('cx', coords.xmid)
               .attr('cy', coords.ymid)
               .attr('r', 15)
               .attr('fill', '#FFD800')
               .attr('fill-opacity', 1)
               .attr('stroke', '#000')
               .attr('id', 'cpos')
               .style('cursor', 'pointer')
               .on('click', function () {
                   updateAgentAction();
               })
    }

    drawAgentAction(cellContext, action, coords) {
        let pointsStr = this.genPointsStrForAgentAction(action, coords);
        /* console.debug(pointsStr);*/
        cellContext.append('polygon')
                   .attr('points', pointsStr)
                   .attr('fill', 'blue')
                   .attr('fill-opacity', 1)
                   .attr('stroke', 'black')
                   .attr('stroke-width', 0.5);
    }

    highlightState(context, state,
                   {fillColor=null, fillOpacity=1, strokeColor='black', strokeWidth=0}={}) {
        let coords = state.coords;
        let line = d3.svg.line()
                     .x(function(d) { return d[0]; })
                     .y(function(d) { return d[1]; });

        let that = this;
        context.append('path')
               .attr("d", line([
                   [coords.xmin, coords.ymin],
                   [coords.xmax, coords.ymin],
                   [coords.xmax, coords.ymax],
                   [coords.xmin, coords.ymax],
                   [coords.xmin, coords.ymin]
               ]))
               .style('class', 'highlightFrame')
               .style('stroke', strokeColor)
               .style('stroke-width', strokeWidth)
               .style('fill', fillColor)
               .style('fill-opacity', fillOpacity)
               .style('cursor', 'pointer')
               .on('click', function() {
                   that.handleMouseClick(this, state);
               });
    }

    genRGBColorString(val) {
        let rgbColor = this.calcRGBColor(val);
        return 'rgb(' +
               Math.floor(rgbColor.red) + ',' +
               Math.floor(rgbColor.green) + ',' +
               Math.floor(rgbColor.blue) + ')';
    }


    calcRGBColor(val) {
        /* based on the value, calculate the corresponding RGB color */

        let scaler = 1000;
        let r, g, b;
        if (val > 0) {
            r = 255 - val * scaler;
            g = 255;
            b = 255 - val * scaler;
        } else if (val === 0) {
            r = 255;
            g = 255;
            b = 255;
        }
        if (val < 0) {
            r = 255;
            g = 255 + val * scaler;
            b = 255 + val * scaler;
        }

        /* console.debug(r, g, b);*/
        return {red: r, green: g, blue: b};
    }

    genPointsStrForAgentAction(action, coords) {
        let {xmin, ymin, xmid, ymid, xmax, ymax} = coords;

        // a couple of scalers
        let S = 5 / 9;
        let C = 6 / 19;
        let str;
        if (action === 0) {
            str = (xmid - xmin) * (1 - S) + xmin + ',' + ymid + ' ' +
                  xmid + ',' + (  C * (ymax - ymid) + ymid)  + ' ' +
                  xmid + ',' + (- C * (ymid - ymin) + ymid);

        } else if (action === 1) {
            str = xmid + ',' + ((ymid - ymin) * (1 - S) + ymin) + ' ' +
                  (- C * (xmid - xmin) + xmid) + ',' + ymid + ' ' +
                  (  C * (xmax - xmid) + xmid) + ',' + ymid;
        } else if (action === 2) {
            str = (xmax - xmid) * S + xmid  + ',' + ymid + ' ' +
                  xmid + ',' + (  C * (ymax - ymid) + ymid) + ' ' +
                  xmid + ',' + (- C * (ymid - ymin) + ymid);

        } else if (action === 3) {
            str = xmid + ',' + ((ymax - ymid) * S + ymid) + ' ' +
                  (- C * (xmid - xmin) + xmid) + ',' + ymid + ' ' +
                  (  C * (xmax - xmid) + xmid) + ',' + ymid;
        }
        return str;
    }

    setContext() {
        const {height, width, id} = this.props;
        let context = d3.select(this.refs.gridDiv).append('svg')
                        .attr('height', height)
                        .attr('width', width)
                        .attr('id', id)
                        .append('g');

        context.append("defs")
               .append("marker")
               .attr("id", "arrowhead")
               .attr("refX", 3)
               .attr("refY", 2)
               .attr("markerWidth", 3)
               .attr("markerHeight", 4)
               .attr("orient", "auto")
               .append("path")
               .attr("d", "M 0,0 V 4 L3,2 Z");
        return context;
    }

    /* setBackground(context) {
     *     return context.append('path')
     *                   .datum({ endAngle: Math.PI * 2 })
     *                   .style('fill', 'green')
     *                   .attr('d', this.arc());
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
            st.coords = that.calcCoords(st.x, st.y, cellHeight, cellWidth);
        });
    }

    propTypes: {
        id: PropTypes.string,
        height: PropTypes.number,
        width: PropTypes.number
    }

    componentDidMount() {
        this.addDimensionsToStates();
        this.drawGrid();
    }

    componentDidUpdate() {
        this.redrawGrid();
    }

    render () {
        return (
            <div ref="gridDiv"></div>
        );
    }
}


export default Grid;
