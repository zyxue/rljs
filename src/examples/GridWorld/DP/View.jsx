import React, {Component, PropTypes} from 'react';
import {Row, Col, Button, ButtonToolbar} from 'react-bootstrap';


import Grid from './Grid.jsx';
import {DPAgent} from '../../../lib/Reinforce-js';
import Env from '../Env.js';

/* import Control from '../Base/Control.jsx';*/
import Line from '../Components/Plot/Line.jsx';

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
            selectedStateId: null,
            legCtrl: { // legends control
                stateId: true,
                stateCoord: false,
                reward: true,
                stateValue: true,
                policy: true
            }
        };
    }

    // DASHBOARD EVENTS HANDLERS
    updateEnv(attr, event) {
        let agent = this.state.agent;
        console.debug('updated ' + attr + ' to ' + event.target.value);
        // data type is an issue!
        agent.env[attr] = Number(event.target.value);
        // resetting is important, don't forget! it resets all states.
        agent.env.reset();
        agent.reset();
        this.setState({agent: agent});
    }

    hdlAgentBtnClick(action) {
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
            case 'reset':
                this.state.agent.reset();
                break;
            default:
                console.log('action unspecified or unrecognized: ', action);
        }
        this.setState({agent: this.state.agent});
    }

    isLearning() {
        // check if learning is already going on
        return this.state.intervalId === undefined? false : true;
    }

    startLearning(key) {
        const actingRate = 25;
        let intervalId = setInterval (() => {
            let isStable = true;
            if (key === 'polIter') {
                isStable = this.state.agent.iteratePolicy();
            } else if (key === 'valIter') {
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

    hdlCellBtnClick(key) {
        const env = this.state.env;
        const st = env.states[this.state.selectedStateId];
        switch(key) {
            case 'startingState':
                this.setSelStateAsStartingState(st, env);
                break;
            case 'terminalState':
                this.setSelStateAsTerminalState(st, env);
                break;
            case 'cliff':
                this.setSelStateAsCliff(st, env);
                break;
            default:
                console.error('unrecognized key: ', key);
        }
        this.setState({env: env});
    }

    setSelStateAsStartingState(st, env) {
        st.isCliff = false;
        env.startingStateId = st.id;
    }

    setSelStateAsTerminalState(st, env) {
        env.getTerminalState().reward = 0;
        st.isCliff = false;
        env.terminalStateId = st.id;
        env.getTerminalState().reward = 1;
    }

    setSelStateAsCliff(st, env) {
        if (st.id !== env.getStartingState().id && st.id !== env.getTerminalState().id)
            st.isCliff = !st.isCliff;
    }

    hdlCellRewardAdjustment(event) {
        event.preventDefault();
        console.debug(event.target.value);
        const env = this.state.env;
        const st = env.states[this.state.selectedStateId];
        st.reward = parseFloat(event.target.value);
        this.setState({selectedState: st});
    }

    toggleLegend(key) {
        let legCtrl = this.state.legCtrl;
        legCtrl[key] = !legCtrl[key];
        this.setState({legCtrl: legCtrl});
    }

    // GRID EVENTS HANDLERS
    hdlCellClick(stateId) {
        this.selectedStateId = stateId;
        if (this.state.selectedStateId !== null) {
            if (stateId === this.state.selectedStateId) {
                this.setState({selectedStateId: null});
                return;
            }
        }
        this.setState({selectedStateId: stateId});
    }

    render() {
        return (
            <div>
                <Row className="dashboard">
                    <Dashboard agent={this.state.agent}
                               hdlAgentBtnClick={this.hdlAgentBtnClick.bind(this)}
                               updateEnv={this.updateEnv.bind(this)}
                               selectedStateId={this.state.selectedStateId}
                               hdlCellBtnClick={this.hdlCellBtnClick.bind(this)}
                               hdlCellRewardAdjustment={this.hdlCellRewardAdjustment.bind(this)}
                               legendsCtrl={this.state.legCtrl}
                               toggleLegend={this.toggleLegend.bind(this)}
                    />
                </Row>

                <hr/>

                <Row>
                    <Col className='grid'  xs={12} md={8} >
                        <Grid height={600}
                              width={700}
                              id="grid-TD-control"
                              agent={this.state.agent}
                              selectedStateId={this.state.selectedStateId}
                              handleCellClick={this.hdlCellClick.bind(this)}
                              legendsCtrl={this.state.legCtrl}
                        />
                    </Col>
                    <Col className='plots' xs={12} md={4} >
                        <Line
                            height={150}
                            width={300}
                            margin={{top:0, left: 40, bottom:30}}
                            id={'policy-iteration-delta'}
                            data={this.state.agent.deltasPolIter}
                            xlabel={'# sweeps'}
                            ylabel={'pol iter delta'}
                        />


                        <Line
                            height={150}
                            width={300}
                            margin={{top:0, left: 40, bottom:30}}
                            id={'value-iteration-delta'}
                            data={this.state.agent.deltasValIter}
                            xlabel={'# sweeps'}
                            ylabel={'val iter delta'}
                        />
                    </Col>
                </Row>





            <p><strong>Policy itertion</strong> is basically iterative actions of evaluating policy and updating policy till the policy converges.</p>
            <p><strong>Value  itertion</strong> is basically continuous update of value functions till convergene, the one step of policy update will result in the optimal policy</p>
            <p>In general, value itertion is much slower that policy iteration. In other words, policy converges much faster than value functions. In the case of gridword, the former takes over 100 iteration while the later takes less than 10.</p>

            </div>
        );

        /* legendsCtrl={this.state.legendsCtrl}
         * selectedState={this.state.selectedState}
         * setSelectedStateId={this.setSelectedStateId.bind(this)}*/

    }
}


export default View;
