import React from 'react';

import RL from '../lib/rl.js';
import {Col, Button, ButtonToolbar} from 'react-bootstrap';

import GridWorldEnv from './GridWorldTD/GridWorldEnv';
import Grid from './GridWorldTD/Grid';


class GridWorldTD extends React.Component {
    constructor() {
        super();

        let env = new GridWorldEnv();

        // create the agent, yay! Discount factor 0.9
        let agent = new RL.DPAgent(env, {'gamma':0.9});

        this.state = {
            agent: agent,
            value: 0
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(event) {
        let newVal = parseInt(event.target.fvalue, 10);
        if (newVal) this.setState({value: newVal});
    }

    handleClick(action, event) {
        /* console.log(event);
         * console.log(arguments);*/
        /* for (let i=0; i< 100; i++) {
         *     this.state.agent.learn();
         * };*/

        if (action === 'evalPolicy') {this.state.agent.evaluatePolicy();}
        else if (action === 'updatePolicy') {this.state.agent.updatePolicy();}
        else if (action === 'reset') {this.state.agent.reset();}
        else {this.state.agent.learn();}

        this.setState({agent: this.state.agent});
    }

    render() {
        return (
            <div className="GridWorldTD">
                <Col className='grid' xs={12} md={7} style={{border: 'red 1px solid', height: '600px'}}>
                    <Grid agent={this.state.agent}/>
                </Col>

                <Col xs={12} md={4}>
                    <ButtonToolbar>
                        <Button bsStyle='primary' onClick={this.handleClick.bind(this, 'learn')}>Learn</Button>
                        <Button bsStyle='primary' onClick={this.handleClick.bind(this, 'evalPolicy')}>Eval Policy</Button>
                        <Button bsStyle='primary' onClick={this.handleClick.bind(this, 'updatePolicy')}>Update Policy</Button>
                        <Button bsStyle='primary' onClick={this.handleClick.bind(this, 'reset')}>Reset</Button>
                    </ButtonToolbar>

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
