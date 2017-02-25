import React, {Component, PropTypes} from 'react';
import {Row, Col} from 'react-bootstrap';


import Grid from './Grid.jsx';
import {DPAgent} from '../../../lib/Reinforce-js';
import Env from '../Env.js';

/* import Control from '../Base/Control.jsx';*/
/* import Line from '../Base/Line.jsx';*/

/* import Dashboard from './Dashboard/Dashboard.jsx';*/


class View extends Component {
    constructor() {
        super();
        this.allowedDimensions = [3, 4, 5, 6, 7, 8, 9, 10];
        let env = new Env();
        let agent = new DPAgent(env);

        this.state = {
            agent: agent,
            env: env,

            /* selectedStateId: null,

             * legendsCtrl: {
             *     qValue: false,
             *     stateId: true,
             *     stateCoord: false,
             *     reward: true,
             *     policy: false, // show policy as arrows
             *     etrace: true
             * }*/
        };
    }

    updateSelectedStateId(stateId) {
        console.log('abc: ' + stateId);
        /* if (this.state.selectedStateId !== null) {
         *     if (stateId === this.state.selectedStateId) {
         *         this.setState({selectedStateId: null});
         *         return;
         *     }
         * }
         * this.setState({selectedStateId: stateId});*/
    }

    render() {
        return (
            <Grid
                height={600}
                width={700}
                id="grid-TD-control"
                agent={this.state.agent}
                handleCellClick={this.updateSelectedStateId}
            />
        );

        /* legendsCtrl={this.state.legendsCtrl}
         * selectedState={this.state.selectedState}
         * updateSelectedStateId={this.updateSelectedStateId.bind(this)}*/

    }
}


export default View;
