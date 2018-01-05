import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, NavLink, Link, hashHistory } from 'react-router-dom';

import GridWorldDPView from './examples/GridWorld/DP/View.jsx';
import GridWorldTDPredView from './examples/GridWorld/TDPred/View.jsx';
import GridWorldTDCtrlView from './examples/GridWorld/TDCtrl/View.jsx';
import GridWorldDynaQView from './examples/GridWorld/DynaQ/View.jsx';


/* https://github.com/react-ga/react-ga */
import ReactGA from 'react-ga';
const GA_ID = process.env.REACT_APP_GA_ID;
if (GA_ID !== undefined) {
    ReactGA.initialize(process.env.REACT_APP_GA_ID);
    ReactGA.pageview(window.location.pathname + window.location.search);
}


const Home = () => (
    <div>
        <h2>Welcome to RLjs</h2>
        <p>
          <strong>RLjs currently serves as a playground for learning
          reinforcement learning.</strong>
        </p>
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


const App = () => (
    <Router>
        <div>
            <h1><Link to="/">RLjs examples</Link></h1>
            <nav>
                <ul role="navigation" className="nav nav-pills">
                    <li><NavLink activeClassName="text-success" to="/gridworld-dp">Dynamic Programming</NavLink></li>
                    <li><NavLink activeClassName="text-success" to="/gridworld-td-pred">TD Prediction</NavLink></li>
                    <li><NavLink activeClassName="text-success" to="/gridworld-td-ctrl">TD Control</NavLink></li>
                    <li><NavLink activeClassName="text-success" to="/gridworld-dyna-q">Dyna-Q</NavLink></li>
                </ul>
            </nav>


            <Route exact={true} path="/" component={Home} />
            <Route path="/gridworld-dp" component={GridWorldDPView} />
            <Route path="/gridworld-td-pred" component={GridWorldTDPredView}/>
            <Route path="/gridworld-td-ctrl" component={GridWorldTDCtrlView}/>
            <Route path="/gridworld-dyna-q" component={GridWorldDynaQView}/>
        </div>
    </Router>
);


export default App;
