import React, {Component} from 'react';
import {Row, Col, Button, ButtonToolbar, ButtonGroup} from 'react-bootstrap';

import AgentExperience from '../Components/Dashboard/AgentExperience.jsx';
import AgentParams from '../Components/Dashboard/AgentParams.jsx';
import AgentBtns from '../Components/Dashboard/AgentBtns.jsx';
import EnvStatus from '../Components/Dashboard/EnvStatus.jsx';
import CellStatus from '../Components/Dashboard/CellStatus.jsx';
import LegendsCtrlButtons from '../Components/Dashboard/LegendsCtrlButtons.jsx';

import './Dashboard.css';

class Dashboard extends Component {
    render() {
        const {agent,
               updateAgent,
               updateEnv,
               hdlAgentBtnClick,
               selectedStateId,
               hdlCellBtnClick,
               hdlCellRewardAdjustment,
               legendsCtrl,
               toggleLegend
        } = this.props;

        const agentExperiData = [
            ['# episodes', agent.numEpisodesExperienced],
            ['# steps in current episode', agent.numStepsCurrentEpisode],
            ['# total steps from all  episodes', agent.numTotalSteps]
        ];

        let agentParamsSpec =             [
            // attr: the attribute to change of the agent
            {
                specType: 'number',
                spec: {label: 'α = ', attr: 'alpha', min: 0, max: 10, step: 0.01, currentVal: agent.alpha}
            },
            {
                specType: 'number',
                spec: {label: 'γ = ', attr: 'gamma',   min: 0, max: 1, step: 0.01, currentVal: agent.gamma}
            },
            {
                specType: 'number',
                spec: {label: 'ε = ', attr: 'epsilon', min: 0, max: 1, step: 0.01, currentVal: agent.epsilon}
            },
            {
                specType: 'number',
                spec: {label: 'λ = ', attr: 'lambda',  min: 0, max: 1, step: 0.01, currentVal: agent.lambda}
            },
            {
                specType: 'select',
                spec: {
                    label: 'learning algo:',
                    attr: 'learningAlgo',
                    currentVal: agent.learningAlgo,
                    options: [
                        {value: 'watkinsQLambda', label: 'Watkins’s Q(λ)'},
                        {value: 'sarsaLambda', label: 'Sarsa(λ)'}
                    ]
                }
            }
        ];

        const agentBtnsData = [
            ['takeOneStep', 'Take one step'],
            ['toggleTDLambda', 'Toggle learning'],
            ['learnFromOneEpisode', 'Learn from one episode'],
            ['learnFromMultipleEpisodes', 'Learn from multiple episodes'],
            ['reset', 'Reset'],
        ];

        return (
            <div>
                <Col md={4}>
                    <h5>Agent:</h5>
                    <ButtonToolbar className="wrapped-buttons">
                        <AgentExperience experienceData={agentExperiData} />
                        <AgentParams spec={agentParamsSpec} changeHandler={updateAgent} />
                        <AgentBtns btnsData={agentBtnsData} handleClick={hdlAgentBtnClick.bind(this)} />
                    </ButtonToolbar>
                </Col>

                <Col md={3}>
                    <EnvStatus disabled={selectedStateId === null ? true: false}
                               env={agent.env}
                               updateEnv={updateEnv.bind(this)}
                    />
                </Col>

                <Col md={3}>
                    <CellStatus disabled={selectedStateId === null ? true: false}
                                handleClick={hdlCellBtnClick.bind(this)}
                                handleSlide={hdlCellRewardAdjustment.bind(this)}
                    />
                </Col>

                <Col className="wrapped-buttons" md={2}>
                    <LegendsCtrlButtons legendsCtrl={legendsCtrl} handleClick={toggleLegend.bind(this)} />
                </Col>

            </div>
        );
    }
}


export default Dashboard;
