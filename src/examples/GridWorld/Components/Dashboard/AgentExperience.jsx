import React, {Component} from 'react';


class AgentExperience extends Component {
    render () {
        const exp = this.props.experienceData.map(([label, value], idx) => {
            return <div key={idx}>{label}: {value} </div>;
        });

        return <div>{exp}</div>;
    }
}


export default AgentExperience;
