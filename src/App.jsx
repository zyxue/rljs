import React from 'react';
import { Link } from 'react-router';

import './App.css';


const NavLink = React.createClass({
    render() {
        return <Link {...this.props} activeClassName="active"/>
    }
});


export default React.createClass({
    render() {
        return (
            <div>
                <h1>RLjs examples</h1>
                <nav>
                    <ul role="navigation" className="nav nav-pills">
                        <li><NavLink to="/gridworld-dp">Dynamic Programming</NavLink></li>
                        <li><NavLink to="/gridworld-td-pred">TD Prediction</NavLink></li>
                        <li><NavLink to="/gridworld-td-ctrl">TD Control</NavLink></li>
                        <li><NavLink to="/gridworld-dyna-q">Dyna-Q</NavLink></li>
                    </ul>
                </nav>
                {this.props.children}

                <h2>Welcome to RLjs</h2>
                <h4>RLjs currently serves as a playground for Reinforcement learning.</h4>
                <p>
                  Several most common tabular RL algorithms have been
                  implemented in javascript, and demenstrated with gridword as
                  an toy example. Have fun!
                </p>

                <p>
                  If you find anything that does not make sense, feel free
                  to <a href="https://github.com/zyxue/rljs/issues/new"
                  target="_blank">open a new issue</a> on github.
                </p>
            </div>
        );
    }
});
