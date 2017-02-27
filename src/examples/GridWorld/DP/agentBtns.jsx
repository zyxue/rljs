import React, {Component} from 'react';
import {Col, Button, ButtonToolbar} from 'react-bootstrap';


class AgentButtons extends Component {
    render() {
        const btnData = [
            ['evalPolOneSweep', 'Policy evaluation (one sweep)'],
            ['evalPol', 'Policy evaluation (till convergence)'],
            ['togglePolEval', 'Policy evaluation toggle'],
            ['toggleValFuncOptim', 'Value function optimization toggle'],
            ['updatePol', 'Update policy'],
            ['polIter', 'Policy iteration'],
            ['valIter', 'Value iteration'],
            ['reset', 'Reset'],
        ];

        const btns = btnData.map(([key, label]) => {
            return (
                <Button key={key}
                        bsStyle='primary'
                        bsSize='xsmall'
                        onClick={this.props.handleClick.bind(this, key)}>
                    {label}
                </Button>
            );
        });

        return (
            <ButtonToolbar className="wrapped-buttons">
                {btns}
            </ButtonToolbar>
        );
    }
}


export default AgentButtons;
