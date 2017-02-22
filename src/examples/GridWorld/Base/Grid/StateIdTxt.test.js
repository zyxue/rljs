import React from 'react';
import {mount, render, shallow} from 'enzyme';

import StateIdTxt from './StateIdTxt.jsx';


// Compare and see the difference among shallow, mount and render.
// The later two seems to have the same effect

it('shallow <StateIdTxt />', () => {
    const wrapper = shallow(<StateIdTxt x={1.5} y={2.1} stateId={99} />);
    expect(wrapper.prop('x')).toEqual(1.5);
    expect(wrapper.prop('y')).toEqual(2.1);
    expect(wrapper.prop('stateId')).toBeUndefined();

    expect(wrapper.prop('textAnchor')).toBe('end');
    expect(wrapper.prop('dominantBaseline')).toBe('text-before-edge');
    expect(wrapper.prop('fontSize')).toBe('.7em');
    expect(wrapper.prop('fill')).toBe('blue');
});


it('render <StateIdTxt />', () => {
    const wrapper = mount(<StateIdTxt x={1.5} y={2.1} stateId={99} />);
    expect(wrapper.prop('x')).toEqual(1.5);
    expect(wrapper.prop('y')).toEqual(2.1);
    expect(wrapper.prop('stateId')).toBe(99);

    expect(wrapper.prop('textAnchor')).toBeUndefined();
    expect(wrapper.prop('dominantBaseline')).toBeUndefined();
    expect(wrapper.prop('fontSize')).toBeUndefined();
    expect(wrapper.prop('fill')).toBeUndefined();
});


it('mount <StateIdTxt />', () => {
    const wrapper = mount(<StateIdTxt x={1.5} y={2.1} stateId={99} />);
    expect(wrapper.prop('x')).toEqual(1.5);
    expect(wrapper.prop('y')).toEqual(2.1);
    expect(wrapper.prop('stateId')).toBe(99);

    expect(wrapper.prop('textAnchor')).toBeUndefined();
    expect(wrapper.prop('dominantBaseline')).toBeUndefined();
    expect(wrapper.prop('fontSize')).toBeUndefined();
    expect(wrapper.prop('fill')).toBeUndefined();
});
