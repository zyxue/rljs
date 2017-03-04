import React, {Component, PropTypes} from 'react';

import Line from '../Components/Plot/Line.jsx';


export class EligibilityTracePlots extends React.Component {
    render() {
        let ACTION_MAP = {'left': '←', 'up': '↑', 'right': '→', 'down': '↓'};

        let {height, width} = this.props;
        let heightPerPlot = height / 4;
        let st = this.props.selectedState;
        let numActions = st.allowedActions.length;

        let plots = st.allowedActions.map((aid, idx) => {
            let xlabel = aid === st.allowedActions[st.allowedActions.length - 1]? 'Step' : '';
            let key = "epiHistZ-state" + st.id + '-action-' + aid;
            let margin = {top:20, left: 40, bottom:0};
            if (idx == numActions - 1) margin['bottom'] += 20;
            return (
                <div key={key}>
                    <Line
                        height={heightPerPlot}
                        width={width}
                        margin={margin}
                        id={key}
                        data={st.epiHistZ[aid]}
                        title={'Z at State ' + st.id + ', action: ' + ACTION_MAP[aid]}
                        xlabel={xlabel}
                        ylabel={'Z'}
                    />
                </div>
            );

        });
        
        return (
            <div>
                {plots}
            </div>
        );
    }
}


export class NumStepsPerEpisodePlot extends React.Component {
    render() {
        const {data, height, width} = this.props;
        return (
            <Line
                height={height}
                width={width}
                margin={{top:0, left: 40, bottom:30}}
                id={'TD-num-steps-per-episode'}
                data={data}
                xlabel={'# episodes'}
                ylabel={'# steps'}
            />
        );
    }
}
