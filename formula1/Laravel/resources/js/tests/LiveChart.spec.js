import React from 'react';
import LiveChart from '../components/LiveChart';
import renderer from 'react-test-renderer';


describe('LiveChart', () => {
  it('should render the LiveChart Component correctly', () => {
    const component = renderer.create(<LiveChart max={0} firstSeries={[]} colors={[]} drivers={[]} maxYScale={160} minYScale={0} id={"Speed"} data={[]} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
})