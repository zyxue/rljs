import React, {Component} from 'react';
import {Row, Col, Button, ButtonToolbar} from 'react-bootstrap';

/* import NumberInputTag from './NumberInputTag.jsx';
 * import SelectTag from './SelectTag.jsx';
 * import {GreekLetterParams, OtherParams} from './Params.jsx';*/

import AgentStatus from '../Components/Dashboard/AgentStatus.jsx';
import EnvStatus from '../Components/Dashboard/EnvStatus.jsx';
import UserCtrlButtons from '../Components/Dashboard/UserCtrlButtons.jsx';
import CellStatus from '../Components/Dashboard/CellStatus.jsx';
import LegendsCtrlButtons from '../Components/Dashboard/LegendsCtrlButtons.jsx';


class Dashboard extends Component {
    render() {
        const {agent,
               hdlAgentBtnClick,
               selectedStateId,
               hdlCellBtnClick,
               hdlCellRewardAdjustment,
        } = this.props;
        return (
            <div>
                <div># policy iterations: {agent.numPolicyIterations}</div>
                <div># value iterations: {agent.numValueIterations}</div>
                <ButtonToolbar>
                    <Button bsStyle='primary' bsSize='xsmall' onClick={hdlAgentBtnClick.bind(this, 'evaluatePolicy')}>Evaluate policy</Button>
                    <Button bsStyle='primary' bsSize='xsmall' onClick={hdlAgentBtnClick.bind(this, 'updatePolicy')}>Update policy</Button>
                    <Button bsStyle='primary' bsSize='xsmall' onClick={hdlAgentBtnClick.bind(this, 'togglePolIter')}>Toggle policy iteration</Button>
                    <Button bsStyle='primary' bsSize='xsmall' onClick={hdlAgentBtnClick.bind(this, 'toggleValIter')}>Toggle value iteration</Button>
                    <Button bsStyle='primary' bsSize='xsmall' onClick={hdlAgentBtnClick.bind(this, 'reset')}>Reset</Button>
                </ButtonToolbar>

                <CellStatus disabled={selectedStateId === null ? true: false}
                            handleClick={hdlCellBtnClick}
                            handleSlide={hdlCellRewardAdjustment}
                />
            </div>
        );

        /* let {agent,
         *      selectedState,
         *      updateAgent,
         *      updateEnv,
         *      handleUserCtrlButtonClick,
         *      legendsCtrl,
         *      toggleLegend,
         *      setSelectedStateAs,
         *      adjustSelectedStateReward} = this.props;
         * return (
         *     <div>
         *         <Col className="agent-control" xs={12} md={4}>
         *             <AgentStatus agent={agent} updateAgent={updateAgent} />
         *         </Col>
         *         
         *         <Col xs={12} md={3}>
         *             <Row className="env-control">
         *             <EnvStatus env={agent.env} updateEnv={updateEnv} />
         *             </Row>

         *                 <Row>
         *                 <UserCtrlButtons handleClick={handleUserCtrlButtonClick} />
         *                 </Row>
         *                 </Col>

         *                 <Col xs={12} md={5}>
         *                     <Row className="cell-control">
         *                         <CellStatus env={agent.env}
         *                                     updateEnv={updateEnv}
         *                                     selectedState={selectedState}
         *                                     setSelectedStateAs={setSelectedStateAs}
         *                                     adjustSelectedStateReward={adjustSelectedStateReward}/>
         *                         </Row>

         *                 <Row>
         *                 <LegendsCtrlButtons legendsCtrl={legendsCtrl} handleClick={toggleLegend} />
         *                 </Row> 
         *             </Col>
         *     </div>
         * );*/
    }
}


export default Dashboard;
