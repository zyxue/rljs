import React, {Component} from 'react';
import {Row, Col, Button, ButtonToolbar} from 'react-bootstrap';

/* import NumberInputTag from './NumberInputTag.jsx';
 * import SelectTag from './SelectTag.jsx';
 * import {GreekLetterParams, OtherParams} from './Params.jsx';*/

import AgentStatus from './AgentStatus.jsx';
import EnvStatus from './EnvStatus.jsx'
import UserCtrlButtons from './UserCtrlButtons.jsx';
import CellStatus from './CellStatus.jsx';
import LegendsCtrlButtons from './LegendsCtrlButtons.jsx';


class Dashboard extends Component {
    render() {
        let {agent,
             selectedState,
             updateAgent,
             updateEnv,
             handleUserCtrlButtonClick,
             legendsCtrl,
             toggleLegend,
             setSelectedStateAs,
             adjustSelectedStateReward} = this.props;
        return (
            <div className="dashboard">
                <Col className="agent-control" xs={12} md={4}>
                    <AgentStatus agent={agent} updateAgent={updateAgent} />
                </Col>
                
                <Col xs={12} md={3}>
                    <Row className="env-control">
                    <EnvStatus env={agent.env} updateEnv={updateEnv} />
                    </Row>

                        <Row>
                        <UserCtrlButtons handleClick={handleUserCtrlButtonClick} />
                        </Row>
                        </Col>

                        <Col xs={12} md={5}>
                            <Row className="cell-control">
                                <CellStatus env={agent.env}
                                            updateEnv={updateEnv}
                                            selectedState={selectedState}
                                            setSelectedStateAs={setSelectedStateAs}
                                            adjustSelectedStateReward={adjustSelectedStateReward}/>
                                </Row>

                        <Row>
                        <LegendsCtrlButtons legendsCtrl={legendsCtrl} handleClick={toggleLegend} />
                        </Row> 
                    </Col>
            </div>
        );
    }
}


export default Dashboard;
