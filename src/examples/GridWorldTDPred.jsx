import React from 'react';
import {Col, Button, ButtonToolbar} from 'react-bootstrap';

import {TDPredAgent} from '../lib/Reinforce-js';

import GridWorldEnv from './GridWorldTDPred/GridWorldEnv';
import Grid from './GridWorldTDPred/Grid';
import Line from './GridWorldTDPred/Line';


class GridWorldTD extends React.Component {
    constructor() {
        super();
        this.allowedDimensions = [3, 4, 5, 6, 7, 8, 9, 10];
        let env = new GridWorldEnv();
        let agent = new TDPredAgent(env);

        this.state = {
            env: env,
            agent: agent,
            /* the interval between consecutive actions taken by action in
            number of microseconds*/
            actingRate: 100,

            selectedState: null,

            showLegend: {
                stateValue: false,
                stateId: true,
                stateCoord: false,
                reward: true,
                etrace: true
            }
        };
    }

    toggleLegend(key, event) {
        let showLegend = this.state.showLegend;
        showLegend[key] = !showLegend[key];
        this.setState(showLegend: showLegend);
    }

    updateEnv(key, event) {
        // to avoid Do not mutate state directly. Use setState() warning
        let env = this.state.env;
        env[key] = event.target.value;
        env.reset();        // resetting is important, don't forget!
        this.setState({env: env});
    }

    updateAgent(key, event) {
        let agent = this.state.agent;
        agent[key] = event.target.value;
        this.setState({agent: agent});
    }

    updateActingRate(event) {
        let newActingRate = event.target.value;
        this.setState({actingRate: newActingRate});

        this.stopConsecutiveActions();
        this.startConsecutiveActions(newActingRate);
    }

    startConsecutiveActions(actingRate) {
        let ar = actingRate === undefined? this.state.actingRate: actingRate;
        console.debug(ar);
        let intervalId = setInterval (() => {
            this.state.agent.act();
            this.setState({agent: this.state.agent});
        }, ar);
        this.setState({intervalId: intervalId});
    }

    stopConsecutiveActions() {
        if (this.inConsecutiveActions()) {
            clearInterval(this.state.intervalId);
            this.setState({intervalId: undefined});
        }
    }

    inConsecutiveActions() {
        /* check if consecutive action mode is on */
        return this.state.intervalId === undefined? false : true;
    }

    toggleConsecutiveActions() {
        /* console.debug(this.state.intervalId);*/
        if (this.inConsecutiveActions()) {
            this.stopConsecutiveActions();
        } else {
            this.startConsecutiveActions();
        }
    }

    updateSelectedState(state) {
        if (this.state.selectedState !== null) {
            if (state.id === this.state.selectedState.id) {
                this.setState({selectedState: null});
                return
            }
        }

        this.setState({selectedState: state});
    }

    handleClick(action, event) {
        if (action === 'act') {
            this.state.agent.act();
        } else if (action === 'toggle') {
            this.toggleConsecutiveActions();
        } else if (action === 'learn') {
            this.state.agent.learnFromBatchEpisodes();
        } else if (action === 'reset') {
            this.state.agent.reset();
        }
        this.setState({agent: this.state.agent});
    }

    agentStatus() {
        return (
            <p className="text-center">
                <strong>Agent status: </strong><span>γ = </span><span className="text-primary">{this.state.agent.gamma}</span>; <span>ε = </span><span className="text-primary">{this.state.agent.epsilon}</span>; <span>α = </span><span className="text-primary">{this.state.agent.alpha}</span>; <span>λ = </span><span className="text-primary">{this.state.agent.lambda}</span>; <span># Ep. experienced: </span><span className="text-primary">{this.state.agent.numEpisodesExperienced}</span>
            </p>
        )
    }

    grid() {
        return (
            <Grid
                height={600}
                width={700}
                id="TD-grid"
                agent={this.state.agent}
                env={this.state.env}
                showLegend={this.state.showLegend}
                selectedState={this.state.selectedState}
                updateSelectedState={this.updateSelectedState.bind(this)}
            />
        )
    }

    instruction() {
        return (
            <ul>
                <li>The agent always starts at initial state, and then try to navigate to the goal state. At each state, the agent has 4 actions. If it hits the walls or edges, it will stay put.</li>
                <li>Arrows show the direction of greedy action, when the policy converges, it should lead directly to the goal state, which is also reflected by the green color of triangle</li>
                <li>Try toggle after learned from a few hundreds of episode and see how eligbility trace changes. Also play with λ, and see how it affects the trace. The x axis of trace is the number of states times that of actions. </li>
                <li>Gridworld is deterministic! </li>
                <li>Trace-decay parameter (λ)</li>
                <li>When epsilon = 0, it's greedy policy, NO exploration</li>
                <li>When epsilon = 1, it's random policy.</li>
            </ul>
        )
    }

    episodicEtrace() {
        let state = this.state.selectedState !== null? this.state.selectedState : this.state.env.states[0];
        return (
            <Line
                height={150}
                width={300}
                margin={{top:30, left: 40, bottom: 30}}
                id={'episodic-etrace-history'}
                data={state.epiHistZ}
            title={'Episodic etrace history (Z) at State ' + state.id}
            xlabel={'Time'}
            ylabel={'Z'}
            />
        );
    }

    render() {
        return (
            <div className="GridWorldTD">
            <Col className='grid' xs={12} md={8}>
                {this.agentStatus()}
                {this.grid()}
                {this.instruction()}
                </Col>

                <Col xs={12} md={4}>
                    <div className="row">
                        <Line
                            height={150}
                            width={300}
                            margin={{top:30, left: 40, bottom:30}}
                            id={'TD-num-steps-per-episode'}
                            data={this.state.agent.numStepsPerEpisode}
                            xlabel={'Episode count'}
                            ylabel={'# steps'}
                        />
                    </div>

                    <div className="row">
                        {this.episodicEtrace()}
                    </div>

                   <div className="row">
                        <Line
                            height={150}
                            width={300}
                            margin={{top:30, left: 40, bottom: 30}}
                            id={'TD-etrace'}
                            data={this.state.env.states.map((st) => (st.Z))}
                            title={'Serial view of eligibility trace (Z)'}
                            xlabel={'State'}
                            ylabel={'Z'}
                        />
                   </div>

                    <div className="row">
                        <Col md={3}># rows =</Col>
                        <Col md={3}>
                            <select value={this.state.env.numRows} onChange={this.updateEnv.bind(this, 'numRows')}>
                                {
                                    this.allowedDimensions.map(function (e, i, a) {
                                        return <option key={e + 'rows'}value={e}>{e}</option>
                                    })
                                }
                            </select>
                        </Col>

                        <Col md={3}># cols =</Col>
                        <Col md={3}>
                            <select value={this.state.env.numCols} onChange={this.updateEnv.bind(this, 'numCols')}>
                                {
                                    this.allowedDimensions.map(function (e, i, a) {
                                        return <option key={e + 'cols'} value={e}>{e}</option>
                                    })
                                }
                            </select>
                        </Col>

                        <Col md={5}>Learning algorithm:</Col>
                        <Col md={7}>
                            <select value={this.state.learningAlgo} onChange={this.updateAgent.bind(this, 'learningAlgo')}>
                                <option value="sarsa">SARSA(λ)</option>
                                <option value="qlearning">Q(λ) (Watkins's)</option>
                            </select>
                        </Col>

                        <Col md={2}>γ =</Col>
                        <Col md={4}>
                            <input type="text" value={this.state.agent.gamma} size="10"
                                   onChange={this.updateAgent.bind(this, 'gamma')} />
                        </Col>

                        <Col md={2}>ε =</Col>
                        <Col md={4}>
                            <input type="text" value={this.state.agent.epsilon} size="10"
                                   onChange={this.updateAgent.bind(this, 'epsilon')} />
                        </Col>

                        <Col md={2}>α =</Col>
                        <Col md={4}>
                            <input type="text" value={this.state.agent.alpha} size="10"
                                   onChange={this.updateAgent.bind(this, 'alpha')} />
                        </Col>

                        <Col md={2}>λ =</Col>
                        <Col md={4}>
                            <input type="text" value={this.state.agent.lambda} size="10"
                                   onChange={this.updateAgent.bind(this, 'lambda')} />
                        </Col>

                        <Col md={5}>batch size = </Col>
                        <Col md={7}>
                            <input type="text" value={this.state.agent.batchSize} size="10"
                            onChange={this.updateAgent.bind(this, 'batchSize')} />
                        </Col>

                        <Col md={5}>acting rate: =</Col>
                        <Col md={7}>
                            <input type="text" value={this.state.actingRate} size="10"
                                   onChange={this.updateActingRate.bind(this)} />
                        </Col>
                    </div>


                    <ButtonToolbar>
                        <Button bsStyle='primary' onClick={this.handleClick.bind(this, 'act')}>Act</Button>
                        <Button bsStyle='primary' onClick={this.handleClick.bind(this, 'toggle')}>Toggle</Button>
                        <Button bsStyle='primary' onClick={this.handleClick.bind(this, 'learn')}>Learn</Button>
                        <Button bsStyle='primary' onClick={this.handleClick.bind(this, 'reset')}>Reset</Button>
                    </ButtonToolbar>

                    <h4>Instruction:</h4>
                    <ul>
                        <li>Act: take one action</li>
                        <li>Toggle: Take actions continously indefinitely</li>
                        <li>Learn: Learn from {this.state.batchSize} episodes</li>
                    </ul>

                    <h4>Toggle legends:</h4>
                    <ul>
                        <li><a className="toggle-button" onClick={this.toggleLegend.bind(this, 'stateValue')}>State values</a></li>
                        <li><a className="toggle-button" onClick={this.toggleLegend.bind(this, 'stateId')}>State ID</a></li>
                        <li><a className="toggle-button" onClick={this.toggleLegend.bind(this, 'stateCoord')}>State coordinates</a></li>
                        <li><a className="toggle-button" onClick={this.toggleLegend.bind(this, 'reward')}>Rewards</a></li>
                        <li><a className="toggle-button" onClick={this.toggleLegend.bind(this, 'etrace')}>Eligibility trace</a></li>
                    </ul>

                    <p>Try hit learn button if you don't see much going on.</p>
                    <p>Currently, only standard SARSA(λ) is implemented. Colors of each Q triangle reflect its learn values.</p>
                </Col>
            </div>
        );
    }
}


export default GridWorldTD;
