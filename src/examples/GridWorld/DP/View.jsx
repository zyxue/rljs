import React, {Component, PropTypes} from 'react';
import {Row, Col, Button, ButtonToolbar} from 'react-bootstrap';


import Grid from './Grid.jsx';
import {DPAgent} from '../../../lib/Reinforce-js';
import Env from '../Env.js';

/* import Control from '../Base/Control.jsx';*/
/* import Line from '../Base/Line.jsx';*/

import Dashboard from './Dashboard.jsx';


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

    /* handleClick(action, event) {
     *     if (action === 'evalPolicy') {this.state.agent.evaluatePolicy();}
     *     else if (action === 'updatePolicy') {this.state.agent.updatePolicy();}
     *     else if (action === 'reset') {this.state.agent.reset();}
     *     else {this.state.agent.learn();}

     *     this.setState({agent: this.state.agent});
     * }*/
    
    handleClick(action) {
        switch(action) {
            case 'evaluatePolicy':
                this.state.agent.evaluatePolicy();
                break;
            case 'updatePolicy':
                this.state.agent.updatePolicy();
                break;
            default:
                console.log('action unspecified or unrecognized: ', action);
        }
        this.setState({agent: this.state.agent});
    }

    render() {
        return (
            <div>
                <ButtonToolbar>
                    <Button bsStyle='primary' onClick={this.handleClick.bind(this, 'evaluatePolicy')}>Evaluate Policy</Button>
                    <Button bsStyle='primary' onClick={this.handleClick.bind(this, 'updatePolicy')}>Update Policy</Button>
                    <Button bsStyle='primary' onClick={this.handleClick.bind(this, 'learn')}>Learn</Button>
                    <Button bsStyle='primary' onClick={this.handleClick.bind(this, 'reset')}>Reset</Button>
                </ButtonToolbar>

                <hr/>
                <Grid height={600}
                      width={700}
                      id="grid-TD-control"
                      agent={this.state.agent}
                      handleCellClick={this.updateSelectedStateId}
                />
            </div>
        );

        /* legendsCtrl={this.state.legendsCtrl}
         * selectedState={this.state.selectedState}
         * updateSelectedStateId={this.updateSelectedStateId.bind(this)}*/

    }
}


export default View;
