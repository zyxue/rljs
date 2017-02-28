import React, { Component, PropTypes } from 'react';


class Trace extends Component {
    calcXY(coords) {
        const {xmin, ymin,  xmid, ymid, xmax, ymax} = coords;

        let cx = xmid;
        let cy = ymid;

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


export default Trace;
