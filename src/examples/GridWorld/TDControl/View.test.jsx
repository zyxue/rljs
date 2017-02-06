import React from 'react';
import { shallow } from 'enzyme';

import View from './View';
import Dashboard from './Dashboard';
import Grid from './Grid';


it('renders 1 <Dashboard /> & 1 <Grid /> components', () => {
    const wrapper = shallow(<View />);
    // renders 1 Dashboard & 1 Grid
    expect(wrapper.find(Dashboard).length).toBe(1);
    expect(wrapper.find(Grid).length).toBe(1);
});
