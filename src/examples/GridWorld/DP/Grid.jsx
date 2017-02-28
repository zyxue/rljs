import React, { Component, PropTypes } from 'react';

import Cell from '../Components/Grid/Cell.jsx';
import Frame from '../Components/Grid/Frame.jsx';
import Cliff from '../Components/Grid/Cliff.jsx';
import StartingState from '../Components/Grid/StartingState.jsx';
import TerminalState from '../Components/Grid/TerminalState.jsx';
import SelectedState from '../Components/Grid/SelectedState.jsx';
import ArrowHeadDef from '../Components/Grid/ArrowHeadDef.jsx';
import Agent from '../Components/Grid/Agent.jsx';
import {calcCoords} from '../utils.js';


class Grid extends Component {
    render () {
        const {height, width, agent, legendsCtrl, selectedStateId, handleCellClick} = this.props;

        // add this to make the border look more symmetric as border lines
        // between neighbouring cells are drawn multiple times
        const frame = [1, 2, 3].map((_, idx) => {
            return <Frame key={idx} x={0} y={0} height={height} width={width} />;
        });

        // add coords per cell to enable drawing inside the cell
        const {numRows, numCols} = agent.env;
        agent.env.states.forEach(function (st) {
            st.coords = calcCoords(
                st.x, st.y, height / numRows, width / numCols);
        });

        const arrowHeadDefId = "arrow-head";
        const grid = agent.env.states.map((state) => {
            if (state.isCliff) {
                return <Cliff key={state.id}
                              state={state}
                              handleClick={handleCellClick.bind(this, state.id)}
                              handleCellClick={handleCellClick} />;
            } else {
                return <Cell  key={state.id}
                           state={state}
                           arrowHeadDefId={arrowHeadDefId}
                           handleClick={handleCellClick.bind(this, state.id)}
                           legendsCtrl={legendsCtrl} />;
            }
        });

        let selectedState = null;
        if (selectedStateId !== null) {
            selectedState = <SelectedState coords={agent.env.states[selectedStateId].coords} />;
        }

        // draw agent if it is model-free
        let agentComp = null;
        if (agent.s0 !== undefined)
            agentComp = <Agent agentState={agent.s0} agentAction={agent.a0} />;

        return (
            <div>
                <svg height={height} width={width}>
                    {frame}
                    <StartingState coords={agent.env.getStartingState().coords} />
                    <TerminalState coords={agent.env.getTerminalState().coords} />
                    {selectedState}
                    <ArrowHeadDef markerId={arrowHeadDefId} />
                    {grid}
                    {agentComp}
                </svg>
            </div>
        );
    }
}

Grid.propTypes = {
    id: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    selectedStateId: PropTypes.number
};

Grid.defaultProps = {
    legCtrl: {},
    handleCellClick: () => {console.error('clickedCellClick is undefined');}
};


export default Grid;
