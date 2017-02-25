import React, {Component, PropTypes} from 'react';
import {Row, Col} from 'react-bootstrap';

/* import {TDAgent} from '../../../lib/Reinforce-js';*/

import Env from '../Env.js';
/* import Control from '../Base/Control.jsx';*/
/* import Line from '../Base/Line.jsx';*/

/* import Dashboard from './Dashboard/Dashboard.jsx';*/


class View extends Component {
    render() {
        return (
            <div>lele</div>
        );
    }

    /* constructor() {
     *     super();
     *     this.allowedDimensions = [3, 4, 5, 6, 7, 8, 9, 10];
     *     let env = new Env();
     *     let agent = new TDAgent(env);

     *     this.state = {
     *         agent: agent,
     *         env: env,
     *         selectedStateId: null,

     *         legendsCtrl: {
     *             qValue: false,
     *             stateId: true,
     *             stateCoord: false,
     *             reward: true,
     *             policy: false, // show policy as arrows
     *             etrace: true
     *         }
     *     };
     * }*/

}


export default View;
