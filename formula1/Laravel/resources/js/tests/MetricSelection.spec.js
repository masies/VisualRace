import React from 'react';
import { shallow, mount } from 'enzyme';
import MetricSelection from '../components/MetricSelection';


let metricButtons = {
  speed: {
    show: true,
    variant: 'contained'
  }
}


let metricButtons2 = {
  throttle: {
    show: true,
    variant: 'contained'
  }
}

const toggleButton = jest.fn()

let wrapped = mount(<MetricSelection handler={toggleButton} metricButtons={metricButtons} />);
let wrapped_shallow = shallow(<MetricSelection handler={toggleButton} metricButtons={metricButtons} />);

describe('MetricSelection', () => {
  it('should render the MetricSelection Component correctly', () => {
    expect(wrapped_shallow).toMatchSnapshot();
  });

  it('button click should toggle metric selection', () => {

    wrapped.find('button').simulate('click')
    expect(toggleButton).toHaveBeenCalled()
  })

  it('button text should match metric name', () => {
    expect(wrapped.find('button').text()).toEqual('speed')
  })

  it('should change buttons state when props change', () => {
    wrapped.setProps({ metricButtons: metricButtons2 })
    expect(wrapped.find('button').text()).toEqual('throttle')

  })

});