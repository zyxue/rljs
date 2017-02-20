import React, { Component, PropTypes } from 'react';


class CellFrame extends Component {
    propTypes: {
        x: PropTypes.number,
        y: PropTypes.number,
        height: PropTypes.number,
        width: PropTypes.number
    }

   //http://stackoverflow.com/questions/33878115/react-svg-how-do-i-make-path-support-onclick
    componentDidMount() {
        this.rect.addEventListener('click', this.props.onClick);
    }

    componentWillUnmount(){
        this.rect.removeEventListener('click', this.props.onClick);
    }

    // simply a rectangle around a state cell
    render() {
        const {x, y, height, width, updateSelectedStateId} = this.props;
        return (
            <rect x={x} y={y}
                  height={height} width={width}
                  ref={ref => this.rect = ref}
                  stroke="black"
                  strokeWidth={0.2}
                  fillOpacity={0}
                  cursor="pointer"
            >
            </rect>
        );
    }
}

export default CellFrame;
