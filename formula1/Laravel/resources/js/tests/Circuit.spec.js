import React from 'react';
import Circuit from '../components/Circuit';
import renderer from 'react-test-renderer';

describe("Circuit", () => {

  it('should render the Circuit Component correctly', () => {
    const component = renderer.create(<Circuit race_id="Nuvolari" data={[]} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

