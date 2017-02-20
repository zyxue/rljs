import React, { Component, PropTypes } from 'react';

import QTxt from './QTxt.jsx';
import Trace from './Trace.jsx';
import {genRGBColorString} from '../Base/Grid/gridUtils.js';


class QTriangle extends Component {
    genQPointsStr(coords, action) {
        let {xmin, ymin, xmid, ymid, xmax, ymax} = coords;

        // given an action, it generate the 3 points needed to form a triagle
        let str;
        if (action === 'left') {
            str = xmin + ',' + ymin + ' ' +
                  xmin + ',' + ymax + ' ' +
                  xmid + ',' + ymid;

        } else if (action === 'up') {
            str = xmin + ',' + ymin + ' ' +
                  xmax + ',' + ymin + ' ' +
                  xmid + ',' + ymid;

        } else if (action === 'right') {
            str = xmax + ',' + ymin + ' ' +
                  xmax + ',' + ymax + ' ' +
                  xmid + ',' + ymid;

        } else if (action === 'down') {
            str = xmin + ',' + ymax + ' ' +
                  xmax + ',' + ymax + ' ' +
                  xmid + ',' + ymid;
        }
        return str;
    }

    render () {
        const {coords, action, qVal, zVal, legCtrl} = this.props;

        const pointsStr = this.genQPointsStr(coords, action);
        const color = genRGBColorString(qVal);

        return  (
            <g>
                <polygon points={pointsStr}
                         fill={color}
                         fillOpacity={0.5}
                         stroke={"black"}
                         strokeWidth={0.3}>
                </polygon>
            {legCtrl.qValue ? <QTxt coords={coords} action={action} qVal={qVal}></QTxt> : null}
            {legCtrl.etrace ? <Trace coords={coords} action={action} zVal={zVal}></Trace> : null}
            </g>
        );
    }
}


QTriangle.propTypes =  {
    coords: React.PropTypes.shape({
        xmin: PropTypes.number,
        ymin: PropTypes.number,
        xmid: PropTypes.number,
        ymid: PropTypes.number,
        xmax: PropTypes.number,
        ymax: PropTypes.number
    }).isRequired
};


export default QTriangle;
