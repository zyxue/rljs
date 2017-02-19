import React, { Component, PropTypes } from 'react';

/* not sure why fill="blue doesn't work" */

/* 
 * class StartingState extends Component {
 *     propTypes: {
 *         xmin: PropTypes.number,
 *         ymin: PropTypes.number,
 *         xmax: PropTypes.number,
 *         ymax: PropTypes.number
 *     }
 * 
 *     render () {
 *         const {xmin, ymin, xmax, ymax} = this.props.coords;
 *         const d = "M" + xmin + ',' + ymin +
 *                   "L" + xmax + ',' + ymin +
 *                   "L" + xmax + ',' + ymax +
 *                   "L" + xmin + ',' + ymax +
 *                   "L" + xmin + ',' + ymin;
 * 
 *         console.debug(d);
 *         return  (
 *             <path d={d}
 *                   stroke="black"
 *                   strokeWidth={2}
 *                   fill="blue"
 *                   fillOpacity={1}>
 *             </path>
 *         );
 *     }
 * }
 * 
 * */

class StartingState extends Component {
    // static seems a es7 feature, too new
    /* static propTypes = {
     *     coords: React.PropTypes.shape({
     *         xmin: PropTypes.number,
     *         ymin: PropTypes.number,
     *         xmid: PropTypes.number,
     *         ymid: PropTypes.number,
     *         xmax: PropTypes.number,
     *         ymax: PropTypes.number
     *     })
     * }*/

    render() {
        const {xmin, ymin, xmax, ymax} = this.props.coords;
        const x = xmin;
        const y = ymin;
        const height = ymax - ymin;
        const width = xmax - xmin;
        return (
            <rect x={x} y={y}
                  height={height} width={width}
                  stroke="black"
                  strokeWidth="0.1"
                  fill="blue"
                  fillOpacity="0.5"
            >
            </rect>
        );
    }
}

StartingState.propTypes = {
    coords: React.PropTypes.shape({
        xmin: PropTypes.number,
        ymin: PropTypes.number,
        xmid: PropTypes.number,
        ymid: PropTypes.number,
        xmax: PropTypes.number,
        ymax: PropTypes.number
    })
};

export default StartingState;
