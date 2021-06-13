import React from 'react';
import { shallow, mount } from 'enzyme';
import Main from '../components/Main';
import renderer from 'react-test-renderer';


describe("Main", () => {

  it('should render the Main Component correctly', () => {
    const component = renderer.create(<Main />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should have Nuvolari as default race', () => {
    let wrapped = shallow(<Main />);
    expect(wrapped.state().race).toEqual('Nuvolari')
  });

});