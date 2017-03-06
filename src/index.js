import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import ReactGA from 'react-ga';

import 'bootstrap/dist/css/bootstrap.css';


import App from './App';
import GridWorldDPView        from './examples/GridWorld/DP/View.jsx';
import GridWorldTDView        from './examples/GridWorld/TDPred/View.jsx';
import GridWorldTDCtrlView from './examples/GridWorld/TDCtrl/View.jsx';
import GridWorldDynaQView     from './examples/GridWorld/DynaQ/View.jsx';


const router = (

        <Route path="/" component={App}>
            <Route path="/gridworld-dp" component={GridWorldDPView} />
            <Route path="/gridworld-td-pred" component={GridWorldTDView}/>
            <Route path="/gridworld-td-ctrl" component={GridWorldTDCtrlView}/>
            <Route path="/gridworld-dyna-q" component={GridWorldDynaQView}/>
        </Route>
    </Router>
);

const routes = (
    <Route path="/" component={App}>
        <Route path="/gridworld-dp" component={GridWorldDPView} />
        <Route path="/gridworld-td-pred" component={GridWorldTDView}/>
        <Route path="/gridworld-td-ctrl" component={GridWorldTDCtrlView}/>
        <Route path="/gridworld-dyna-q" component={GridWorldDynaQView}/>
    </Route>
);


const app = document.getElementById('root');

if (process.env.NODE_ENV === 'production') {
    ReactGA.initialize(process.env.REACT_APP_GA_ID);

    function logPageView() {
        ReactGA.set({ page: window.location.pathname });
        ReactGA.pageview(window.location.pathname);
    }

    ReactDOM.render(
        <Router history={hashHistory} routes={routes} onUpdate={logPageView} />,
        app);
} else {
    ReactDOM.render(
        <Router history={hashHistory} routes={routes} />,
        app);
}
