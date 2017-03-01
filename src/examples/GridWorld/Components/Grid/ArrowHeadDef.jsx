import React, { Component, PropTypes } from 'react';


class ArrowHeadDef extends Component {
    propTypes: {
        markerId: PropTypes.string
    }

    render () {
        return (
            <defs>
                <marker id={this.props.markerId}
                        markerWidth="10"
                        markerHeight="10"
                        refX="0"
                        refY="2"
                        orient="auto"
                        markerUnits="strokeWidth">
                    <path d="M0,0 L0,4 L4,2 z"
                          fill="black" />
                </marker>
            </defs>
        );
    }
}

export default ArrowHeadDef;
