import React, {Component} from 'react';

import {GreekLetterParams, OtherParams} from './Params.jsx';
import LearningAlgo from './LearningAlgo.jsx'


class AgentParamsCtrl extends Component {
    render() {
        let {agent, updateAgent} = this.props;
        return (
            <div>
                <GreekLetterParams agent={agent} updateAgent={updateAgent} />
                <LearningAlgo agent={agent} updateAgent={updateAgent} />
                <OtherParams agent={agent} updateAgent={updateAgent} />
            </div>
        );
    }
}


export default AgentParamsCtrl;
