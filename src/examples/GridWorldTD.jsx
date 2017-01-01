import React from 'react';
import {Col, Button, ButtonToolbar} from 'react-bootstrap';

import {TDAgent} from '../lib/Reinforce-js';

import GridWorldEnv from './GridWorldTD/GridWorldEnv';
import Grid from './GridWorldTD/Grid';
import Line from './GridWorldTD/Line';


class GridWorldTD extends React.Component {
    constructor() {
        super();

        // create an environment and an agent instance
        let env = new GridWorldEnv();
        let agent = new TDAgent(env);

        this.state = {
            agent: agent,

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

    updateAgentBatchSize(event) {
        this.state.agent.batchSize = event.target.value;
        this.setState({agent: this.state.agent});
    }

    startActing() {
        let intervalId = setInterval (() => {
            this.state.agent.act();
            this.setState({agent: this.state.agent});
        }, 10);
        this.setState({intervalId: intervalId});
    }

    handleClick(action, event) {
        if (action === 'act') {
            this.state.agent.act();
        } else if (action === 'toggle') {
            /* console.debug(this.state.intervalId);*/
            if (this.state.intervalId) {
                clearInterval(this.state.intervalId);
                this.setState({intervalId: undefined});
            } else {
                this.startActing();
            }
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
                <Col className='grid' xs={12} md={8} style={{border: 'red 0.5px solid', height: '600px'}}>
                    <Grid
                        height={600}
                        width={700}
                        id="TD-grid"
                        agent={this.state.agent}

                        showQTriangles={this.state.showQTriangles}
                        showQVals={this.state.showQVals}
                        showStateVals={this.state.showStateVals}
                        showStateCoords={this.state.showStateCoords}
                        showRewardVals={this.state.showRewardVals}
                    />
                </Col>

                <Col xs={12} md={4}>
                    <Line
                        height={150}
                        width={200}
                        id="TD-line"
                        agent={this.state.agent}
                    />

                    <ul>
                        <li>γ = {this.state.agent.gamma}</li>
                        <li>ε = {this.state.agent.epsilon}</li>
                        <li>α = {this.state.agent.alpha}</li>
                        <li>λ = {this.state.agent.lambda}</li>
                        <li>batch size: <input type="number" value={this.state.agent.batchSize} size="5"
                                               onChange={this.updateAgentBatchSize.bind(this)} /></li>
                        <li># Episodes experienced: {this.state.agent.numEpisodesExperienced}</li>
                    </ul>

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
