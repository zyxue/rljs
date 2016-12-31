import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';

/* adapted from
https://github.com/alanbsmith/react-d3-example/blob/master/src/ProgressArc.js */


function calcRGBColor(val) {
    /* based on the value, calculate the corresponding RGB color */

    let scaler = 500;
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

    return {red: r, green: g, blue: b};
}


function genRGBColorString(val) {
    let rgbColor = calcRGBColor(val);
    return 'rgb(' +
           Math.floor(rgbColor.red) + ',' +
           Math.floor(rgbColor.green) + ',' +
           Math.floor(rgbColor.blue) + ')';
}


function drawRect(grp, x, y, height, width, fillColor='white', strokeWidth=1) {
    grp.append('rect')
       .attr('x', x)
       .attr('y', y)
       .attr('height', height)
       .attr('width', width)
       .attr('fill', fillColor)
       .attr('stroke', 'black')
       .attr('stroke-width', strokeWidth);
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
                xmax:xmax, ymax:ymax}
    }

    drawCells(context) {
        const {height, width, agent,
               showQTriangles, showQVals,
               showStateVals, showStateCoords, showRewardVals} = this.props;
        const {env, Q, Pi} = agent;
        const {numRows, numCols} = env;
        const cellHeight = height / numRows;
        const cellWidth = width  / numCols;
        /* console.log(numRows, numCols, env, cellHeight, cellWidth);*/

        for (let ri = 0; ri < numRows; ri++) {
            for (let ci = 0; ci < numCols; ci++) {
                let currState = env.xytos(ci, ri);

                let coords = this.calcCoords(ci, ri, cellHeight, cellWidth);
                let {xmin, ymin,  xmid, ymid, xmax, ymax} = coords;

                let grp = context.append('g');

                /* draw cliff */
                if (env.cliffArr[currState] === 1) {
                    drawRect(grp, xmin, ymin, cellHeight, cellWidth, "#AAA");
                    continue;
                } 

                /* this function could be further refactored to reduce the
                   number of parameters passed */
                this.drawOneCell(
                    grp, env, Q, agent.maxNumActions, cellHeight, cellWidth,
                    ci, ri, coords,
                    showQTriangles, showQVals,
                    showStateVals, showStateCoords, showRewardVals)
            }
        }
    }

    drawOneCell(cellContext, env, Q, maxNumActions, cellHeight, cellWidth,
                ci, ri, coords,
                showQTriangles, showQVals,
                showStateVals, showStateCoords, showRewardVals) {
        let currState = env.xytos(ci, ri);
        
        if (showQTriangles) {
            let allowedActions = env.getAllowedActions(currState);
            for(let i=0; i < allowedActions.length; i++) {
                let currAction = allowedActions[i];
                let qval = Q[currState * maxNumActions + currAction];

                this.drawQTriangle(cellContext, currAction, qval, coords);
                if (showQVals) this.writeQ(cellContext, currAction, qval, coords);
            }
        } else {
            drawRect(cellContext, coords.xmin, coords.ymin, cellHeight, cellWidth);
        }

        if (showStateVals) this.writeState(cellContext, currState, coords);
        if (showStateCoords) this.writeStateCoord(cellContext, ci, ri, coords);
        /* this just show the reward of entering a given state without
           per step penalty */
        if (showRewardVals) this.writeReward(cellContext, env.Rarr[currState], coords);
    }


    drawQTriangle(cellContext, action, qval, coords) {
        let color = genRGBColorString(qval);
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

    writeState(cellContext, state, coords) {
        cellContext.append('text')
                   .attr('x', coords.xmax)
                   .attr('y', coords.ymin)
                   .attr("text-anchor", "end")
                   .attr("dominant-baseline", "text-before-edge")

                   .attr('font-size', 10)
                   .attr('fill', 'blue')
                   .text(state.toFixed(0));
                /* .text(state.toFixed(0) + ',' + x + ',' + y);*/
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

        let x = agent.env.stox(agent.s0);
        let y = agent.env.stoy(agent.s0);
        let coords = this.calcCoords(x, y, cellHeight, cellWidth);
        context.append('circle')
               .attr('cx', coords.xmid)
               .attr('cy', coords.ymid)
               .attr('r', 15)
               .attr('fill', '#FF0')
               .attr('fill-opacity', 0.5)
               .attr('stroke', '#000')
               .attr('id', 'cpos');
    }

    setContext() {
        const {height, width, id} = this.props;
        return d3.select(this.refs.gridDiv).append('svg')
                 .attr('height', height)
                 .attr('width', width)
                 .attr('id', id)
                 .append('g')
        /* .attr('transform', `translate(${height / 2}, ${width / 2})`);*/
    }

    setBackground(context) {
        return context.append('path')
                      .datum({ endAngle: Math.PI * 2 })
                      .style('fill', 'green')
                      .attr('d', this.arc());
    }

    propTypes: {
        id: PropTypes.string,
        height: PropTypes.number,
        width: PropTypes.number,
        /* backgroundColor: PropTypes.string,
         * foregroundColor: PropTypes.string,
         * percentComplete: PropTypes.number*/
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
        )        
    }
}


export default Grid;
