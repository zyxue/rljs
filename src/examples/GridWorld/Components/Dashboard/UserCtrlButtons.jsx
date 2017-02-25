import React, {Component} from 'react';
import {Row, Col, Button, ButtonToolbar} from 'react-bootstrap';


class UserCtrlButtons extends Component {
    render() {
        let handleClick = this.props.handleClick;
        let buttons = ['act', 'toggle', 'learn', 'reset'].map((str) => {
            let text = str.charAt(0).toUpperCase() + str.slice(1)
            return (
                <Button className="control user-control" key={str}
                        bsStyle='primary' bsSize='xsmall'
                        onClick={handleClick.bind(this, str)}>
                    {text}
                </Button>
            );
        });

        return (
            <div>
                <h5>Main buttons:</h5>
                <div>{buttons}</div>
            </div>
        );
    }
}


export default UserCtrlButtons;
