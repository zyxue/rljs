import React, {Component} from 'react';
import {Row, Col, Button, ButtonToolbar} from 'react-bootstrap';


class LegendsCtrlButtons extends Component {
    render() {
        const {handleClick, legendsCtrl} = this.props;

        const buttons = [
            {key: 'qValue', text: 'Q value'},
            {key: 'stateId', text: 'State ID'},
            {key: 'stateCoord', text: 'State Coordinates'},
            {key: 'reward', text: 'Reward'},
            {key: 'policy', text: 'Policy'},
            {key: 'etrace', text: 'EligibilityTrace'}
        ].map((obj) => {
            return (
                <Button className="control legend-control" key={obj.key}
                        style={{backgroundColor: legendsCtrl[obj.key] ? '' : 'red'}}
                        bsStyle='success'
                        bsSize="xsmall"
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
