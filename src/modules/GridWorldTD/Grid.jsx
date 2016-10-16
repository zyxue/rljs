import React from 'react';
import ReactDOM from 'react-dom';
import ReactFauxDOM from 'react-faux-dom';
import * as d3 from 'd3';


/* draws the grid based on agent.env, agent.V and agent.P */

class Grid extends React.Component {
    initGrid (fauxElement, agent) {
        let env = agent.env;
        let V = agent.V;
        let P = agent.P

        let d3elt = d3.select(fauxElement);

        console.log(fauxElement);
        console.log(fauxElement.attr);
        console.log(d3elt);

        let cs = 60; /* cell size*/

        let gh = env.horizontalNumStates;
        let gw = env.verticalNumStates;
        let gs = env.totalNumStates;

        let svg = d3elt.append('svg')
                       .attr('width', '100%')
                       .attr('height', '100%')
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


        for (var y = 0; y < gh; y++) {
            for (var x = 0; x < gw; x++) {
                var xcoord = x * cs;
                var ycoord = y * cs;
                var r = 255,
                    g = 255,
                    b = 255;
                var s = env.xytos(x, y);

                var grp = svg.append('g');


                // click callbackfor group
                grp.on('click', function(ss) {
                    /* return function() { cellClicked(ss); } // close over s*/
                }(s));


                var vv = V[s];
                var ms = 100;
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
                var vcol;
                if (env.T[s] === 1) {
                    vcol = "#AAA";
                } else {
                    vcol = 'rgb(' + Math.floor(r) + ',' + Math.floor(g) + ',' + Math.floor(b) + ')';
                }

                // set up cell rectangles
                grp.append('rect')
                   .attr('x', xcoord)
                   .attr('y', ycoord)
                   .attr('height', cs)
                   .attr('width', cs)
                   .attr('fill', vcol)
                   .attr('stroke', 'black')
                   .attr('stroke-width', 2);

                // state text
                grp.append('text')
                   .attr('x', xcoord + cs - 15)
                   .attr('y', ycoord + 10)
                   .attr('font-size', 10)
                   .text(s.toFixed(0));

                // skip rest for cliffs
                if (env.T[s] === 1) {
                    continue;
                }

                // reward text
                grp.append('text')
                   .attr('x', xcoord + 3)
                   .attr('y', ycoord + 10)
                   .attr('font-size', 10)
                   .text(env.Rarr[s].toFixed(1.1));

                // value text
                grp.append('text')
                   .attr('x', xcoord + 3)
                   .attr('y', ycoord + cs - 5)
                   .attr('font-size', 10)
                   .text(V[s].toFixed(2));

                // this highlights where the (0, 0) point is: top left corner
                /* grp.append('circle')
                 *  .attr('cx', xcoord)
                 *  .attr('cy', ycoord)
                 *  .attr('fill', 'red')
                 *  .attr('r', 4);*/

                // policy arrows
                for (var a = 0; a < 4; a++) {
                    var pa = grp.append('line');

                    var prob = P[a * gs + s];
                    if (prob === 0) {
                        pa.attr('visibility', 'hidden');
                    } else {
                        pa.attr('visibility', 'visible');
                    }
                    var nx, ny;
                    /* var ss = cs / 2 * prob * 0.9;*/
                    var ss = cs / 6;
                    if (a === 0) {nx = -ss; ny = 0;}
                    if (a === 1) {nx = 0; ny = -ss;}
                    if (a === 2) {nx = 0; ny = ss;}
                    if (a === 3) {nx = ss; ny = 0;}

                    /* mapping are as below */
                    /* var actionMapping = {
                     *     0: '←',
                     *     1: '↑',
                     *     2: '↓',
                     *     3: '→'
                     * };*/

                    pa.attr('x1', xcoord + cs / 2)
                      .attr('y1', ycoord + cs / 2)
                      .attr('x2', xcoord + cs / 2 + nx)
                      .attr('y2', ycoord + cs / 2 + ny)
                      .attr('stroke', 'black')
                      .attr('stroke-width', '1')
                      .attr("marker-end", "url(#arrowhead)");
                }
            }
        }
    }

    render () {
        var el = ReactFauxDOM.createElement('div');
        el.setAttribute("style", "width: 100%; height: 100%");

        this.initGrid(el, this.props.agent);
        return el.toReact();
    }
}


export default Grid;
