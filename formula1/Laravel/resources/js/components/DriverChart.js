import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Plot from 'react-plotly.js';


class DriverChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stats: []
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props !== nextProps) {
      let stats = []
      nextProps.drivers.forEach(driver => {
        if (driver[0]) {
          nextProps.acceleration.forEach(data => {
            if (data[0] === driver[1]) {
              stats.push({
                name: driver[1],
                color: driver[2],
                acceleration: data[1],
                r: Math.sqrt(Math.pow(data[1][0], 2), Math.pow(data[1][1], 2)) < 1 ? Math.sqrt(Math.pow(data[1][0], 2), Math.pow(data[1][1], 2)) : 1,
                theta: Math.atan2(data[1][0], data[1][1]) * 180 / Math.PI
              })
            }
          })
        }
      })
      this.setState({ stats: stats })
      return true;
    }
    return false;
  }

  render() {

    return (
      <Grid container direction="row" alignItems="flex-start">
        {
          this.state.stats.map((driver) =>
            <Paper key={driver.name} className="paperClass" style={{ marginBottom: "10px", marginLeft: "10px" }} >
              <Typography variant="subtitle1" align="center" >
                {driver.name}
              </Typography>
              <Typography variant="subtitle1" align="center" >
                current G-Force [g]
                  </Typography>

              <Plot
                data={[
                  {
                    r: [driver.r],
                    theta: [driver.theta],
                    mode: 'markers',
                    marker: {
                      color: driver.color,
                      size: 13,
                    },
                    type: 'scatterpolar',
                  },
                ]}
                layout={{
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  autosize: false,
                  width: 200,
                  height: 200,
                  margin: {
                    l: 50,
                    r: 50,
                    b: 0,
                    t: 0,
                    pad: 0
                  },
                  polar: {
                    bgcolor: 'rgba(0,0,0,0)',
                    radialaxis: {
                      visible: true,
                      range: [0, 1],
                      nticks: 3

                    },
                    angularaxis: {
                      showticklabels: false,
                      categoryarray: ["d", "a", "c", "b"]
                    }
                  },

                  orientation: -90
                }}
                config={{ staticPlot: true }}
              />
            </Paper>
          )
        }
      </Grid>
    )
  }
}

export default DriverChart;