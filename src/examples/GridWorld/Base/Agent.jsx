import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';


class Trace extends Component {
    
}


class Agent extends Component {
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
        // console.debug(pointsStr);
        cellContext.append('polygon')
                   .attr('points', pointsStr)
                   .attr('fill', 'blue')
                   .attr('fill-opacity', 1)
                   .attr('stroke', 'black')
                   .attr('stroke-width', 0.5);
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

}
