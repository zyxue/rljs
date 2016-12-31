import React from 'react';
import {Col, Button, ButtonToolbar} from 'react-bootstrap';

import {TDAgent} from '../lib/Reinforce-js';

import GridWorldEnv from './GridWorldTD/GridWorldEnv';
import Grid from './GridWorldTD/Grid';


class GridWorldTD extends React.Component {
    constructor() {
        super();

        // create an env, and an agent with discount factor (gamma) as 0.9
        let env = new GridWorldEnv();
        let agent = new TDAgent(env, {'gamma': 0.9});

        this.state = {
            agent: agent,

            showQTriangles: true,
            showQVals: false,
            showStateVals: false,
            showStateCoords: false,
            showRewardVals: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);

        this.toggleQTriangles = this.toggleQTriangles.bind(this);
        this.toggleQVals = this.toggleQVals.bind(this);
        this.toggleStateVals = this.toggleStateVals.bind(this);
        this.toggleStateCoords = this.toggleStateCoords.bind(this);
        this.toggleRewardVals = this.toggleRewardVals.bind(this);
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

    handleChange(event) {
        let newVal = parseInt(event.target.fvalue, 10);
        if (newVal) this.setState({value: newVal});
    }

    startActing() {
        let intervalId = setInterval (() => {
            this.state.agent.act();
            this.setState({agent: this.state.agent});
        }, 10);
        this.setState({intervalId: intervalId});
    }

    handleClick(action, event) {
        /* console.log(event);
         * console.log(arguments);*/
        /* for (let i=0; i< 100; i++) {
         *     this.state.agent.learn();
         * };*/

        if (action === 'act') {
            this.state.agent.act();
        } else if (action === 'toggle') {
            console.log(this.state.intervalId);
            if (this.state.intervalId) {
                clearInterval(this.state.intervalId);
                this.setState({intervalId: undefined});
            } else {
                this.startActing();
            }
        }
        else if (action === 'reset') {this.state.agent.reset();}
        else {
            /* temporary for testing purpose, learn multiple episodes in one click  */
            for (let i=0; i < 2000; i ++)
                this.state.agent.learnFromOneEpisode();
        }

        this.setState({agent: this.state.agent});
    }

    render() {
        return (
            <div className="GridWorldTD">
                <Col className='grid' xs={12} md={9} style={{border: 'red 0.5px solid', height: '600px'}}>
                    <Grid
                        height={600}
                        width={800}
                        id="TD-grid"
                        agent={this.state.agent}

                        showQTriangles={this.state.showQTriangles}
                        showQVals={this.state.showQVals}
                        showStateVals={this.state.showStateVals}
                        showStateCoords={this.state.showStateCoords}
                        showRewardVals={this.state.showRewardVals}
                    />
                </Col>

                <Col xs={12} md={3}>
                    <ButtonToolbar>
                        <Button bsStyle='primary' onClick={this.handleClick.bind(this, 'learn')}>Learn</Button>
                        <Button bsStyle='primary' onClick={this.handleClick.bind(this, 'act')}>Act</Button>
                        <Button bsStyle='primary' onClick={this.handleClick.bind(this, 'toggle')}>Toggle</Button>
                        <Button bsStyle='primary' onClick={this.handleClick.bind(this, 'reset')}>Reset</Button>
                    </ButtonToolbar>

                    <a onClick={this.toggleQTriangles}>Toggle Q Triangles (for clarity)</a>
                    <br/>
                    <a onClick={this.toggleQVals}>Toggle Q Values</a>
                    <br/>
                    <a onClick={this.toggleStateVals}>Toggle States</a>
                    <br/>
                    <a onClick={this.toggleStateCoords}>Toggle State Coordinates</a>
                    <br/>
                    <a onClick={this.toggleRewardVals}>Toggle Rewards</a>

                    <p>Learn: just one evaluatePolicy + one updatePolicy</p>
                    <div>Numbers in each box:
                        <ul>
                            <li>top left: reward</li>
                            <li>top right: state</li>
                            <li>bottom left: value</li>
                        </ul>
                    </div>

                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

                        </p>
                </Col>
            </div>
        );
    }
}


export default GridWorldTD;
