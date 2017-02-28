import React, {Component, PropTypes} from 'react';

import Line from '../Components/Plot/Line.jsx';


class Plots extends Component {
    render() {
        let {agent, selectedStateId} = this.props;
        if (selectedStateId === null) selectedStateId = 0;

        const selectedState = agent.env.states[selectedStateId];
        /* console.debug(selectedStateId, agent.env, selectedState);*/

        return (
            <div>
                <Line
                    height={150}
                    width={300}
                    margin={{top:0, left: 40, bottom:30}}
                    id={'TD-num-steps-per-episode'}
                    data={agent.numStepsPerEpisode}
                    xlabel={'# Episodes'}
                    ylabel={'# steps'}
                />

                <Line
                    height={150}
                    width={300}
                    margin={{top:20, left: 40, bottom: 30}}
                    id={'episodic-etrace-history'}
                    data={selectedState.epiHistZ}
                    title={'History of episodic eligibility trace (Z) at State ' + selectedState.id}
                    xlabel={'Time'}
                    ylabel={'Z'}
                />

                <Line
                    height={150}
                    width={300}
                    margin={{top:20, left: 40, bottom: 30}}
                    id={'TD-etrace'}
                    data={agent.env.states.map((st) => (st.Z))}
                    title={'Serial view of eligibility trace (Z)'}
                    xlabel={'State ID'}
                    ylabel={'Z'}
                />
            </div>
        );
    }
}


export default Plots;
