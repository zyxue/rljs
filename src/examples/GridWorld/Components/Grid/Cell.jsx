import React, { Component, PropTypes } from 'react';

import StateIdTxt from './StateIdTxt.jsx';
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
        const {state, legCtrl} = this.props;
        const {xmin, ymin, xmax, ymax} = state.coords;
        const height = ymax - ymin;
        const width = xmax - xmin;
        const fillColor = genRGBColorString(state.V);

        return (
            <g className="cell">
                {legCtrl.stateCoord ? <StateCoordTxt  x={xmin} y={ymin} coordX={state.x} coordY={state.y} />      : null}
                {legCtrl.stateId    ? <StateIdTxt     x={xmax} y={ymin} stateId={state.id} />                     : null}
                {legCtrl.reward     ? <StateRewardTxt x={xmax} y={ymax} reward={state.reward} />                  : null}
                {legCtrl.policy     ? <PolicyArrows   state={state} arrowHeadDefId={this.props.arrowHeadDefId} /> : null}
                {<StateIdTxt     x={xmax} y={ymin} stateId={state.V} />}
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
    legCtrl: {}
};


export default Cell;
