import React, {Component} from 'react';
import {Button, ButtonToolbar} from 'react-bootstrap';


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
                <div>
                    <ButtonToolbar className="wrapped-buttons">
                        {btns}
                    </ButtonToolbar>
                </div>

                <div>
                    <div>Adjust reward: </div>
                    <div className="slider-container selected-reward" >
                        <input className='slider'
                               type="range"
                               min="-5"
                               max="5"
                               disabled={disabled}
                               value={slideVal}
                               step="0.01" onChange={handleSlide.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    }
}


export default CellStatus;
