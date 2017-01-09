import React from 'react';
import {Col, Button, ButtonToolbar} from 'react-bootstrap';

import {TDAgent} from '../../../lib/Reinforce-js';

import Control from '../Base/Control.jsx';
import Env from '../Base/Env.js';


class View extends Control {
    constructor() {
        super();
        this.allowedDimensions = [3, 4, 5, 6, 7, 8, 9, 10];
        let env = new Env();
        let agent = new TDAgent(env);

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

    render() {
        return (
            <div className="GridWorldTD">
                {/* <p> <strong>Agent status: </strong>
                    <span>γ = </span><span className="text-primary">{this.state.agent.gamma}</span>; &nbsp;
                    <span>ε = </span><span className="text-primary">{this.state.agent.epsilon}</span>; &nbsp;
                    <span>α = </span><span className="text-primary">{this.state.agent.alpha}</span>; &nbsp;
                    <span>λ = </span><span className="text-primary">{this.state.agent.lambda}</span>; &nbsp;
                    <span># Ep. experienced: </span><span className="text-primary">{this.state.agent.numEpisodesExperienced}</span>;
                    </p> */}

                <Col className='grid' xs={12} md={8} style={{border: 'red 0.5px solid', height: '600px'}}>

                    {/* <Grid
                        height={600}
                        width={700}
                        id="grid-TD-control"
                        agent={this.state.agent}
                        env={this.state.env}
                        showLegend={this.state.showLegend}
                        selectedState={this.state.selectedState}
                        updateSelectedState={this.updateSelectedState.bind(this)}
                        updateAgentAction={this.updateAgentAction.bind(this)}
                        />
                      */}

                    {/* <Grid
                        height={600}
                        width={700}
                        id="TD-grid"
                        agent={this.state.agent}

                        showQTriangles={this.state.showQTriangles}
                        showQVals={this.state.showQVals}
                        showStateVals={this.state.showStateVals}
                        showStateCoords={this.state.showStateCoords}
                        showRewardVals={this.state.showRewardVals}
                        /> */}

                <ul>
                    <li>The agent always starts at initial state, and then try to navigate to the goal state. At each state, the agent has 4 actions. If it hits the walls or edges, it will stay put.</li>
                    <li>Arrows show the direction of greedy action, when the policy converges, it should lead directly to the goal state, which is also reflected by the green color of triangle</li>
                    <li>Try toggle after learned from a few hundreds of episode and see how eligbility trace changes. Also play with λ, and see how it affects the trace. The x axis of trace is the number of states times that of actions. </li>
                    <li>Gridworld is deterministic! </li>
                    <li>Trace-decay parameter (λ)</li>
                </ul>

                </Col>

                <Col xs={12} md={4}>
                    {/* <div className="row">
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
                        </ul> */}

                    <p>Try hit learn button if you don't see much going on.</p>
                    <p>Currently, only standard SARSA(λ) is implemented. Colors of each Q triangle reflect its learn values.</p>
                </Col>
            </div>
        );
    }
}


export default View;
