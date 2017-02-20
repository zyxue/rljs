import React, {Component} from 'react';
import {Col} from 'react-bootstrap';

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


export default AgentExperience;
