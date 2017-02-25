import React, { Component, PropTypes } from 'react';


class Cliff extends Component {
    componentDidMount() {
        this.rect.addEventListener('click', this.props.handleClick);
    }

    componentWillUnmount(){
        this.rect.removeEventListener('click', this.props.handleClick);
    }

    render () {
        const {state, handleClick} = this.props;
        const {xmin, ymin, xmax, ymax} = state.coords;
        const height = ymax - ymin;
        const width = xmax - xmin;

        return  (
            <g>
                <rect x={xmin}
                      y={ymin}
                      height={height}
                      width={width}

                      ref={(ref) => {this.rect = ref;}}

                      stroke="black"
                      strokeWidth={0.2}
                      fillOpacity={0.5}
                      fill='#AAA'
                      cursor="pointer">
                </rect>
            </g>
        );
    }
}


Cliff.propTypes =  {
    handleClick: PropTypes.func.isRequired
};


export default Cliff;
