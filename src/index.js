import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'

import 'bootstrap/dist/css/bootstrap.css';


import App from './modules/App';
import GridWorldDP from './modules/GridWorldDP.jsx';
import GridWorldTD from './modules/GridWorldTD.jsx';


ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <Route path="/gridworld-dp" component={GridWorldDP}/>
            <Route path="/gridworld-td" component={GridWorldTD}/>
        </Route>
    </Router>
), document.getElementById('root'))
