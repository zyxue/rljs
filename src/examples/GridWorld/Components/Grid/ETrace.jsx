import React, { Component, PropTypes } from 'react';


class ETrace extends Component {
    calcXY(coords) {
        let cx = coords.xmid;
        let cy = coords.ymid;

        return [cx, cy];
    }


    render() {
        const {coords, zVal} = this.props;
        const [cx, cy] = this.calcXY(coords);
        return (
            <circle cx={cx} cy={cy}
                    r={Math.log(zVal * 1000 + 1)}
                    fill="#FF0"
                    fillOpacity="1"
                    stroke="#000"
                    id="cpos">
            </circle>
        );
    }
}


const pt = {};
['xmin', 'ymin', 'xmid', 'ymid', 'xmax', 'ymax'].forEach((key) => {
    pt[key] = PropTypes.number.isRequired;
});

ETrace.propTypes = {
    coords: PropTypes.shape(pt),
    // just left here for reference, the above is equivalent
    /* coords: PropTypes.shape({
     *     xmin: PropTypes.number.isRequired,
     *     ymin: PropTypes.number.isRequired,
     *     xmid: PropTypes.number.isRequired,
     *     ymid: PropTypes.number.isRequired,
     *     xmax: PropTypes.number.isRequired,
     *     ymax: PropTypes.number.isRequired
     * }),*/
    zVal: PropTypes.number
};


export default ETrace;
