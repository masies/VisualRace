import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

class MetricSelection extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Grid container spacing={1} direction="column" >
        {
          Object.entries(this.props.metricButtons).map((metric) =>
            <Grid container key={metric[0]} direction="column" align="center" style={{ marginBottom: "7px" }}>
              <Button id={metric[0]} onClick={() => this.props.handler(metric[0])} fullWidth={true} variant={metric[1].variant} color="primary">
                {metric[0]}
              </Button>
            </Grid>
          )
        }
      </Grid>
    )
  }
}

export default MetricSelection;