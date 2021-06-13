import React from 'react';
import DriverChart from '../components/DriverChart';
import renderer from 'react-test-renderer';

let drivers = [[true, 'Driver1', '']]

describe('DriverChart', () => {
  window.URL.createObjectURL = jest.fn();

  afterEach(() => {
    window.URL.createObjectURL.mockReset();
  });

  it('should render the DriverChart Component correctly', () => {
    const component = renderer.create(<DriverChart drivers={drivers} acceleration={[]} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
})