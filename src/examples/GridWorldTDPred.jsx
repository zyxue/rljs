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

    setSelectedStateAs(key) {
        let env = this.state.env;
        let st = this.state.selectedState;
        if (key === 'startingState') {
            st.isCliff = false;
            env.startingState = st;
        } else if (key === 'terminalState') {
            // set reward of old terminal to 0 so as to avoid stuck in old
            // terminalState taking advantage of plus reward
            env.terminalState.reward = 0;
            st.isCliff = false // terminal state cannot be cliff
            env.terminalState = st;
            env.terminalState.reward = 1;
        } else if (key === 'cliff') {
            if (st.id !== env.startingState.id && st.id !== env.terminalState.id)
                st.isCliff = !st.isCliff;
        }
        this.setState({env: env});
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

    toggleLegends() {
        return (
            <p className="text-center">
                <strong>Toggle legends:</strong> <a className="toggle-button" onClick={this.toggleLegend.bind(this, 'stateValue')}>State values</a>; <a className="toggle-button" onClick={this.toggleLegend.bind(this, 'stateId')}>State ID</a>; <a className="toggle-button" onClick={this.toggleLegend.bind(this, 'stateCoord')}>State coordinates</a>; <a className="toggle-button" onClick={this.toggleLegend.bind(this, 'reward')}>Rewards</a>; <a className="toggle-button" onClick={this.toggleLegend.bind(this, 'etrace')}>Eligibility trace</a>
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
            <div>
                <h2>Introduction</h2>
                <p>This is a gridworld to help understand how TD(λ) does state value evaluation. This page is all about prediction and NO control. For control, please go to TD-control.</p>
            <ul>
                <li>The agent always starts at the initial state, which defaults to State 0. It then try to navigate to the terminal state (green bound).</li>
                <li>At each state, the agent has 4 actions (0: ←, 1: ↑, 2: ↓, 3: →). If it hits the walls or cliffs (grey), it stays put.</li>
                <li>Yellow circle represents the current location of the agent, and its blue arrow represents the action it chooses for the next step from epsilon-greey policy.</li>
                <li>For the meaning of numbers inside each rectangle, refer to Toggle legends section on the right.</li>
                <li>You can start by clicking Act button and see how the agent moves one step at a time.</li>
                <li>Then you can toggle continous action by clicking the Toggle button.</li>
                <li>If it converges too slow, then hit Learn button to experience multiple episodes in batch without seeing how the agent acts. See how the first plot changes.</li>
                <li>The second plot shows the episodic eligibility trace (Z) of one state (defaults to State 0). You can see that of a particular state by clicking the corresponding rectangle. An orange bound appears when a state is being selected.</li>
                <li>The third plot shows a serial view of Z of all states at the current time. The same information is also shown on the grid with yellow circles of different sizes to reflect the difference among Z of different states. See how it diminishes as the agent is leaving the state further and further. The radii of circles are rescaled logarithmically to fit the rectangular better..</li>
                <li>Gridworld is deterministic! So once the agent selects an action, its next state is deterministic.</li>
                <li>After the agent reachs the terminal state, it needs an additional step (basically action of any direction will do) to exit the terminal state and obtain the plus reward. Then the episode ends, and the agent is reinitialized to the starting state.</li>
                <li>Starting and terminal state, cliffs, rewards should be adjustable (TODO).</li>
                <li>The right side below the plots are dashboard, where you can adjust different kinds of paramters. Some of them are:</li>
                    <ul>
                        <li>α: learning rate</li>
                        <li>γ: return discount factor</li>
                        <li>ε: the exploration rate as defined in ε-greedy policy. When ε = 0, it's greedy policy, NO exploration at all; when ε = 1, it's a random policy</li>
                        <li>λ: trace-decay parameter</li>
                        <li>Acting rate controls how fast the agent moves when toggle.</li>
                    </ul>
            </ul>
            </div>
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

    dimensionUpdateSelect(label, attr, keyPrefix=label) {
        return (
            <div>
                <Col md={4}>{label} =</Col>
                <Col md={2}>
                    <select value={this.state.env[attr]} onChange={this.updateEnv.bind(this, attr)}>
                        {
                            this.allowedDimensions.map(function (e, i, a) {
                                return <option key={keyPrefix + e} value={e}>{e}</option>
                            })
                        }
                    </select>
                </Col>
            </div>
        )
    }

    agentUpdateInput(label, attr, {labelNumCols=2, valueNumCols=4} = {}) {
        return (
            <div>
                <Col md={labelNumCols}>{label} =</Col>
                <Col md={valueNumCols}>
                    <input type="text" value={this.state.agent[attr]} size="10"
                           onChange={this.updateAgent.bind(this, attr)} />
                </Col>
            </div>
        )
    }


    render() {
        return (
            <div className="GridWorldTD">
            <Col className='grid' xs={12} md={8}>
                {this.agentStatus()}
                {this.toggleLegends()}

                <ButtonToolbar>
                    <Button bsStyle='primary' className={this.state.selectedState === null? 'disabled': ''} onClick={this.setSelectedStateAs.bind(this, 'startingState')}>Starting state</Button>
                    <Button bsStyle='primary' className={this.state.selectedState === null? 'disabled': ''} onClick={this.setSelectedStateAs.bind(this, 'terminalState')}>Terminal state</Button>
                    <Button bsStyle='primary' className={this.state.selectedState === null? 'disabled': ''} onClick={this.setSelectedStateAs.bind(this, 'cliff')}>Cliff</Button>
                    <Button bsStyle='primary' className={this.state.selectedState === null? 'disabled': ''} onClick={this.handleClick.bind(this, 'reset')}>Reset</Button>
                </ButtonToolbar>

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
                        {this.dimensionUpdateSelect('# rows', 'numRows')}
                        {this.dimensionUpdateSelect('# columns', 'numCols')}

                        {this.agentUpdateInput('α', 'alpha')}
                        {this.agentUpdateInput('γ', 'gamma')}
                        {this.agentUpdateInput('ε', 'epsilon')}
                        {this.agentUpdateInput('λ', 'lambda')}
                        {this.agentUpdateInput('batch size', 'batchSize', {labelNumCols:5, valueNumCols: 7})}

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
                        <li>Learn: Learn from one batch ({this.state.agent.batchSize}) of episodes</li>
                    </ul>
                </Col>
            </div>
        );
    }
}


export default GridWorldTD;
