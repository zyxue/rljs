import React, {Component} from 'react';
import {Row, Col, Button, ButtonToolbar, ButtonGroup} from 'react-bootstrap';

/* import NumberInputTag from './NumberInputTag.jsx';
 * import SelectTag from './SelectTag.jsx';
 * import {GreekLetterParams, OtherParams} from './Params.jsx';*/

import AgentStatus from '../Components/Dashboard/AgentStatus.jsx';
import EnvStatus from '../Components/Dashboard/EnvStatus.jsx';
import UserCtrlButtons from '../Components/Dashboard/UserCtrlButtons.jsx';
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
        return (
            <div>
                <Col md={3}>
                    <div># policy iter: {agent.numPolicyIterations};&nbsp;# value iter: {agent.numValueIterations}</div>
                    <ButtonToolbar className="wrapped-buttons">
                        <Button bsStyle='primary' bsSize='xsmall' onClick={hdlAgentBtnClick.bind(this, 'evaluatePolicy')}>Evaluate policy</Button>
                        <Button bsStyle='primary' bsSize='xsmall' onClick={hdlAgentBtnClick.bind(this, 'updatePolicy')}>Update policy</Button>
                        <Button bsStyle='primary' bsSize='xsmall' onClick={hdlAgentBtnClick.bind(this, 'togglePolIter')}>Toggle policy iteration</Button>
                        <Button bsStyle='primary' bsSize='xsmall' onClick={hdlAgentBtnClick.bind(this, 'toggleValIter')}>Toggle value iteration</Button>
                        <Button bsStyle='primary' bsSize='xsmall' onClick={hdlAgentBtnClick.bind(this, 'reset')}>Reset</Button>
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

                <Col md={3}>
                    <LegendsCtrlButtons legendsCtrl={legendsCtrl} handleClick={toggleLegend.bind(this)} />
                </Col>

            </div>
        );
    }
}


export default Dashboard;
