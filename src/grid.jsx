import React from 'react';
import ReactDOM from 'react-dom';

import * as d3 from 'd3';

import Faux from 'react-faux-dom';

import GridWorld from './GridWorld.js';


const Grid = React.createClass({
    mixins: [
        Faux.mixins.core,
        Faux.mixins.anim
    ],

    getInitialState () {
        return {
            chart: 'loading...',
        };
    },
    
    /* drawGrid (faux, agent, env) {
     *     var gh = env.gh; // height in cells
     *     var gw = env.gw; // width in cells
     *     var gs = env.gs; // total number of cells
     *     let cs = 60;

     *     // updates the grid with current state of world/agent
     *     for (var y = 0; y < gh; y++) {
     *         for (var x = 0; x < gw; x++) {
     *             var xcoord = x * cs;
     *             var ycoord = y * cs;
     *             var r = 255,
     *                 g = 255,
     *                 b = 255;
     *             var s = env.xytos(x, y);
     *             
     *             var vv = agent.V[s];
     *             var ms = 100;
     *             if (vv > 0) {
     *                 g = 255;
     *                 r = 255 - vv * ms;
     *                 b = 255 - vv * ms;
     *             }
     *             if (vv < 0) {
     *                 g = 255 + vv * ms;
     *                 r = 255;
     *                 b = 255 + vv * ms;
     *             }
     *             var vcol = 'rgb(' + Math.floor(r) + ',' + Math.floor(g) + ',' + Math.floor(b) + ')';
     *             if (env.T[s] === 1) {
     *                 vcol = "#AAA";
     *                 rcol = "#AAA";
     *             }
     *             
     *             // update colors of rectangles based on value
     *             var r = rs[s];
     *             if (s === selected) {
     *                 // highlight selected cell
     *                 r.attr('fill', '#FF0');
     *             } else {
     *                 r.attr('fill', vcol);
     *             }
     *             
     *             // write reward texts
     *             var rv = env.Rarr[s];
     *             var tr = trs[s];
     *             if (rv !== 0) {
     *                 tr.text('R ' + rv.toFixed(1))
     *             }
     *             
     *             // skip rest for cliff
     *             if (env.T[s] === 1) continue;
     *             
     *             // write value
     *             var tv = tvs[s];
     *             tv.text(agent.V[s].toFixed(2));
     *             
     *             // update policy arrows
     *             var paa = pas[s];
     *             for (var a = 0; a < 4; a++) {
     *                 var pa = paa[a];
     *                 var prob = agent.P[a * gs + s];
     *                 if (prob === 0) {
     *                     pa.attr('visibility', 'hidden');
     *                 } else {
     *                     pa.attr('visibility', 'visible');
     *                 }
     *                 var ss = cs / 2 * prob * 0.9;
     *                 if (a === 0) {
     *                     nx = -ss;
     *                     ny = 0;
     *                 }
     *                 if (a === 1) {
     *                     nx = 0;
     *                     ny = -ss;
     *                 }
     *                 if (a === 2) {
     *                     nx = 0;
     *                     ny = ss;
     *                 }
     *                 if (a === 3) {
     *                     nx = ss;
     *                     ny = 0;
     *                 }
     *                 pa.attr('x1', xcoord + cs / 2)
     *                   .attr('y1', ycoord + cs / 2)
     *                   .attr('x2', xcoord + cs / 2 + nx)
     *                   .attr('y2', ycoord + cs / 2 + ny);
     *             }
     *         }
     *     }
     * },
     */

    initGrid (faux, env) {
        let d3elt = d3.select(faux);

        /* d3elt.append('div').html('');*/

        /* rs: rewards of the state
           trs: text for the reward of the state
           tvs: text for the value of the state
           pas: policy arrows*/
        let rs = {},
            trs = {},
            tvs = {},
            pas = {};
        let cs = 60; /* cell size */

        var gh = env.gh; // height in cells
        var gw = env.gw; // width in cells
        var gs = env.gs; // total number of cells

        let w = 600;
        let h = 600;
        let svg = d3elt.append('svg')
                       .attr('width', w)
                       .attr('height', h)
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
                var s = env.xytos(x, y);

                var g = svg.append('g');
                // click callbackfor group
                g.on('click', function(ss) {
                    /* return function() { cellClicked(ss); } // close over s*/
                }(s));

                // set up cell rectangles
                var r = g.append('rect')
                         .attr('x', xcoord)
                         .attr('y', ycoord)
                         .attr('height', cs)
                         .attr('width', cs)
                         .attr('fill', '#FFF')
                         .attr('stroke', 'black')
                         .attr('stroke-width', 2);
                rs[s] = r;

                // reward text
                var tr = g.append('text')
                          .attr('x', xcoord + 3)
                          .attr('y', ycoord + 10)
                          .attr('font-size', 10)
                          .text('r');
                trs[s] = tr;

                // skip rest for cliffs
                if (env.T[s] === 1) {
                    continue;
                }

                // value text
                var tv = g.append('text')
                          .attr('x', xcoord + 3)
                          .attr('y', ycoord + cs - 5)
                          .attr('font-size', 10)
                          .text('v');
                tvs[s] = tv;

                console.log(xcoord, ycoord);

                // this highlights where the (0, 0) point is: top left corner
                /* g.append('circle')
                 *  .attr('cx', xcoord)
                 *  .attr('cy', ycoord)
                 *  .attr('fill', 'red')
                 *  .attr('r', 4);*/

                // policy arrows
                pas[s] = [];
                for (var a = 0; a < 4; a++) {
                    /* pa.attr('x1', xcoord + cs / 2)
                     *   .attr('y1', ycoord + cs / 2)
                     *   .attr('x2', xcoord + cs / 2 + nx)
                     *   .attr('y2', ycoord + cs / 2 + ny);*/

                    var pa = g.append('line')
                              .attr('x1', xcoord + cs / 2)
                              .attr('y1', ycoord + cs / 2)
                              .attr('x2', xcoord + cs / 2)
                              .attr('y2', ycoord + cs / 2)
                              .attr('stroke', 'black')
                              .attr('stroke-width', '1')
                              .attr("marker-end", "url(#arrowhead)");
                    pas[s].push(pa);
                    /* console.log(pas);*/
                }
            }
        }
    },

    componentDidMount () {
        const faux = this.connectFauxDOM('div.renderedD3', 'chart');
        let env = this.props.agent.env;
        this.initGrid(faux, env);

        this.animateFauxDOM(800);
    },

    render () {
        return (
            <div>
                <h2>Here is some fancy data:</h2>
                <div className='renderedD3'>
                    {this.state.chart}
                </div>
            </div>
        );
    }
});


export default Grid;
