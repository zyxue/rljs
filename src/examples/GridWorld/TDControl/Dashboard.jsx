import React, {Component} from 'react';
import {Row, Col, Button, ButtonToolbar} from 'react-bootstrap';

import {TDAgent} from '../../../lib/Reinforce-js';

import Env from '../Base/Env.js';
import Control from '../Base/Control.jsx';

import Grid from './Grid.jsx';


class NumberInputTag extends Component {
    render () {
        // obj includes information necessary for rendering this component
        // accordingly
        let {objectToUpdate, updateMethod, params, labelNumCols, inputNumCols} = this.props;
        return (
            <div>
                <Col className="nopadding" md={labelNumCols ? labelNumCols: 3}>
                    <span>{params.label}</span>
                    <span className="text-primary">
                        {params.hideValue ? null : objectToUpdate[params.attr]}
                    </span>
                </Col>
                <Col className="nopadding" md={inputNumCols ? labelNumCols: 3}>
                    <div className="slider">
                        <input type="number" min={params.min} max={params.max} step={params.step}
                               value={objectToUpdate[params.attr]} 
                               onChange={updateMethod.bind(this, params.attr)}/>
                    </div>
                </Col>
            </div>
        );
    }
}

class SelectTag extends Component {
    render () {
        let {objectToUpdate, updateMethod, params} = this.props;
        let options = params.options.map((p) => {
            return <option key={params.attr + '-' + p.value} value={p.value}>{p.text}</option>
        });

        return (
            <div>
                <Col className="nopadding" md={3}>
                    <span>{params.label}</span>
                </Col>
                <Col className="nopadding" md={9}>
                    <select value={objectToUpdate[params.attr]}
                            onChange={updateMethod.bind(this, params.attr)}>
                        {options}
                    </select>
                </Col>
            </div>
        );
    }
}

class GreekLetterParams extends Component {
    // parameters critical to the learning algorithm

    render () {
        let params =             [
            // attr: the attribute to change of the agent
            {label: 'α = ', attr: 'alpha',   min: 0, max: 10, step: 0.01},
            {label: 'γ = ', attr: 'gamma',   min: 0, max: 1, step: 0.01},
            {label: 'ε = ', attr: 'epsilon', min: 0, max: 1, step: 0.01},
            {label: 'λ = ', attr: 'lambda',  min: 0, max: 1, step: 0.01},
        ];

        let inputs = params.map((params) => {
            return (<NumberInputTag key={params.attr}
                                    objectToUpdate={this.props.agent}
                                    updateMethod={this.props.updateAgent}
                                    params={params} />);
        })

        return (
            <div>{inputs}</div>
        );
    }
}

class OtherParams extends Component {
    // other parameters of the agent in general
    render () {
        let params = [
            // hideValue can be a bad design
            {label: 'batch size:', attr: 'batchSize',   min: 1, max: 2000, step: 10, hideValue:true},
            // in microseconds
            {label: 'acting rate:', attr: 'actingRate',   min: 1, max: 10000, step: 10, hideValue:true},
        ];

        let inputs = params.map((params) => {
            return (<NumberInputTag key={params.attr}
                                    objectToUpdate={this.props.agent}
                                    updateMethod={this.props.updateAgent}
                                    params={params} />);
        })

        return (
            <div>{inputs}</div>
        );
    }
}

class EligibilityTrace extends Component {
    render () {
        let {agent, updateAgent} = this.props;
        let params = {
            label: 'etrace:', attr: 'etraceType', options: [
                {value: 'replacingTrace', text: 'Replacing trace'},
                {value: 'accumulatingTrace', text: 'Accumulating trace'}
            ]
        };

        return (
            <div>
                <SelectTag objectToUpdate={agent} updateMethod={updateAgent} params={params} />
            </div>
        );
    }
}


class AgentParamsCtrl extends Component {
    render() {
        let {agent, updateAgent} = this.props;
        return (
            <div>
                <GreekLetterParams agent={agent} updateAgent={updateAgent} />
                <EligibilityTrace agent={agent} updateAgent={updateAgent} />
                <OtherParams agent={agent} updateAgent={updateAgent} />
            </div>
        );
    }
}


class AgentExperience extends Component {
    render () {
        return (
            <div>
                <Col className="nopadding" md={3}>
                    # episodes:
                </Col>
                <Col className="nopadding" md={3}>
                    <span className="text-primary">{this.props.agent.numEpisodesExperienced}</span>
                </Col>
                <Col className="nopadding" md={3}>
                    # steps:
                </Col>
                <Col className="nopadding" md={3}>
                    <span className="text-primary">{this.props.agent.numStepsCurrentEpisode}</span>
                </Col>
            </div>
        );
    }
}

class AgentStatus extends Component {
    render() {
        return (
            <div>
                <h4>Agent:</h4>
                <AgentExperience agent={this.props.agent} />
                <AgentParamsCtrl agent={this.props.agent} updateAgent={this.props.updateAgent} />
            </div>
        );
    }
}


class EnvDimensions extends Component {
    render () {
        let {env, updateEnv} = this.props;

        let allowedDimensions = [3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
            return {value:i, text:i}
        });

        let numRowsParams = {
            label: '# rows:', attr: 'numRows', options: allowedDimensions,
        };

        let numColsParams = {
            label: '# cols:', attr: 'numCols', options: allowedDimensions,
        };

        let stepRewardParams = {
            label: 'step reward: ', attr: 'stepReward',
            min: -1, max: 1, step: 0.01, hideValue:true
        };

        return (
            <div>
                <SelectTag objectToUpdate={env} updateMethod={updateEnv} params={numRowsParams} />
                <SelectTag objectToUpdate={env} updateMethod={updateEnv} params={numColsParams} />
                <NumberInputTag objectToUpdate={env} updateMethod={updateEnv} params={stepRewardParams} />
            </div>
        );
    }
}

class EnvStatus extends Component {
    render () {
        let {env, updateEnv} = this.props;
        return (
            <div>
                <h4>Environment:</h4>
                <EnvDimensions env={env} updateEnv={updateEnv} />
            </div>
        );
    }
}


class CellStatus extends Component {
    render () {
        let {env, updateEnv, selectedState, setSelectedStateAs, adjustSelectedStateReward} = this.props;
        let disabled = selectedState === null? true: false;
        let sliderReward = selectedState === null? 0: selectedState.reward;

        return (
            <div>
                <h4>Cell: </h4>
                <div className="row">
                    <ButtonToolbar style={{display: 'inline-block', verticalAlign: 'middle'}}>
                        {/* bind() seems to have to be used everytime the function is passed */}
                        <Button bsStyle='primary' disabled={disabled} onClick={setSelectedStateAs.bind(this, 'startingState')}>Starting state</Button>
                        <Button bsStyle='primary' disabled={disabled} onClick={setSelectedStateAs.bind(this, 'terminalState')}>Terminal state</Button>
                        <Button bsStyle='primary' disabled={disabled} onClick={setSelectedStateAs.bind(this, 'cliff')}>Cliff</Button>
                    </ButtonToolbar>
                </div>

                <div className="row">
                    <Col className="nopadding" md={3}>Adjust reward: </Col>
                    <Col className="slider selected-reward" md={6}>
                        <input type="range" min="-1" max="1" disabled={disabled} value={sliderReward}
                               step="0.01" onChange={adjustSelectedStateReward.bind(this)}/>
                    </Col>
                </div>
            </div>
        );
    }
}


class UserCtrlButtons extends Component {
    render() {
        let handleClick = this.props.handleClick;
        let buttons = ['act', 'toggle', 'learn', 'reset'].map((str) => {
            let text = str.charAt(0).toUpperCase() + str.slice(1)
            return (
                <Button className="control user-control" key={str}
                        bsStyle='primary'
                        onClick={handleClick.bind(this, str)}>
                    {text}
                </Button>
            );
        });

        return (
            <div>{buttons}</div>
        );
    }
}

class LegendsCtrlButtons extends Component {
    render() {
        let handleClick = this.props.handleClick;

        let buttons = [
            {key: 'qValue', text: 'Q value'},
            {key: 'stateId', text: 'State ID'},
            {key: 'stateCoord', text: 'State Coordinates'},
            {key: 'reward', text: 'Reward'},
            {key: 'policy', text: 'Policy'},
            {key: 'etrace', text: 'EligibilityTrace'}
        ].map((obj) => {
            return (
                <Button className="control legend-control" key={obj.key}
                        bsStyle='success'
                        onClick={handleClick.bind(this, obj.key)}>
                    {obj.text}
                </Button>
            );
        });

        return (
            <div>
                Legends: {buttons}
            </div>
        );
    }
}

class Dashboard extends Component {
    render() {
        let {agent, selectedState, updateAgent, updateEnv, 
             handleUserCtrlButtonClick, toggleLegend,
             setSelectedStateAs, adjustSelectedStateReward} = this.props;
        return (
            <div className="dashboard">
                <Row className="dashboard-row">
                    <Col className="agent-control" xs={12} md={4}>
                        <AgentStatus agent={agent} updateAgent={updateAgent} />
                    </Col>


                    <Col xs={12} md={8}>
                        <Row className="dashboard-row">
                            <Col className="env-control" xs={12} md={4}>
                                <EnvStatus env={agent.env} updateEnv={updateEnv} />
                            </Col>

                            <Col className="cell-control" xs={12} md={8}>
                                <CellStatus env={agent.env} updateEnv={updateEnv} selectedState={selectedState}
                                            setSelectedStateAs={setSelectedStateAs}
                                            adjustSelectedStateReward={adjustSelectedStateReward}/>
                            </Col>
                        </Row>
                        <Row className="dashboard-row">
                            <Col className="nopadding" xs={12} md={3}>
                                <UserCtrlButtons handleClick={handleUserCtrlButtonClick} />
                            </Col>

                            <Col className="nopadding" xs={12} md={9}>
                                <LegendsCtrlButtons handleClick={toggleLegend} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}


export default Dashboard;
