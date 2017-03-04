import React, {Component} from 'react';
import {Row, Col, Button, ButtonToolbar} from 'react-bootstrap';

import AgentExperience from '../Components/Dashboard/AgentExperience.jsx';
import Params from '../Components/Dashboard/Params.jsx';
import AgentBtns from '../Components/Dashboard/AgentBtns.jsx';
import EnvStatus from '../Components/Dashboard/EnvStatus.jsx';
import CellStatus from '../Components/Dashboard/CellStatus.jsx';
import LegendsCtrlButtons from '../Components/Dashboard/LegendsCtrlButtons.jsx';


class Dashboard extends Component {
    constructor(props) {
        super(props);
        const agent = this.props.agent;
        
        this.agentExperiData = [
            ['# episodes', agent.numEpisodesExperienced],
            ['# steps in current episode', agent.numStepsCurrentEpisode],
            ['# total steps from all  episodes', agent.numTotalSteps]
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
                label: 'ε = ', attr: 'epsilon',
                spec: {min: 0, max: 1, step: 0.01}
            },
            {
                specType: 'number',
                label: 'batchSize', attr: 'batchSize',
                spec: {min: 0, max: 1, step: 0.01, hideValue: true}
            },
            {
                specType: 'select',
                label: 'learning algo:',
                attr: 'learningAlgo',
                spec: {
                    options: [
                        {value: 'watkinsQLambda', label: 'Watkins’s Q(λ)'},
                        {value: 'sarsaLambda', label: 'Sarsa(λ)'}
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
                <Col md={4}>
                    <h5>Agent:</h5>
                    <ButtonToolbar className="wrapped-buttons">
                        <AgentExperience experienceData={this.agentExperiData} />
                        <Params specs={this.agentParamSpecs} changeHandler={updateAgent.bind(this)} />
                        <AgentBtns btnsData={this.agentBtnsData} handleClick={hdlAgentBtnClick.bind(this)} />
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