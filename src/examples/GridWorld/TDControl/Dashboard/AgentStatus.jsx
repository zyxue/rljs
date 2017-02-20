import React, {Component} from 'react';

import AgentExperience from './AgentExperience.jsx'
import AgentParamsCtrl from './AgentParamsCtrl.jsx'

class AgentStatus extends Component {
    render() {
        return (
            <div>
                <h5>Agent:</h5>
                <AgentExperience agent={this.props.agent} />
                <AgentParamsCtrl agent={this.props.agent} updateAgent={this.props.updateAgent} />
            </div>
        );
    }
}

export default AgentStatus;
