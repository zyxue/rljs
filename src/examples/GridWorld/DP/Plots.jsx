import React from 'react';

import Line from '../Components/Plot/Line.jsx';


class Plots extends React.Component {
    render() {
        const {agent} = this.props;

        return (
            <div>
                <Line
                    height={150}
                    width={300}
                    margin={{top:0, left: 40, bottom:30}}
                    id={'policy-iteration-delta'}
                    data={agent.deltasPolIter}
                    xlabel={'# sweeps'}
                    ylabel={'pol iter delta'}
                />


                <Line
                    height={150}
                    width={300}
                    margin={{top:0, left: 40, bottom:30}}
                    id={'value-iteration-delta'}
                    data={agent.deltasValIter}
                    xlabel={'# sweeps'}
                    ylabel={'val iter delta'}
                />
            </div>
        );
    }
}


export default Plots;
