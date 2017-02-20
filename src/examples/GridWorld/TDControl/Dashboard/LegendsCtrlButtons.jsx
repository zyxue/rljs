import React, {Component} from 'react';
import {Row, Col, Button, ButtonToolbar} from 'react-bootstrap';


class LegendsCtrlButtons extends Component {
    render() {
        let handleClick = this.props.handleClick;

        let buttons = [
            {key: 'qValue', text: 'Q value'},
            {key: 'stateId', text: 'State ID'},
            {key: 'stateCoord', text: 'State Coordinates'},
            {key: 'reward', text: 'Reward'},
            {key: 'policy', text: 'Policy'},
            {key: 'etrace', text: 'EligibilityTrace'}
        ].map((obj) => {
            return (
                <Button className="control legend-control" key={obj.key}
                        bsStyle='success' bsSize="xsmall"
                        onClick={handleClick.bind(this, obj.key)}>
                    {obj.text}
                </Button>
            );
        });

        return (
            <div>
                <h5>Legends control:</h5>
                <div>{buttons}</div>
            </div>
        );
    }
}

export default LegendsCtrlButtons;
