import React from 'react';
import ReactDOM from 'react-dom';

import {R, RL} from '../lib/rl.js';

import GridWorld from './GridWorldDP/GridWorld.js';
import Grid from './GridWorldDP/Grid.jsx';


class GridWorldDP extends React.Component {
    constructor() {
        super();
        // create environment
        let env = new GridWorld();

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
        let newVal = parseInt(event.target.value);
        if (newVal) this.setState({value: newVal});
    }

    handleClick(action, event) {
        /* console.log(event);
         * console.log(arguments);*/
        /* for (let i=0; i< 100; i++) {
         *     this.state.agent.learn();
         * };*/

        if (action == 'evalPolicy') {this.state.agent.evaluatePolicy();}
        else if (action == 'updatePolicy') {this.state.agent.updatePolicy();}
        else if (action == 'reset') {this.state.agent.reset();}
        else {this.state.agent.learn();}

        this.setState({agent: this.state.agent});
    }

    render() {
        var actionMapping = {
            0: '←',
            1: '↑',
            2: '↓',
            3: '→'
        };

        /* 
         *         let action;
         *         if (this.state.value && this.state.value < this.state.agent.env.getNumStates()) {
         *             console.log('lele', typeof this.state.value);
         *             action = actionMapping[this.state.agent.act(this.state.value)];
         *         } else {
         *             action = '-';
         *         }*/

        return (
            <div className="">
                <br/>

                {/* type="number" doesn't guarrantee it's a number, e.g. could also be empty string */}
                {/* <input type="number"
                    value={this.state.value}
                    onChange={this.handleChange}
                    />
                    action at {this.state.value}: {action} */}


                <Grid agent={this.state.agent}/>
                <br/>
                <button onClick={this.handleClick.bind(this, 'learn')}>Learn</button>
                <button onClick={this.handleClick.bind(this, 'evalPolicy')}>Eval Policy</button>
                <button onClick={this.handleClick.bind(this, 'updatePolicy')}>Update Policy</button>
                <button onClick={this.handleClick.bind(this, 'reset')}>Reset</button>

                <p>Learn: just one evaluatePolicy + one updatePolicy</p>
                <div>Numbers in each box:
                    <ul>
                        <li>top left: reward</li>
                        <li>top right: state</li>
                        <li>bottom left: value</li>
                    </ul>
                </div>
            </div>
        );
    }
}


export default GridWorldDP;
