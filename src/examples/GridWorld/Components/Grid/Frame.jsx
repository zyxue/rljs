import React, { Component, PropTypes } from 'react';

// Simply a clickable box like below, the effect after click is defined in
// props.handleClick

//      <---width--->
// (x,y)+-----------+ ˄
//      |           | |
//      |           | |
//      |           | height
//      |           | |
//      |           | |
//      +-----------+ ˅

class Frame extends Component {
    // It appears that svg component does not support onClick yet, so have to make up one
    // https://facebook.github.io/react/docs/dom-elements.html#all-supported-svg-attributes
    // How to make one
    // http://stackoverflow.com/questions/33878115/react-svg-how-do-i-make-path-support-onclick
    componentDidMount() {
        this.rect.addEventListener('click', this.props.handleClick);
    }

    componentWillUnmount(){
        this.rect.removeEventListener('click', this.props.handleClick);
    }

    render() {
        const {x, y, height, width} = this.props;
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

Frame.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    handleClick: PropTypes.func.isRequired
};

Frame.defaultProps = {
    handleClick: () => {console.log('this.props.handleClick is undefined');}
};

export default Frame;

