import React from 'react';
import { shallow, mount } from 'enzyme';
import PilotSelection from '../components/PilotSelection';

let drivers = {
  "Driver1": {
    name: "Driver1",
    data: {
      speed: [],
      rpm: [],
      throttle: [],
      coordinates: [],
      acceleration: [],
      coolant: [],
    },
    checked: true,
    buttonVariant: 'contained'
  }
}

let drivers2 = {
  "Driver2": {
    name: "Driver2",
    data: {
      speed: [],
      rpm: [],
      throttle: [],
      coordinates: [],
      acceleration: [],
      coolant: [],
    },
    checked: true,
    buttonVariant: 'outlined'
  }
}

const toggleButton = jest.fn()

let wrapped = mount(<PilotSelection handler={toggleButton} drivers={drivers} />);
let wrapped_shallow = shallow(<PilotSelection handler={toggleButton} drivers={drivers} />);

describe('PilotSelection', () => {
  it('should render the PilotSelection Component correctly', () => {
    expect(wrapped_shallow).toMatchSnapshot();
  });

  it('button click should toggle pilot selection', () => {

    wrapped.find('button').simulate('click')
    expect(toggleButton).toHaveBeenCalled()
  })

  it('button text should match pilots name', () => {
    expect(wrapped.find('button').text()).toEqual('Driver1')
  })

  it('should change buttons state when props change', () => {
    wrapped.setProps({ drivers: drivers2 })
    expect(wrapped.find('button').text()).toEqual('Driver2')

  })

});