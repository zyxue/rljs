import React, {Component} from 'react';
import {Row, Col, Button, ButtonToolbar, ButtonGroup} from 'react-bootstrap';

import AgentExperience from '../Components/Dashboard/AgentExperience.jsx';
import Params from '../Components/Dashboard/Params.jsx';
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

        let agentParamSpecs = [
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
                spec: {label: 'λ = ', attr: 'lambda',  min: 0, max: 1, step: 0.01, currentVal: agent.lambda}
            },
            {
                specType: 'number',
                spec: {label: 'batchSize', attr: 'batchSize',  min: 0, max: 1, step: 0.01, hideValue: true, currentVal: agent.batchSize}
            },
            {
                specType: 'select',
                spec: {
                    label: 'etrace:',
                    attr: 'etraceType',
                    options: [
                        {value: 'replacingTrace', label: 'Replacing trace'},
                        {value: 'accumulatingTrace', label: 'Accumulating trace'}
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
                        <Params specs={agentParamSpecs} changeHandler={updateAgent.bind(this)} />
                        <AgentBtns btnsData={agentBtnsData} handleClick={hdlAgentBtnClick.bind(this)} />
                    </ButtonToolbar>
                </Col>

                <Col md={3}>
                    <EnvStatus env={agent.env} updateEnvHandler={updateEnv.bind(this)} />
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
