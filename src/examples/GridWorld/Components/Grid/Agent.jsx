import React, { Component, PropTypes } from 'react';


class Agent extends Component {
    render() {
        const {agentState, agentAction} = this.props;
        const {coords} = agentState;
        const {xmid, ymid} = agentState.coords;
        return (
            <g>
                <AgentAction action={agentAction} coords={coords}></AgentAction>
                <circle cx={xmid}
                        cy={ymid}
                        r="15"
                        fill="#FFD800"
                        fillOpacity="1"
                        stroke="#000"
                        id="cpos"
                        cursor="pointer">
                </circle>
            </g>
        );
    }
}


class AgentAction extends Component {
    genPointsStrForAgentAction(action, coords) {
        let {xmin, ymin, xmid, ymid, xmax, ymax} = coords;

        // a couple of scalers
        let S = 5 / 9;
        let C = 6 / 19;
        let str;
        if (action === 'left') {
            str = (xmid - xmin) * (1 - S) + xmin + ',' + ymid + ' ' +
                  xmid + ',' + (  C * (ymax - ymid) + ymid)  + ' ' +
                  xmid + ',' + (- C * (ymid - ymin) + ymid);

        } else if (action === 'up') {
            str = xmid + ',' + ((ymid - ymin) * (1 - S) + ymin) + ' ' +
                    (- C * (xmid - xmin) + xmid) + ',' + ymid + ' ' +
                        (  C * (xmax - xmid) + xmid) + ',' + ymid;
        } else if (action === 'right') {
            str = (xmax - xmid) * S + xmid  + ',' + ymid + ' ' +
                  xmid + ',' + (  C * (ymax - ymid) + ymid) + ' ' +
                  xmid + ',' + (- C * (ymid - ymin) + ymid);

        } else if (action === 'down') {
            str = xmid + ',' + ((ymax - ymid) * S + ymid) + ' ' +
                    (- C * (xmid - xmin) + xmid) + ',' + ymid + ' ' +
                        (  C * (xmax - xmid) + xmid) + ',' + ymid;
        }
        return str;
    }


    render () {
        const{action, coords} = this.props;
        const pointsStr = this.genPointsStrForAgentAction(action, coords);

        return (
            <polygon points={pointsStr}
                     fill="blue"
                     fillOpacity="1"
                     stroke="black"
                     strokeWidth="0.5">
            </polygon>
        );
    }
}


Agent.PropTypes = {
    agentAction: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Agent;
