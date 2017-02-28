import React, { Component, PropTypes } from 'react';

import StateIdTxt from './StateIdTxt.jsx';
import StateCoordTxt from './StateCoordTxt.jsx';
import StateRewardTxt from './StateRewardTxt.jsx';
import StateValueTxt from './StateValueTxt.jsx';
import PiBasedPolicyArrows from './PiBasedPolicyArrows.jsx';
import ETrace from './ETrace.jsx';

import {genRGBColorString} from '../../utils.js';

// A basic clickable cell like below, inherited to more complicated cell types
// or cliffs. the effect after click is defined in props.handleClick. React
// doesn't supposrt onClick for svg element yet
// https://facebook.github.io/react/docs/dom-elements.html#all-supported-svg-attributes
// So has to make it up

//      <---width--->
// (x,y)+-----------+ ˄
//      |           | |
//      |           | |
//      |           | height
//      |           | |
//      |           | |
//      +-----------+ ˅

class Cell extends Component {
    // How to make it clickable
    // http://stackoverflow.com/questions/33878115/react-svg-how-do-i-make-path-support-onclick
    componentDidMount() {
        this.rect.addEventListener('click', this.props.handleClick);
    }

    componentWillUnmount(){
        this.rect.removeEventListener('click', this.props.handleClick);
    }

    render () {
        const {state, legendsCtrl} = this.props;
        const {xmin, ymin, xmax, ymax} = state.coords;
        const height = ymax - ymin;
        const width = xmax - xmin;
        const fillColor = genRGBColorString(state.V);

        return (
            <g className="cell">
                {legendsCtrl.stateId
                 ? <StateIdTxt  x={xmax} y={ymin} stateId={state.id} />
                 : null}

                {legendsCtrl.stateCoord
                 ? <StateCoordTxt  x={xmin} y={ymin} coordX={state.x} coordY={state.y} />
                 : null}

                {legendsCtrl.reward
                 ? <StateRewardTxt x={xmax} y={ymax} reward={state.reward} />
                 : null}

                {legendsCtrl.stateValue
                 ? <StateValueTxt x={xmin} y={ymax} stateValue={state.V} />
                 : null}

                {legendsCtrl.policy
                 ? <PiBasedPolicyArrows state={state} arrowHeadDefId={this.props.arrowHeadDefId} />
                 : null}

                {legendsCtrl.etrace
                 ? <ETrace coords={state.coords} zVal={state.Z} />
                 : null}

                <rect x={xmin}
                      y={ymin}
                      height={height}
                      width={width}

                      ref={(ref) => {this.rect = ref;}}

                      stroke="black"
                      strokeWidth={0.2}
                      fillOpacity={0.2}
                      fill={fillColor}
                      cursor="pointer"
                >
                </rect>
            </g>
        );
    }
}

Cell.propTypes = {
    handleClick: PropTypes.func.isRequired
};

Cell.defaultProps = {
    legendsCtrl: {}
};


export default Cell;
