import React from 'react';
import ReactDOM from 'react-dom';

import {R, RL} from './lib/rl.js';

import GridWorld from './GridWorld.js';

import Grid from './grid.jsx';



function train() {

    // create environment
    let env = new GridWorld();

    // create the agent, yay! Discount factor 0.9
    let agent = new RL.DPAgent(env, {'gamma':0.9});

    // call this function repeatedly until convergence:
    agent.learn();

    return agent;
}
// console.log(agent);

/* once trained, get the agent's behavior with: */

/* var action = agent.act(1); // returns the index of the chosen action
   console.log(action); */


class App extends React.Component {
    constructor() {
        super();
        /* this.state = {value: 10}; */
        /* this.handleChange = this.handleChange.bind(this); */
        this.handleClick = this.handleClick.bind(this);
        let agent = this.trainAgent();
        this.state = {agent: agent};
    }

    trainAgent() {
        return train();
    }
    /* 
       handleChange(event) {
       this.setState({value: event.target.value});
       } */

    handleClick(event) {
        for (let i=0; i< 100; i++) {
            this.state.agent.learn();
        };
        this.setState({agent: this.state.agent});
    }

    render() {
        var arr = [];
        for (var i=0; i<20; i++) {
            arr.push(i);
        };

        var actionMapping = {
            0: '↑',
            1: '←',
            2: '→',
            3: '↓'
        };

        var agent = this.state.agent;
        var actions = arr.map(
            function (i) {
                if (agent.env.T[i] === 1) {
                    return (<div className="col-md-1" key={i}>{i}: Cliff</div>);
                } else {
                    return (<div  className="col-md-1" key={i}>{i}:  {actionMapping[agent.act(i)]}</div>);
                }
            }
        );

        return (
            <div className="">
                {actions}

                <br/>
                <button onClick={this.handleClick}>Click to learn.</button>

                {/* <input
                    type="number"
                    value={this.state.value}
                    onChange={this.handleChange}
                    />  */}

                <Grid agent={this.state.agent}/>
            </div>
        );
    }
}


export default App;
