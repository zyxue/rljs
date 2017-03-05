import React, {Component} from 'react';
import {Col} from 'react-bootstrap';

import AgentExperience from '../Components/Dashboard/AgentExperience.jsx';
import Params from '../Components/Dashboard/Params.jsx';
import AgentBtns from '../Components/Dashboard/AgentBtns.jsx';
import EnvStatus from '../Components/Dashboard/EnvStatus.jsx';
import CellStatus from '../Components/Dashboard/CellStatus.jsx';
import LegendsCtrlButtons from '../Components/Dashboard/LegendsCtrlButtons.jsx';

import './Dashboard.css';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        const agent = this.props.agent;

        this.agentExperiData = [
            ['# epi.', agent.numEpisodesExperienced],
            ['# steps', agent.numStepsCurrentEpisode],
            ['# total steps', agent.numTotalSteps]
        ];

        this.agentParamSpecs = [
            // attr: the attribute to change of the agent
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
                label: 'λ = ', attr: 'lambda',
                spec: {min: 0, max: 1, step: 0.01}
            },
            {
                specType: 'number',
                label: 'batch size: ', attr: 'batchSize',
                spec: {min: 0, max: 1, step: 0.01, hideValue: true}
            },
            {
                specType: 'select',
                label: 'trace: ',
                attr: 'etraceType',
                spec: {
                    options: [
                        {value: 'replacingTrace', label: 'replacing'},
                        {value: 'accumulatingTrace', label: 'accumulating'}
                    ]
                }
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

        this.agentParamSpecs.forEach(function(sp) {
            sp['currentVal'] = agent[sp.attr];
        });

        return (
            <div>
                <Col md={2}>
                    <h5>Agent control:</h5>
                    <AgentBtns btnsData={this.agentBtnsData} handleClick={hdlAgentBtnClick.bind(this)} />
                </Col>

                <Col md={2}>
                    <h5>Agent experience:</h5>
                    <AgentExperience experienceData={this.agentExperiData} />
                </Col>

                <Col md={2}>
                    <h5>Agent parameters:</h5>
                    <Params specs={this.agentParamSpecs} changeHandler={updateAgent.bind(this)} />
                </Col>

                <Col md={2}>
                    <EnvStatus env={agent.env} updateEnvHandler={updateEnv.bind(this)} />
                </Col>

                <Col md={2}>
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
