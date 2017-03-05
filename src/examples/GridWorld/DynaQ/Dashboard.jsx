import React, {Component} from 'react';
import {Row, Col, Button, ButtonToolbar} from 'react-bootstrap';

import Dashboard from '../TDCtrl/Dashboard.jsx';

class DynaQDashboard extends Dashboard {
    constructor(props) {
        super(props);
        const agent = this.props.agent;
        
        this.agentExperiData = [
            ['# episodes', agent.numEpisodesExperienced],
            ['# steps in current episode', agent.numStepsCurrentEpisode],
            ['# total steps from all  episodes', agent.numTotalSteps]
        ];

        this.agentParamSpecs = [
            {
                specType: 'number',
                label: 'α = ', attr: 'alpha',
                spec: {min: 0, max: 10, step: 0.01}
            },
            {
                specType: 'number',
                label: 'γ = ', attr: 'gamma',
                spec: {min: 0, max: 1, step: 0.01}
            },
            {
                specType: 'number',
                label: 'ε = ', attr: 'epsilon',
                spec: {min: 0, max: 1, step: 0.01}
            },
            {
                specType: 'number',
                label: 'batchSize', attr: 'batchSize',
                spec: {min: 0, max: 1, step: 0.01, hideValue: true}
            }
        ];

        this.agentBtnsData = [
            ['takeOneStep', 'Take one step'],
            ['toggleLearning', 'Toggle learning'],
            ['learnFromOneEpisode', 'Learn from one episode'],
            ['learnFromMultipleEpisodes', 'Learn from multiple episodes'],
            ['reset', 'Reset'],
        ];
    }
}


export default DynaQDashboard;
