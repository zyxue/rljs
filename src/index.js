import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

import 'bootstrap/dist/css/bootstrap.css';


import App from './App';
import GridWorldDP from './examples/GridWorldDP.jsx';
import GridWorldTDPred from './examples/GridWorldTDPred.jsx';
import TDControlView from './examples/GridWorld/TDControl/View.jsx';


ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <Route path="/gridworld-dp" component={GridWorldDP}/>
        <Route path="/gridworld-td-pred" component={GridWorldTDPred}/>
        <Route path="/gridworld-td" component={TDControlView}/>
        </Route>
    </Router>
), document.getElementById('root'));
