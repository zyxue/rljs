import React, {Component} from 'react';
import {Col, Button, ButtonToolbar} from 'react-bootstrap';

import EnvStatus from '../Components/Dashboard/EnvStatus.jsx';
import CellStatus from '../Components/Dashboard/CellStatus.jsx';
import LegendsCtrlButtons from '../Components/Dashboard/LegendsCtrlButtons.jsx';

import AgentBtns from './agentBtns.jsx';

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
        return (
            <div>
                <Col md={4}>
                    <div># policy iterations sweeps: {agent.numPolEvalSweeps}</div>
                    <div># value iterations sweeps: {agent.numValFuncOptimizationSweeps}</div>
                    <AgentBtns handleClick={hdlAgentBtnClick} />
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
