import React from 'react';


class Trace extends React.Component {
    calcXY(coords, action) {
        const {xmin, ymin,  xmid, ymid, xmax, ymax} = coords;
        const C = 1 / 3;
        let cx, cy;
        if (action === 'left') {
            cx = (1 - C) * xmin + C * xmid;
            cy = ymid;
        } else if (action === 'up') {
            cx = xmid;
            cy = (1 - C) * ymin + C * ymid;
        } else if (action === 'right') {
            cx = C * xmid + (1 - C) * xmax;
            cy = ymid;
        } else if (action === 'down') {
            cx = xmid;
            cy = C * ymid + (1 - C) * ymax;
        }
        return [cx, cy];
    }


    render() {
        const {coords, action, zVal} = this.props;
        const [cx, cy] = this.calcXY(coords, action);
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
    pt[key] = React.PropTypes.number.isRequired;
});

Trace.propTypes = {
    coords: React.PropTypes.shape(pt)
};

export default Trace;
