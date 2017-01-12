import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';


import GridBase from '../Base/Grid.jsx';


class Grid extends GridBase {
    drawCells(context) {
        const {agent, legendsCtrl} = this.props;

        let that = this;
        agent.env.states.forEach(function (st) {
            let grp = context.append('g');

            if (st.isCliff) {
                that.drawCliff(grp, st);
            } else {
                that.drawOneCell(grp, st, legendsCtrl);
            }

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

        }) 
        
        if (this.props.selectedState !== null)
            this.highlightState(context, this.props.selectedState,
                                {fillColor: 'orange', fillOpacity: 0.5});

        this.highlightState(context, agent.env.startingState,
                            {fillColor: 'blue', fillOpacity: 0.3});
        this.highlightState(context, agent.env.terminalState,
                            {fillColor: 'green', fillOpacity: 0.3});
    }

    drawOneCell(cellContext, state, legendsCtrl) {
        let lc = legendsCtrl;

        /* let greedyAction = null;
         * let greedyQVal = null;*/
        let that = this;
        state.allowedActions.forEach(function(action) {
            that.drawQTriangle(cellContext, state, action);
            if (lc.qValue) that.writeQ(cellContext, state, action);
            if (lc.policy) that.drawPolicyArrow(cellContext, state, action);
            if (lc.etrace) that.drawTrace(cellContext, state, action);
        })

        if (lc.stateId) this.writeStateId(cellContext, state);
        if (lc.stateCoord) this.writeStateCoord(cellContext, state);
        if (lc.reward) this.writeReward(cellContext, state);
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

    drawTrace(cellContext, state, action) {
        let Z = state.Z[action];
        let {xmin, ymin,  xmid, ymid, xmax, ymax} = state.coords;
        let cx, cy;
        let C = 1 / 3;

        if (action === 0) {
            cx = (1 - C) * xmin + C * xmid;
            cy = ymid;
        } else if (action === 1) {
            cx = xmid;
            cy = (1 - C) * ymin + C * ymid;
        } else if (action === 2) {
            cx = C * xmid + (1 - C) * xmax;
            cy = ymid;
        } else if (action === 3) {
            cx = xmid;
            cy = C * ymid + (1 - C) * ymax;
        }

        cellContext.append('circle')
               .attr('cx', cx)
               .attr('cy', cy)
               // log so that size of circle doesn't change too dramatically
               // among neighbouring cells, 1 to avoid log of 0, and negative radius
        /* .attr('r', Math.log(Z * 1000 + 1))*/
                   .attr('r', Math.log(0.1 * 1000 + 1))
               .attr('fill', '#FF0')
               .attr('fill-opacity', 1)
               .attr('stroke', '#000')
               .attr('id', 'cpos');
    }


    writeQ(cellContext, state, action) {
        let {xmin, ymin,  xmid, ymid, xmax, ymax} = state.coords;
        let qVal = state.Q[action];
        if (action === 0) {
            cellContext.append('text')
                       .attr('x', xmin)
                       .attr('y', ymid)
                       .attr('font-size', 10)
                       .attr("text-anchor", "start")
                       .attr("dominant-baseline", "central")
                       .text(qVal.toFixed(1));

        } else if (action === 1) {
            cellContext.append('text')
                       .attr('x', xmid)
                       .attr('y', ymin)
                       .attr('font-size', 10)
                       .attr("text-anchor", "middle")
                       .attr("dominant-baseline", "text-before-edge")
                       .text(qVal.toFixed(1));
        } else if (action === 2) {
            cellContext.append('text')
                       .attr('x', xmax)
                       .attr('y', ymid)
                       .attr('font-size', 10)
                       .attr("text-anchor", "end")
                       .attr("dominant-baseline", "central")
                       .text(qVal.toFixed(1));

        } else if (action === 3) {
            cellContext.append('text')
                       .attr('x', xmid)
                       .attr('y', ymax)
                       .attr('font-size', 10)
                       .attr("text-anchor", "middle")
                       .attr("dominant-baseline", "text-after-edge")
                       .text(qVal.toFixed(1));
        }
    }

}

export default Grid;
