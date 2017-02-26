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
    

    isLearning() {
        // check if learning is already going on
        return this.state.intervalId === undefined? false : true;
    }

    startLearning(key) {
        const actingRate = 25;
        let intervalId = setInterval (() => {
            let isStable = true;
            if (key == 'polIter') {
                isStable = this.state.agent.iteratePolicy();
            } else if (key == 'valIter') {
                isStable = this.state.agent.iterateValue();
            } else {
                console.error('unknown learning method: ' + key);
            }
            if (isStable) this.stopLearning();
            this.setState({agent: this.state.agent});
        }, actingRate);
        this.setState({intervalId: intervalId});
    }

    stopLearning() {
        if (this.isLearning()) {
            clearInterval(this.state.intervalId);
            this.setState({intervalId: undefined});
        }
    }

    toggleLearning(key) {
        if (this.isLearning()) {
            this.stopLearning(key);
        } else {
            this.startLearning(key);
        }
    }

    handleClick(action) {
        switch(action) {
            case 'evaluatePolicy':
                this.state.agent.evaluatePolicy();
                break;
            case 'updatePolicy':
                this.state.agent.updatePolicy();
                break;
            case 'togglePolIter':
                this.toggleLearning('polIter');
                break;
            case 'toggleValIter':
                this.toggleLearning('valIter');
                break;
            default:
                console.log('action unspecified or unrecognized: ', action);
        }
        this.setState({agent: this.state.agent});
    }

    render() {
        return (
            <div>
                <div># policy iterations: {this.state.agent.numPolicyIterations}</div>
                <div># value iterations: {this.state.agent.numValueIterations}</div>
                <ButtonToolbar>
                    <Button bsStyle='primary' onClick={this.handleClick.bind(this, 'evaluatePolicy')}>Evaluate policy</Button>
                    <Button bsStyle='primary' onClick={this.handleClick.bind(this, 'updatePolicy')}>Update policy</Button>
                    <Button bsStyle='primary' onClick={this.handleClick.bind(this, 'togglePolIter')}>Toggle policy iteration</Button>
                    <Button bsStyle='primary' onClick={this.handleClick.bind(this, 'toggleValIter')}>Toggle value iteration</Button>
                    <Button bsStyle='primary' onClick={this.handleClick.bind(this, 'reset')}>Reset</Button>
                </ButtonToolbar>

                <hr/>
                <Grid height={600}
                      width={700}
                      id="grid-TD-control"
                      agent={this.state.agent}
                      handleCellClick={this.updateSelectedStateId}
                />

            <p>Policy itertion is basically iterative actions of evaluating policy and updating policy till the policy converges.</p>

            </div>
        );

        /* legendsCtrl={this.state.legendsCtrl}
         * selectedState={this.state.selectedState}
         * updateSelectedStateId={this.updateSelectedStateId.bind(this)}*/

    }
}


export default View;
