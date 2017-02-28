import React, {Component} from 'react';
import {Row, Col, Button, ButtonToolbar, ButtonGroup} from 'react-bootstrap';

import AgentExperience from '../Components/Dashboard/AgentExperience.jsx';
import AgentBtns from '../Components/Dashboard/AgentBtns.jsx';
import EnvStatus from '../Components/Dashboard/EnvStatus.jsx';
import CellStatus from '../Components/Dashboard/CellStatus.jsx';
import LegendsCtrlButtons from '../Components/Dashboard/LegendsCtrlButtons.jsx';

import './Dashboard.css';

class Dashboard extends Component {
    render() {
        const {agent,
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
            ['# steps in current episode', agent.numStepsCurrentEpisode]
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
                    <ButtonToolbar className="wrapped-buttons">
                        <AgentExperience experienceData={agentExperiData} />
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
