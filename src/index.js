import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

import 'bootstrap/dist/css/bootstrap.css';


import App from './App';
import GridWorldDPView        from './examples/GridWorld/DP/View.jsx';
import GridWorldTDView        from './examples/GridWorld/TDPred/View.jsx';
import GridWorldTDCtrlView from './examples/GridWorld/TDCtrl/View.jsx';
import GridWorldDynaQView     from './examples/GridWorld/DynaQ/View.jsx';


ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
        <Route path="/gridworld-dp" component={GridWorldDPView} />
        <Route path="/gridworld-td-pred" component={GridWorldTDView}/>
        <Route path="/gridworld-td-ctrl" component={GridWorldTDCtrlView}/>
        <Route path="/gridworld-dyna-q" component={GridWorldDynaQView}/>
        </Route>
    </Router>
), document.getElementById('root'));
