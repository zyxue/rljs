import React, {Component} from 'react';
import {Row, Col, Button, ButtonToolbar} from 'react-bootstrap';


class CellStatus extends Component {
    setBtn(key, label) {
        let {handleClick, disabled} = this.props;
        return (
            <Button key={key}
                    disabled={disabled}
                    bsStyle='warning'
                    bsSize='xsmall'
                    onClick={handleClick.bind(this, key)}>
                {label}
            </Button>
        );
    }

    render() {
        let {handleSlide, slideVal, disabled} = this.props;
        // let sliderReward = selectedState === null? 0: selectedState.reward;

        let btnData = [
            ['startingState', 'Starting state'],
            ['terminalState', 'Terminal state'],
            ['cliff', 'Cliff']
        ];

        let btns = btnData.map(([key, label]) => {
            return this.setBtn(key, label);
        });

        return (
            <div>
                <h5>Cell: </h5>
                <div className='dashboard-container'>
                    <ButtonToolbar style={{display: 'inline-block', verticalAlign: 'middle'}}>
                        {btns}
                    </ButtonToolbar>
                </div>

                <div>
                    <Col className="nopadding" md={3}>Adjust reward: </Col>
                    <Col className="slider-container selected-reward" md={6}>
                        <input className='slider'
                               type="range" min="-1" max="1" disabled={disabled} value={slideVal}
                               step="0.01" onChange={handleSlide.bind(this)}/>
                    </Col>
                </div>
            </div>
        );
    }
}


export default CellStatus;
