import React, {Component} from 'react';
import {Row, Col, Button, ButtonToolbar} from 'react-bootstrap';


class CellStatus extends Component {
    render () {
        let {selectedState, setSelectedStateAs, adjustSelectedStateReward} = this.props;
        let disabled = selectedState === null? true: false;
        let sliderReward = selectedState === null? 0: selectedState.reward;

        let buttons = [
            {key: 'startingState', text: 'Starting state'},
            {key: 'terminalState', text: 'Terminal state'},
            {key: 'cliff', text: 'Cliff'}
        ].map((obj) => {
            let {key, text} = obj;
            {/* bind() seems to have to be used everytime the function is passed */}
            return <Button key={key}
                           disabled={disabled}
                           bsStyle='warning' bsSize='xsmall'
                           onClick={setSelectedStateAs.bind(this, key)}>{text}</Button>
        });

        return (
            <div>
                <h5>Cell: </h5>
                <div className='dashboard-container'>
                    <ButtonToolbar style={{display: 'inline-block', verticalAlign: 'middle'}}>
                        {buttons}
                    </ButtonToolbar>
                </div>

                <div>
                    <Col className="nopadding" md={3}>Adjust reward: </Col>
                    <Col className="slider-container selected-reward" md={6}>
                        <input className='slider'
                               type="range" min="-1" max="1" disabled={disabled} value={sliderReward}
                               step="0.01" onChange={adjustSelectedStateReward.bind(this)}/>
                    </Col>
                </div>
            </div>
        );
    }
}


export default CellStatus;
