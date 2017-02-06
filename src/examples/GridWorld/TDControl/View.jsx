import React from 'react';
import {Row, Col} from 'react-bootstrap';

import {TDAgent} from '../../../lib/Reinforce-js';

import Env from '../Base/Env.js';
import Control from '../Base/Control.jsx';
import Line from '../Base/Line.jsx';

import Grid from './Grid.jsx';
import Dashboard from './Dashboard.jsx';



class EligibilityTracePlots extends React.Component {
    render() {
        let ACTION_MAP = {0: '←', 1: '↑', 2: '→', 3: '↓'};
        let st = this.props.selectedState;
        let plots = st.allowedActions.map((aid) => {
            let xlabel = aid === st.allowedActions[st.allowedActions.length - 1]? 'Step' : '';
            let key = "epiHistZ-state" + st.id + '-action-' + aid;
            return (
                <div key={key} className="row">
                <Line
                height={37.5}
                width={300}
                margin={{top:30, left: 40, bottom: 30}}
                id={key}
                data={st.epiHistZ[aid]}
                title={'Z at State ' + st.id + ', action: ' + ACTION_MAP[aid]}
                xlabel={xlabel}
                ylabel={'Z'}
                />
            </div>
            )

        });

        // console.debug(plots);
        return (
            <div>
                {plots}
            </div>
        );
    }
}


class Introduction extends React.Component {
    render() {
        return (
            <div>
                <h4>Instruction:</h4>
                <ul>
                    <li>Act: take one action</li>
                    <li>Toggle: Take actions continously indefinitely</li>
                    <li>Learn: Learn from a batch of episodes, where batch size is tunable</li>
                </ul>


                <ul>
                    <li>The agent always starts at initial state, and then try to navigate to the goal state. At each state, the agent has 4 actions. If it hits the walls or edges, it will stay put.</li>
                    <li>Arrows show the direction of greedy action, when the policy converges, it should lead directly to the goal state, which is also reflected by the green color of triangle</li>
                    <li>Try toggle after learned from a few hundreds of episode and see how eligbility trace changes. Also play with λ, and see how it affects the trace. The x axis of trace is the number of states times that of actions. </li>
                    <li>Gridworld is deterministic! </li>
                    <li>Trace-decay parameter (λ)</li>
                </ul>


                <p>Try hit learn button if you don't see much going on.</p>
                <p>Currently, only standard SARSA(λ) is implemented. Colors of each Q triangle reflect its learn values.</p>
                <p>Reward shown in the legend does not include per step penalty</p>
            </div>
        );
    }
}


class View extends Control {
    constructor() {
        super();
        this.allowedDimensions = [3, 4, 5, 6, 7, 8, 9, 10];
        let env = new Env();
        let agent = new TDAgent(env);

        this.state = {
            agent: agent,
            env: env,
            selectedState: null,

            legendsCtrl: {
                /* stateValue: false,
                 * stateId: true,
                 * stateCoord: false,
                 * reward: true,
                 * etrace: true*/

                qValue: true,
                stateId: true,
                stateCoord: true,
                reward: true,
                policy: true, // show policy as arrows
                etrace: true
            }
        };
    }

    render() {
        return (
            <div>
                <Row style={{border: 'red 0.5px solid'}}>
                    <div>
                        <Dashboard
                            agent={this.state.agent}
                            legendsCtrl={this.state.legendsCtrl}
                            selectedState={this.state.selectedState}

                            updateAgent={this.updateAgent.bind(this)}
                            updateEnv={this.updateEnv.bind(this)}
                            handleUserCtrlButtonClick={this.handleUserCtrlButtonClick.bind(this)}
                            toggleLegend={this.toggleLegend.bind(this)}
                            setSelectedStateAs={this.setSelectedStateAs.bind(this)}
                            adjustSelectedStateReward={this.adjustSelectedStateReward.bind(this)}
                        />
                    </div>
                </Row>
                
                <Row>
                    <Col className='grid' xs={12} md={8} style={{border: 'red 0.5px solid', height: '600px'}}>
                        {this.state.agent.gamma}
                        <Grid
                            height={600}
                            width={700}
                            id="grid-TD-control"
                            agent={this.state.agent}
                            legendsCtrl={this.state.legendsCtrl}
                            selectedState={this.state.selectedState}
                            updateSelectedState={this.updateSelectedState.bind(this)}
                        />
                    </Col>

                    <Col xs={12} md={4}>
                        <p> will put some plots here</p>

                        <div className="row">
                            <Line
                                height={150}
                                width={300}
                                margin={{top:30, left: 40, bottom:30}}
                                id={'TD-num-steps-per-episode'}
                                data={this.state.agent.numStepsPerEpisode}
                                xlabel={'# episodes'}
                                ylabel={'# steps'}
                            />
                        </div>

                        <EligibilityTracePlots selectedState={this.state.selectedState !== null? this.state.selectedState : this.state.env.states[0]}/>

                    </Col>
                </Row>

                <Row>
                    <div>
                        <Introduction />
                    </div>
                </Row>
            </div>
        );
    }
}


export default View;
