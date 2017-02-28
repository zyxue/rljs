import React from 'react';
import {Row, Col} from 'react-bootstrap';

import Env from '../Env.js';
import {TDCtrlAgent} from '../../../lib/Reinforce-js';

import View from '../DP/View.jsx';
import Grid from '../DP/Grid.jsx';
// import Dashboard from './Dashboard.jsx';
import Intro from './Intro.jsx';

import './View.css';


class TDCtrlView extends View {
    constructor() {
        super();
        let env = new Env();
        let agent = new TDCtrlAgent(env);

        this.state = {
            agent: agent,
            env: env,
            selectedStateId: null,
            legendsCtrl: {
                qValue: false,
                stateId: true,
                stateCoord: false,
                reward: true,
                policy: false, // show policy as arrows
                etrace: true
            }
        };
    }

    render() {
        const grid = (
                <Grid
                    height={600}
                    width={700}
                    cellType={'qCell'}
                    id="grid-TD-control"
                    agent={this.state.agent}
                    legendsCtrl={this.state.legendsCtrl}
                    selectedStateId={this.state.selectedStateId}
                    handleCellClick={this.hdlCellClick.bind(this)}
                    legendsCtrl={this.state.legendsCtrl}
                />
        );

        return (
            <div>
                {/* <Row className="dashboard">
                    {dashboard}
                    </Row> */}
                
                <Row>
                    <Col className='grid'  xs={12} md={8} >
                        {grid}
                    </Col>
                    <Col className='plots' xs={12} md={4} >
                        {/* <div>{numStepsVsNumEpisodesPlot}</div>
                            <div>{etracePlots}</div> */}
                    </Col>
                </Row>

                <Row>
                    <div><Intro /></div>
                </Row>
            </div>
        );
    }
}


export default TDCtrlView;
