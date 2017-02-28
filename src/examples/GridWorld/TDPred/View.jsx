import React, {Component, PropTypes} from 'react';
import {Row, Col} from 'react-bootstrap';

import Env from '../Env.js';
import {TDPredAgent} from '../../../lib/Reinforce-js';

import View from '../DP/View.jsx';

import Dashboard from './Dashboard.jsx';
// use the same grid from DP since they are all for prediction only
import Grid from '../DP/Grid.jsx';
import Agent from '../Components/Grid/Agent.jsx';
import Line from '../Components/Plot/Line.jsx';


class TDPredView extends View {
    constructor() {
        super();
        let env = new Env();
        let agent = new TDPredAgent(env);

        this.state = {
            agent: agent,
            env: env,
            selectedStateId: null,
            // legends control
            legCtrl: {
                stateId: true,
                stateCoord: false,
                reward: true,
                stateValue: true,
                etrace: true
            }
        };
    }

    updateAgent(attr, event) {
        let agent = this.state.agent;
        console.debug('updated ' + attr + ' to ' + event.target.value);
        agent[attr] = event.target.value;
        this.setState({agent: agent});
    }

    startLearning(key) {
        const actingRate = 1;
        const A = this.state.agent;
        const intervalId = setInterval (() => {
            switch (key) {
                case 'tdLambda':
                    A.act();
                    break;
                default:
                    console.error('unrecognized key: ', key);
            }
            this.setState({agent: A});
        }, actingRate);
        this.setState({intervalId: intervalId});
    }

    hdlAgentBtnClick(action) {
        const A = this.state.agent;
        switch(action) {
            case 'takeOneStep':
                A.act();
                break;
            case 'learnFromOneEpisode':
                A.learnFromOneEpisode();
                break;
            case 'learnFromMultipleEpisodes':
                A.learnFromMultipleEpisodes();
                break;
            case 'toggleTDLambda':
                this.toggleLearning('tdLambda');
                break;
            case 'reset':
                A.reset();
                break;
            default:
                console.log('action unspecified or unrecognized: ', action);
        }
        this.setState({agent: A});
    }


    render() {
        return (
            <div>
                <Row className="dashboard">
                    <Dashboard agent={this.state.agent}
                               updateAgent={this.updateAgent.bind(this)}
                               hdlAgentBtnClick={this.hdlAgentBtnClick.bind(this)}
                               updateEnv={this.updateEnv.bind(this)}
                               selectedStateId={this.state.selectedStateId}
                               hdlCellBtnClick={this.hdlCellBtnClick.bind(this)}
                               hdlCellRewardAdjustment={this.hdlCellRewardAdjustment.bind(this)}
                               legendsCtrl={this.state.legCtrl}
                               toggleLegend={this.toggleLegend.bind(this)}
                    />
                </Row>

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
                        plots placeholder
                        {/* <Line
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
                            /> */}
                    </Col>
                </Row>

            <p>Evaluate a random policy π, i.e. taking a random action out of all allowed actions in each state</p>
            </div>
        );
    }
}


export default TDPredView;
