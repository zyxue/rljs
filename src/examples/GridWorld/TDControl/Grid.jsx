import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';


import GridBase from '../Base/Grid.jsx';


class Grid extends GridBase {
    drawCells(context) {
        const {agent, showLegend} = this.props;

        let that = this;
        agent.env.states.forEach(function (st) {
            let grp = context.append('g');
            let fillColor = st.isCliff ? '#AAA' : that.genRGBColorString(1);
            
            that.drawOneCell(grp, st);

            /* grp.append('rect')
             *    .attr('x', st.coords.xmin)
             *    .attr('y', st.coords.ymin)
             *    .attr('height', st.cellHeight)
             *    .attr('width', st.cellWidth)
             *    .attr('stroke', 'black')
             *    .attr('stroke-width', 1)
             *    .attr('fill', fillColor)
             * // add a click event
             *    .style('cursor', 'pointer')
             *    .on('click', function() {
             *        // here, this is the rect object
             *        // console.debug(this);
             *        // console.debug(that.handleMouseClick);
             *        that.handleMouseClick(this, st);
             *    });*/
            
            /* if (showLegend.stateValue) that.writeStateValue(grp, st.V, coords);
             * if (showLegend.stateId) that.writeStateId(grp, st.id, coords);
             * if (showLegend.stateCoord) that.writeStateCoord(grp, st.x, st.y, coords);
             * if (showLegend.reward) that.writeReward(grp, st.reward, coords);
             * 
             * if (showLegend.etrace) that.drawTrace(grp, st.Z, coords);*/
        }) 
        
        /* if (this.props.selectedState !== null)
         *     this.highlightState(context, this.props.selectedState, cellHeight, cellWidth,
         *                         {fillColor: 'orange', fillOpacity: 0.5});
         * 
         * this.highlightState(context, agent.env.startingState, cellHeight, cellWidth,
         *                     {fillColor: 'blue', fillOpacity: 0.3});
         * this.highlightState(context, agent.env.terminalState, cellHeight, cellWidth,
         *                     {fillColor: 'green', fillOpacity: 0.3});*/
    }

    drawOneCell(cellContext, state) {
        /* let greedyAction = null;
         * let greedyQVal = null;*/
        let that = this;
        state.allowedActions.forEach(function(action) {
            /* let qVal = Q[currState * maxNumActions + currAction];

             * let needUpdate = false;
             * if (greedyAction === null) {
             *     needUpdate = true;
             * } else {
             *     if (qVal  > greedyQVal) {
             *         needUpdate = true;
             *     }
             * }

             * if (needUpdate) {
             *     greedyAction = currAction;
             *     greedyQVal = qVal;
             * }*/

            that.drawQTriangle(cellContext, state, action);
            /* if (showQVals) this.writeQ(cellContext, currAction, qVal, coords);*/
        })
    }

    genQPointsStr(coords, action) {
        let {xmin, ymin, xmid, ymid, xmax, ymax} = coords;

        // given an action, it generate the 3 points needed to form a triagle
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

    drawQTriangle(cellContext, state, action) {
        let pointsStr = this.genQPointsStr(state.coords, action);
        let qVal = state.Q[action];
        let color = this.genRGBColorString(qVal);
        // console.debug(pointsStr);
        cellContext.append('polygon')
                   .attr('points', pointsStr)
                   .attr('fill', color)
                   .attr('fill-opacity', 1)
                   .attr('stroke', 'black')
                   .attr('stroke-width', 0.5);
    }

        // draw arrow for greedy action
        /* if (greedyQVal !== 0) {
         *     let nx, ny;
         *     let scaler = 4;
         *     if (greedyAction === 0) {nx = - cellWidth / scaler; ny = 0;}
         *     if (greedyAction === 1) {nx = 0; ny = - cellHeight / scaler;}
         *     if (greedyAction === 2) {nx = cellWidth / scaler; ny = 0;}
         *     if (greedyAction === 3) {nx = 0; ny = cellHeight / scaler;}

         *     let pa = cellContext.append('line')
         *                         .attr('x1', coords.xmid)
         *                         .attr('y1', coords.ymid)
         *                         .attr('x2', coords.xmid + nx)
         *                         .attr('y2', coords.ymid + ny)
         *                         .attr('stroke', 'black')
         *                         .attr('stroke-width', 1.5)
         *                         .attr("marker-end", "url(#arrowhead)");
         * }*/

    /* if (showStateVals) this.writeState(cellContext, currState, coords);
     * if (showStateCoords) this.writeStateCoord(cellContext, ci, ri, coords);
     * // this just show the reward of entering a given state without
     * // per step penalty
     * if (showRewardVals) this.writeReward(cellContext, env.Rarr[currState], coords);
       }*/


    /* 
     *     drawOneCell(cellContext, env, Q, maxNumActions, cellHeight, cellWidth,
     *                 ci, ri, coords,
     *                 showQTriangles, showQVals,
     *                 showStateVals, showStateCoords, showRewardVals) {
     *         let currState = env.xytos(ci, ri);
     *         
     *         if (showQTriangles) {
     *             let allowedActions = env.getAllowedActions(currState);
     * 
     *             let greedyAction = null;
     *             let greedyQVal = null;
     *             for(let i=0; i < allowedActions.length; i++) {
     *                 let currAction = allowedActions[i];
     *                 let qVal = Q[currState * maxNumActions + currAction];
     * 
     *                 let needUpdate = false;
     *                 if (greedyAction === null) {
     *                     needUpdate = true;
     *                 } else {
     *                     if (qVal  > greedyQVal) {
     *                         needUpdate = true;
     *                     }
     *                 }
     * 
     *                 if (needUpdate) {
     *                     greedyAction = currAction;
     *                     greedyQVal = qVal;
     *                 }
     * 
     *                 this.drawQTriangle(cellContext, currAction, coords, {qVal: qVal});
     *                 if (showQVals) this.writeQ(cellContext, currAction, qVal, coords);
     *             }
     * 
     *             // draw arrow for greedy action
     *             if (greedyQVal !== 0) {
     *                 let nx, ny;
     *                 let scaler = 4;
     *                 if (greedyAction === 0) {nx = - cellWidth / scaler; ny = 0;}
     *                 if (greedyAction === 1) {nx = 0; ny = - cellHeight / scaler;}
     *                 if (greedyAction === 2) {nx = cellWidth / scaler; ny = 0;}
     *                 if (greedyAction === 3) {nx = 0; ny = cellHeight / scaler;}
     * 
     *                 let pa = cellContext.append('line')
     *                                     .attr('x1', coords.xmid)
     *                                     .attr('y1', coords.ymid)
     *                                     .attr('x2', coords.xmid + nx)
     *                                     .attr('y2', coords.ymid + ny)
     *                                     .attr('stroke', 'black')
     *                                     .attr('stroke-width', 1.5)
     *                                     .attr("marker-end", "url(#arrowhead)");
     *             }
     *         } else {
     *             drawRect(cellContext, coords.xmin, coords.ymin, cellHeight, cellWidth);
     *         }
     * 
     *         if (showStateVals) this.writeState(cellContext, currState, coords);
     *         if (showStateCoords) this.writeStateCoord(cellContext, ci, ri, coords);
     *         // this just show the reward of entering a given state without
     *         // per step penalty
     *         if (showRewardVals) this.writeReward(cellContext, env.Rarr[currState], coords);
     *     }
     * 
     *     drawQTriangle(cellContext, action, coords, {qVal=0, color=genRGBColorString(qVal)}={}) {
     *         let pointsStr = genPointsStr(action, coords);
     *         // console.debug(pointsStr);
     *         cellContext.append('polygon')
     *                    .attr('points', pointsStr)
     *                    .attr('fill', color)
     *                    .attr('fill-opacity', 1)
     *                    .attr('stroke', 'black')
     *                    .attr('stroke-width', 0.5);
     *     }
     * */

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

}

export default Grid;
