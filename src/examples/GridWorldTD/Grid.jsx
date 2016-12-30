import React from 'react';
import ReactFauxDOM from 'react-faux-dom';
import * as d3 from 'd3';


/* draws the grid based on agent.env, agent.V and agent.P */

class Grid extends React.Component {
    initGrid (fauxElement, agent) {
        let env = agent.env;
        /* value function */
        let ValF = agent.V;
        let Pi = agent.Pi;

        let d3elt = d3.select(fauxElement);
        /* d3elt.append('div').html('');*/

        let cellSize = 60; /* cell size */

        let numRows = env.numRows; // height in cells
        let numCols = env.numCols; // width in cells
        let numCells = env.numCells; // total number of cells

        let gridWidth = 600;
        let gridHeight = 600;
        let svg = d3elt.append('svg')
                       .attr('width', gridWidth)
                       .attr('height', gridHeight)
                       .append('g')
                       .attr('transform', 'scale(1)');

        // define a marker for drawing arrowheads
        svg.append("defs")
           .append("marker")
           .attr("id", "arrowhead")
           .attr("refX", 3)
           .attr("refY", 2)
           .attr("markerWidth", 3)
           .attr("markerHeight", 4)
           .attr("orient", "auto")
           .append("path")
           .attr("d", "M 0,0 V 4 L3,2 Z");


        for (let y = 0; y < numRows; y++) {
            for (let x = 0; x < numCols; x++) {
                let xcoord = x * cellSize;
                let ycoord = y * cellSize;
                let r = 255,
                    g = 255,
                    b = 255;
                let currState = env.xytos(x, y);

                let grp = svg.append('g');

                // click callbackfor group
                grp.on('click', function(ss) {
                    /* return function() { cellClicked(ss); } // close over s*/
                }(currState));


                let vv = ValF[currState];
                let ms = 100;
                if (vv > 0) {
                    g = 255;
                    r = 255 - vv * ms;
                    b = 255 - vv * ms;
                }
                if (vv < 0) {
                    g = 255 + vv * ms;
                    r = 255;
                    b = 255 + vv * ms;
                }

                /* value color */
                let vcol;
                if (env.T[currState] === 1) {
                    vcol = "#AAA";
                } else {
                    vcol = 'rgb(' + Math.floor(r) + ',' + Math.floor(g) + ',' + Math.floor(b) + ')';
                }

                // set up cell rectangles
                grp.append('rect')
                   .attr('x', xcoord)
                   .attr('y', ycoord)
                   .attr('height', cellSize)
                   .attr('width', cellSize)
                   .attr('fill', vcol)
                   .attr('stroke', 'black')
                   .attr('stroke-width', 2);

                // state text
                grp.append('text')
                   .attr('x', xcoord + cellSize - 15)
                   .attr('y', ycoord + 10)
                   .attr('font-size', 10)
                   .attr('fill', 'blue')
                   .text(currState.toFixed(0));

                // skip rest for cliffs
                if (env.T[currState] === 1) {
                    continue;
                }

                // reward text
                grp.append('text')
                   .attr('x', xcoord + 3)
                   .attr('y', ycoord + 10)
                   .attr('font-size', 10)
                   .text(env.Rarr[currState].toFixed(1.1));

                // value text
                grp.append('text')
                   .attr('x', xcoord + 3)
                   .attr('y', ycoord + cellSize - 5)
                   .attr('font-size', 10)
                   .text(ValF[currState].toFixed(2));

                // this highlights where the (0, 0) point is: top left corner
                /* grp.append('circle')
                 *  .attr('cx', xcoord)
                 *  .attr('cy', ycoord)
                 *  .attr('fill', 'red')
                 *  .attr('r', 4);*/

                // policy arrows
                for (let a = 0; a < 4; a++) {
                    let pa = grp.append('line');

                    let prob = Pi[a * numCells + currState];
                    if (prob === 0) {
                        pa.attr('visibility', 'hidden');
                    } else {
                        pa.attr('visibility', 'visible');
                    }
                    let nx, ny;
                    /* let ss = cellSize / 2 * prob * 0.9;*/
                    let ss = cellSize / 6;
                    if (a === 0) {nx = -ss; ny = 0;}
                    if (a === 1) {nx = 0; ny = -ss;}
                    if (a === 2) {nx = 0; ny = ss;}
                    if (a === 3) {nx = ss; ny = 0;}

                    /* mapping are as below */
                    /* let actionMapping = {
                     *     0: '←',
                     *     1: '↑',
                     *     2: '↓',
                     *     3: '→'
                     * };*/

                    pa.attr('x1', xcoord + cellSize / 2)
                      .attr('y1', ycoord + cellSize / 2)
                      .attr('x2', xcoord + cellSize / 2 + nx)
                      .attr('y2', ycoord + cellSize / 2 + ny)
                      .attr('stroke', 'black')
                      .attr('stroke-width', '1')
                      .attr("marker-end", "url(#arrowhead)");
                }

                if (currState == agent.s0) {
                    console.log(currState, agent.s0);
                    // append agent position circle
                    grp.append('circle')
                       .attr('cx', xcoord + cellSize / 2)
                       .attr('cy', ycoord + cellSize / 2)
                       .attr('r', 15)
                       .attr('fill', '#FF0')
                       .attr('fill-opacity', 0.5)
                       .attr('stroke', '#000')
                       .attr('id', 'cpos');
                }
            }
        }
    }

    render () {
        let el = ReactFauxDOM.createElement('div');
        this.initGrid(el, this.props.agent);
        return el.toReact();
    }
}


export default Grid;
