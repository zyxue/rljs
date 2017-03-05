import React from 'react';
import {Row, Col} from 'react-bootstrap';

import Env from '../Env.js';
import {DynaQAgent} from '../../../lib/Reinforce-js';

import View from '../TDCtrl/View.jsx';
import Grid from '../DP/Grid.jsx';

import Dashboard from './Dashboard.jsx';
import {NumStepsPerEpisodePlot} from '../TDCtrl/Plots.jsx';
import Intro from './Intro.jsx';


class DynaQView extends View  {
    constructor(props) {
        super(props);
        let env = new Env();
        let agent = new DynaQAgent(env);

        this.state = {
            agent: agent,
            env: env,
            selectedStateId: null,

            legendsCtrl: {
                qValue: false,
                stateId: true,
                stateCoord: false,
                reward: true,
                policy: false
            }
        };
    }

    render() {
        return (
            <div>
                <Row>
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
                    <Col className='grid'  xs={12} md={8}>
                        <Grid
                            height={600}
                            width={700}
                            cellType={'qCell'}
                            agent={this.state.agent}
                            legendsCtrl={this.state.legendsCtrl}
                            selectedStateId={this.state.selectedStateId}
                            handleCellClick={this.hdlCellClick.bind(this)}
                        />
                    </Col>
                    <Col className='plots' xs={12} md={4}>
                        <div>
                            <NumStepsPerEpisodePlot data={this.state.agent.numStepsPerEpisode}
                                                    height={150} width={300}
                            />
                        </div>
                        <div>
                            Eligibility Trace is not Considered in the
                            <a href="https://webdocs.cs.ualberta.ca/~sutton/book/ebook/node96.html" target="_blank">
                            Dyna-Q algorithm yet.
                            </a>
                        </div>

                    </Col>
                </Row>

                <Row>
                    <div><Intro /></div>
                </Row>
            </div>
        );
    }
}


export default DynaQView;
