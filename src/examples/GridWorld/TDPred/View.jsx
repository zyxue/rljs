import React from 'react';
import {Row, Col} from 'react-bootstrap';

import Env from '../Env.js';
import {TDPredAgent} from '../../../lib/Reinforce-js';

// use the same grid from DP since they are all for prediction only
import View from '../DP/View.jsx';
import Grid from '../DP/Grid.jsx';
import Dashboard from './Dashboard.jsx';
import Plots from './Plots.jsx';
import Intro from './Intro.jsx';


class TDPredView extends View {
    constructor(props) {
        super(props);
        const env = new Env();
        const agent = new TDPredAgent(env);

        this.state = {
            agent: agent,
            env: env,
            selectedStateId: null,
            legendsCtrl: {
                stateId: true,
                stateCoord: false,
                reward: true,
                stateValue: true,
                etrace: true
            }
        };
    }

    updateAgent(attr, value) {
        let agent = this.state.agent;
        console.debug('updated ' + attr + ' to ' + value);
        agent[attr] = value;
        this.setState({agent: agent});
    }

    startLearning() {
        const actingRate = 1;
        const A = this.state.agent;
        const intervalId = setInterval (() => {
            A.act();
            this.setState({agent: A});
        }, actingRate);
        this.setState({intervalId: intervalId});
    }

    hdlAgentBtnClick(action) {
        const A = this.state.agent;
        switch(action) {
            case 'takeOneStep':
                A.act();
                break;
            case 'learnFromOneEpisode':
                A.learnFromOneEpisode();
                break;
            case 'learnFromMultipleEpisodes':
                A.learnFromMultipleEpisodes();
                break;
            case 'toggleLearning':
                this.toggleLearning();
                break;
            case 'reset':
                A.reset();
                break;
            default:
                console.log('action unspecified or unrecognized: ', action);
        }
        this.setState({agent: A});
    }


    render() {
        return (
            <div>
                <Row className="dashboard">
                    <Dashboard agent={this.state.agent}
                               updateAgent={this.updateAgent.bind(this)}
                               hdlAgentBtnClick={this.hdlAgentBtnClick.bind(this)}
                               updateEnv={this.updateEnv.bind(this)}
                               selectedStateId={this.state.selectedStateId}
                               hdlCellBtnClick={this.hdlCellBtnClick.bind(this)}
                               hdlCellRewardAdjustment={this.hdlCellRewardAdjustment.bind(this)}
                               legendsCtrl={this.state.legendsCtrl}
                               toggleLegend={this.toggleLegend.bind(this)}
                    />
                </Row>

                <Row>
                    <Col className='grid'  xs={12} md={8} >
                        <Grid height={600}
                              width={700}
                              id="grid-TD-control"
                              agent={this.state.agent}
                              selectedStateId={this.state.selectedStateId}
                              handleCellClick={this.hdlCellClick.bind(this)}
                              legendsCtrl={this.state.legendsCtrl}
                        />
                    </Col>

                    <Col className='plots' xs={12} md={4} >
                        <Plots agent={this.state.agent} selectedStateId={this.state.selectedStateId} />
                    </Col>
                </Row>

                <Intro />
            </div>
        );
    }
}


export default TDPredView;
