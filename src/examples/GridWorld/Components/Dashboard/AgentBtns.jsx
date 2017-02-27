import React, {Component, PropTypes} from 'react';
import {Col, Button, ButtonToolbar} from 'react-bootstrap';


class AgentButtons extends Component {
    render() {
        const btns = this.props.btnsData.map(([key, label]) => {
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


AgentButtons.propTypes = {
    btnsData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired
};


export default AgentButtons;
