import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';

/* adapted from
https://github.com/alanbsmith/react-d3-example/blob/master/src/ProgressArc.js */


function calcRGBColor(val) {
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


function genRGBColorString(val) {
    let rgbColor = calcRGBColor(val);
    return 'rgb(' +
           Math.floor(rgbColor.red) + ',' +
           Math.floor(rgbColor.green) + ',' +
           Math.floor(rgbColor.blue) + ')';
}


function drawRect(grp, x, y, height, width,
                  {fillColor='white', fillOpacity=1, strokeColor='black', strokeWidth=1}={}) {
    grp.append('rect')
       .attr('x', x)
       .attr('y', y)
       .attr('height', height)
       .attr('width', width)
       .attr('fill', fillColor)
       .attr('stroke', strokeColor)
       .attr('stroke-width', strokeWidth)
       .attr('fill-opacity', fillOpacity);
}


function genPointsStr(action, coords) {
    let {xmin, ymin, xmid, ymid, xmax, ymax} = coords;

    /* given an action, it generate the 3 points needed to form a triagle*/
    let str;
    if (action === 0) {
        str = xmin + ',' + ymin + ' ' +
              xmin + ',' + ymax + ' ' +
              xmid + ',' + ymid;

    } else if (action === 1) {
        str = xmin + ',' + ymin + ' ' +
              xmax + ',' + ymin + ' ' +
              xmid + ',' + ymid;

    } else if (action === 2) {
        str = xmax + ',' + ymin + ' ' +
              xmax + ',' + ymax + ' ' +
              xmid + ',' + ymid;

    } else if (action === 3) {
        str = xmin + ',' + ymax + ' ' +
              xmax + ',' + ymax + ' ' +
              xmid + ',' + ymid;
    }
   return str;
}


function genPointsStrForAgentAction(action, coords) {
    let {xmin, ymin, xmid, ymid, xmax, ymax} = coords;

    // scaler
    let S = 5 / 6
    let str;
    if (action === 0) {
        str = (xmid - xmin) * (1 - S) + xmin + ',' + ymid + ' ' +
              xmid + ',' + (ymax + ymid) / 2 + ' ' +
              xmid + ',' + (ymin + ymid) / 2;

    } else if (action === 1) {
        str = xmid + ',' + ((ymid - ymin) * (1 - S) + ymin) + ' ' +
              (xmin + xmid) / 2 + ',' + ymid + ' ' +
              (xmax + xmid) / 2 + ',' + ymid;

    } else if (action === 2) {
        str = (xmax - xmid) * S + xmid  + ',' + ymid + ' ' +
              xmid + ',' + (ymax + ymid) / 2 + ' ' +
              xmid + ',' + (ymin + ymid) / 2;

    } else if (action === 3) {
        str = xmid + ',' + ((ymax - ymid) * S + ymid) + ' ' +
              (xmin + xmid) / 2 + ',' + ymid + ' ' +
              (xmax + xmid) / 2 + ',' + ymid;
    }
   return str;
}


/* draws the grid based on agent.env, agent.V and agent.P */

class Grid extends Component {
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

    calcCoords(x, y, height, width) {
        /* the 6 numbers decide coordinates of 5 points, which decide 4 triagles
           corresponding for 4 Q values at each state */
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

    drawCells(context) {
        const {height, width, agent, env, showLegend} = this.props;
        const {numRows, numCols} = env;
        const cellHeight = height / numRows;
        const cellWidth = width  / numCols;

        let that = this;
        env.states.forEach(function (st, idx, arr) {
            let coords = that.calcCoords(st.x, st.y, cellHeight, cellWidth);
            let grp = context.append('g');

            if (st.isCliff) {
                console.debug('Cliff!');
                drawRect(grp, coords.xmin, coords.ymin, cellHeight, cellWidth, {fillColor: "#AAA"});
            } else {
                that.drawOneCell(grp, st, coords, showLegend);
            }
        }) 

        // height terminal state
        this.highlightTerminalState(context, env, cellHeight, cellWidth);
    }

    highlightTerminalState(context, env, cellHeight, cellWidth) {
        let x = env.stox(env.terminalState.id);
        let y = env.stoy(env.terminalState.id);
        let coords = this.calcCoords(x, y, cellHeight, cellWidth);
        drawRect(context, coords.xmin, coords.ymin, cellHeight, cellWidth,
                 {fillOpacity: 0, strokeColor: 'green', strokeWidth: 4});
    }

    drawOneCell(cellContext, st, coords, showLegend) {
        let cellHeight = coords.ymax - coords.ymin;
        let cellWidth = coords.xmax - coords.xmin;
        /* console.debug(st.V);*/
        drawRect(cellContext, coords.xmin, coords.ymin, cellHeight, cellWidth,
                 {fillColor: genRGBColorString(st.V)});

        if (showLegend.stateValue) this.writeStateValue(cellContext, st.V, coords);
        if (showLegend.stateId) this.writeStateId(cellContext, st.id, coords);
        if (showLegend.stateCoords) this.writeStateCoord(cellContext, st.x, st.y, coords);
        if (showLegend.reward) this.writeReward(cellContext, st.reward, coords);
    }

    drawQTriangle(cellContext, action, coords, {qVal=0, color=genRGBColorString(qVal)}={}) {
        let pointsStr = genPointsStr(action, coords);
        /* console.debug(pointsStr);*/
        cellContext.append('polygon')
                   .attr('points', pointsStr)
                   .attr('fill', color)
                   .attr('fill-opacity', 1)
                   .attr('stroke', 'black')
                   .attr('stroke-width', 0.5);
    }

    writeQ(cellContext, action, qval, coords) {
        let {xmin, ymin,  xmid, ymid, xmax, ymax} = coords;
        if (action === 0) {
            cellContext.append('text')
               .attr('x', xmin)
               .attr('y', ymid)
               .attr('font-size', 10)
               .attr("text-anchor", "start")
               .attr("dominant-baseline", "central")
               .text(qval.toFixed(1));

        } else if (action === 1) {
            cellContext.append('text')
               .attr('x', xmid)
               .attr('y', ymin)
               .attr('font-size', 10)
               .attr("text-anchor", "middle")
               .attr("dominant-baseline", "text-before-edge")
               .text(qval.toFixed(1));
        } else if (action === 2) {
            cellContext.append('text')
               .attr('x', xmax)
               .attr('y', ymid)
               .attr('font-size', 10)
               .attr("text-anchor", "end")
               .attr("dominant-baseline", "central")
               .text(qval.toFixed(1));

        } else if (action === 3) {
            cellContext.append('text')
               .attr('x', xmid)
               .attr('y', ymax)
               .attr('font-size', 10)
               .attr("text-anchor", "middle")
               .attr("dominant-baseline", "text-after-edge")
               .text(qval.toFixed(1));
        }
    }

    writeStateValue(cellContext, val, coords) {
        cellContext.append('text')
                   .attr('x', coords.xmid)
                   .attr('y', coords.ymid)
                   .attr("text-anchor", "middle")
                   .attr("dominant-baseline", "middle")
                   .attr('font-size', 10)
                   .attr('fill', 'blue')
                   .text(val.toFixed(2));
    }

    writeStateId(cellContext, id, coords) {
        cellContext.append('text')
                   .attr('x', coords.xmax)
                   .attr('y', coords.ymin)
                   .attr("text-anchor", "end")
                   .attr("dominant-baseline", "text-before-edge")

                   .attr('font-size', 10)
                   .attr('fill', 'blue')
                   .text(id.toFixed(0));
    }

    writeStateCoord(cellContext, stateCoordx, stateCoordy, coords) {
        cellContext.append('text')
                   .attr('x', coords.xmin)
                   .attr('y', coords.ymin)
                   .attr("text-anchor", "start")
                   .attr("dominant-baseline", "text-before-edge")

                   .attr('font-size', 10)
                   .attr('fill', 'blue')
                   .text('(' + stateCoordx + ',' + stateCoordy + ')');
    }

    writeReward(cellContext, reward, coords) {
        let color = 'black';
        let fontWeight = reward > 0 ? 800 : 450;
        cellContext.append('text')
                   .attr('x', coords.xmax)
                   .attr('y', coords.ymax)
                   .attr("text-anchor", "end")
                   .attr("dominant-baseline", "text-after-edge")
                   .attr('font-size', 10)
                   .attr('font-weight', fontWeight)
        /* .attr('stroke', 'black')
         * .attr('stroke-width', 0.1)*/
                   .attr('fill', color)
                   .text(reward.toFixed(1.1));
    }

    drawAgent(context) {
        const {height, width, agent} = this.props;
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
               .attr('fill', '#FF0')
               .attr('fill-opacity', 1)
               .attr('stroke', '#000')
               .attr('id', 'cpos');
    }

    drawAgentAction(cellContext, action, coords) {
        let pointsStr = genPointsStrForAgentAction(action, coords);
        /* console.debug(pointsStr);*/
        cellContext.append('polygon')
                   .attr('points', pointsStr)
                   .attr('fill', 'blue')
                   .attr('fill-opacity', 1)
                   .attr('stroke', 'black')
                   .attr('stroke-width', 0.5);
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

    propTypes: {
        id: PropTypes.string,
        height: PropTypes.number,
        width: PropTypes.number
    }

    componentDidMount() {
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
