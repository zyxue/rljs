import React from 'react';
import {Col, Button, ButtonToolbar} from 'react-bootstrap';

import {TDAgent} from '../lib/Reinforce-js';

import GridWorldEnv from './GridWorldTDPred/GridWorldEnv';
import Grid from './GridWorldTDPred/Grid';
import Line from './GridWorldTDPred/Line';


class GridWorldTD extends React.Component {
    constructor() {
        super();
        this.allowedDimensions = [3, 4, 5, 6, 7];
        let env = new GridWorldEnv({numRows: this.allowedDimensions[0],
                                    numCols: this.allowedDimensions[1]});
        let agent = new TDAgent(env);

        this.state = {
            env: env,
            agent: agent,
            /* the interval between consecutive actions taken by action in
            number of microseconds*/
            actingRate: 1,

            showQTriangles: true,
            showQVals: true,
            showStateVals: false,
            showStateCoords: false,
            showRewardVals: false
        };
    }

    toggleQTriangles() {
        this.setState({showQTriangles: !this.state.showQTriangles});
    }

    toggleQVals() {
        this.setState({showQVals: !this.state.showQVals});
    }

    toggleStateVals() {
        this.setState({showStateVals: !this.state.showStateVals});
    }

    toggleStateCoords() {
        this.setState({showStateCoords: !this.state.showStateCoords});
    }

    toggleRewardVals() {
        this.setState({showRewardVals: !this.state.showRewardVals});
    }

    updateEnv(key, event) {
        console.log(key, event.target.value, event.target.value === '');
        // to avoid Do not mutate state directly. Use setState() warning
        let env = this.state.env;
        switch(key) {
            case 'numRows':
                env.numRows = event.target.value;
                break;
            case 'numCols':
                env.numCols = event.target.value;
                break
            default:
        }
        // resetting is important, don't forget!
        env.reset();
        this.setState({env: env});
    }

    updateAgent(key, event) {
        let agent = this.state.agent;
        switch(key) {
            case 'learningAlgo':
                agent.learningAlgo = event.target.value;
                break;
            case 'gamma':
                agent.gamma = event.target.value;
                break;
            case 'epsilon':
                agent.epsilon = event.target.value;
                break;
            case 'alpha':
                agent.alpha = event.target.value;
                break;
            case 'lambda':
                agent.lambda = event.target.value;
                break;
            case 'batchSize':
                agent.batchSize = event.target.value;
                break;
            default:
        }
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

    render() {
        return (
            <div className="GridWorldTD">
                <p> <strong>Agent status: </strong>
                    {this.state.agent.env.numRows}; &nbsp;
                    {this.state.agent.env.numCols}; &nbsp;
                    <span>γ = </span><span className="text-primary">{this.state.agent.gamma}</span>; &nbsp;
                    <span>ε = </span><span className="text-primary">{this.state.agent.epsilon}</span>; &nbsp;
                    <span>α = </span><span className="text-primary">{this.state.agent.alpha}</span>; &nbsp;
                    <span>λ = </span><span className="text-primary">{this.state.agent.lambda}</span>; &nbsp;
                    <span># Ep. experienced: </span><span className="text-primary">{this.state.agent.numEpisodesExperienced}</span>;
                </p>

                <Col className='grid' xs={12} md={8} style={{border: 'red 0.5px solid', height: '600px'}}>
                    <Grid
                        height={600}
                        width={700}
                        id="TD-grid"
                        agent={this.state.agent}
                        env={this.state.env}

                        showQTriangles={this.state.showQTriangles}
                        showQVals={this.state.showQVals}
                        showStateVals={this.state.showStateVals}
                        showStateCoords={this.state.showStateCoords}
                        showRewardVals={this.state.showRewardVals}
                    />

                <ul>
                    <li>The agent always starts at initial state, and then try to navigate to the goal state. At each state, the agent has 4 actions. If it hits the walls or edges, it will stay put.</li>
                    <li>Arrows show the direction of greedy action, when the policy converges, it should lead directly to the goal state, which is also reflected by the green color of triangle</li>
                    <li>Try toggle after learned from a few hundreds of episode and see how eligbility trace changes. Also play with λ, and see how it affects the trace. The x axis of trace is the number of states times that of actions. </li>
                    <li>Gridworld is deterministic! </li>
                    <li>Trace-decay parameter (λ)</li>
                </ul>

                </Col>



                <Col xs={12} md={4}>
                    <div className="row">
                        <Line
                            height={150}
                            width={300}
                            id={'TD-num-steps-per-episode'}
                            data={this.state.agent.numStepsPerEpisode}
                            title={'# steps/episode'}
                        />
                    </div>

                    <div className="row">
                        <Line
                            height={150}
                            width={300}
                            id={'TD-etrace'}
                            data={this.state.agent.Z}
                            title={'eligibility trace'}
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
                        <li><a className="toggle-button" onClick={this.toggleQTriangles.bind(this)}>Q triangles</a></li>
                        <li><a className="toggle-button" onClick={this.toggleQVals.bind(this)}>Q values</a></li>
                        <li><a className="toggle-button" onClick={this.toggleStateVals.bind(this)}>States</a></li>
                        <li><a className="toggle-button" onClick={this.toggleStateCoords.bind(this)}>State coordinates</a></li>
                        <li><a className="toggle-button" onClick={this.toggleRewardVals.bind(this)}>Rewards</a></li>
                    </ul>

                    <p>Try hit learn button if you don't see much going on.</p>
                    <p>Currently, only standard SARSA(λ) is implemented. Colors of each Q triangle reflect its learn values.</p>
                </Col>
            </div>
        );
    }
}


export default GridWorldTD;
