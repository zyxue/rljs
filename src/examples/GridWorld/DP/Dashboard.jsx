import React, {Component} from 'react';
import {Col} from 'react-bootstrap';

import AgentExperience from '../Components/Dashboard/AgentExperience.jsx';
import AgentBtns from '../Components/Dashboard/AgentBtns.jsx';
import EnvStatus from '../Components/Dashboard/EnvStatus.jsx';
import CellStatus from '../Components/Dashboard/CellStatus.jsx';
import LegendsCtrlButtons from '../Components/Dashboard/LegendsCtrlButtons.jsx';


class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.agentBtnsData = [
            ['evalPolOneSweep', 'Policy evaluation (one sweep)'],
            ['evalPol', 'Policy evaluation (till convergence)'],
            ['togglePolEval', 'Policy evaluation toggle'],
            ['toggleValFuncOptim', 'Value function optimization toggle'],
            ['updatePol', 'Update policy'],
            ['polIter', 'Policy iteration'],
            ['valIter', 'Value iteration'],
            ['reset', 'Reset'],
        ];

    }

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

        this.agentExperiData = [
            ['# policy iterations sweeps', agent['numPolEvalSweeps']],
            ['# value iterations sweeps', agent['numValFuncOptimizationSweeps']],
        ];

        return (
            <div>
                <Col md={4}>
                    <AgentExperience experienceData={this.agentExperiData} />
                    <AgentBtns btnsData={this.agentBtnsData} handleClick={hdlAgentBtnClick.bind(this)} />
                </Col>

                <Col md={3}>
                    <EnvStatus env={agent.env} updateEnvHandler={updateEnv.bind(this)}
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
