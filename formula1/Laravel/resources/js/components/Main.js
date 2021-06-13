import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LiveChart from './LiveChart';
import PilotSelection from './PilotSelection'
import Circuit from './Circuit'
import DriverChart from './DriverChart'
import Icon from '@material-ui/core/Icon';
import chroma from 'chroma-js'
import Skeleton from '@material-ui/lab/Skeleton';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// import 'typeface-roboto';
import Button from '@material-ui/core/Button';
import MetricSelection from './MetricSelection';

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const greenTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#2a9d8f',
    },
  },
});

const blueTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#4395B3'
    }
  },
});

const redTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#e76f51'
    }
  },
});



import '../css/main.css';


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {

      drivers: {},

      race:"Nuvolari",

      intervalRequestID: null,
      intervalRequestTime: 2000,
      intervalStreamID: null,
      intervalStreamTime: 100,

      gotData: false,
      currentTime: 200,

      stream_data: {
        coolant: [],
        speed : [],
        rpm : [],
        throttle : [],
        coordinates : [],
        acceleration : [],
      },

      metricButtons: {
        speed: {
          show: true,
          variant: 'contained'
        },
        rpm: {
          show: false,
          variant: 'outlined'
        },
        throttle: {
          show: false,
          variant: 'outlined'
        },
        coolant: {
          show: false,
          variant: 'outlined'
        },
      },

      simulationButtons: {
        start: {
          variant: 'outlined'
        },
        stop: {
          variant: 'contained'
        }
      }

    };

    this.handleDriverCheck = this.handleDriverCheck.bind(this);
    this.handleMetricCheck = this.handleMetricCheck.bind(this);
  }

  handleDriverCheck(buttonId) {
    let drivers = this.state.drivers
    if (drivers[buttonId].checked) {
      drivers[buttonId].checked = false
      drivers[buttonId].buttonVariant = 'outlined'
    }
    else {
      drivers[buttonId].checked = true
      drivers[buttonId].buttonVariant = 'contained'
    }

    this.setState({ drivers });
  }

  getDrivers() {
    let selectedDrivers = []
    for (let [key, value] of Object.entries(this.state.drivers)) {
      if (value.checked) {
        selectedDrivers.push([true, key, value.color])
      } else {
        selectedDrivers.push([false, key, value.color])
      }
    }
    return selectedDrivers
  }

  getDriversNames() {
    let driversNames = []
    for (let [key, value] of Object.entries(this.state.drivers)) {
      driversNames.push(key)
    }
    return driversNames
  }

  getDriversColors() {
    let driversColors = []
    for (let [key, value] of Object.entries(this.state.drivers)) {
      driversColors.push(value.color)
    }
    return driversColors
  }

  getNewData() {
    let drivers = this.state.drivers
    var firstDriver = drivers[Object.keys(drivers)[0]]
    if (firstDriver.data.speed.length < 200) {
      let secondToFetch = 5;

      fetch(`/api/timeWindow?field=Race,Coolant,InlineAcc,LateralAcc,coordinates,Driver,RPM,Throttle,TimeStamp,GPS_Speed&start=${this.state.currentTime}&end=${this.state.currentTime+secondToFetch}&driver=${this.getDriversNames().toString()}&race_id=${this.state.race}`)
      .then(response => response.json())
      .then(data => {
        data.hits.hits.forEach(x => {
            let speedPoint = [x._source.TimeStamp,x._source.GPS_Speed]
            let throttlePoint = [x._source.TimeStamp,x._source.Throttle]
            let RPMPoint = [x._source.TimeStamp,x._source.RPM]
            let CoolantPoint = [x._source.TimeStamp,x._source.Coolant]
            let coordinates = x._source.coordinates
            let acceleration = [x._source.InlineAcc, x._source.LateralAcc]
            let pilotName = x._source.Driver

            drivers[pilotName].data = {
              speed : drivers[pilotName].data.speed.concat([speedPoint]),
              rpm : drivers[pilotName].data.rpm.concat([RPMPoint]),
              throttle : drivers[pilotName].data.throttle.concat([throttlePoint]),
              coordinates : drivers[pilotName].data.coordinates.concat([coordinates]),
              acceleration : drivers[pilotName].data.acceleration.concat([acceleration]),
              coolant: drivers[pilotName].data.coolant.concat([CoolantPoint]),
            }
          })
          this.setState({ drivers: drivers, gotData: true, currentTime: this.state.currentTime + secondToFetch + 0.1 });
        })
    }
  }

  UNSAFE_componentWillMount() {
    let initialDrivers = []
    fetch(`/api/raceInfo?race_id=${this.state.race}`)
    .then(response => response.json())
    .then(data => {
      initialDrivers = data[0]._source.Drivers

      let drivers = {}
      for (var i = 0; i < initialDrivers.length; i++) {
        drivers[initialDrivers[i]] = {
          name: initialDrivers[i],
          data:{
            speed : [],
            rpm : [],
            throttle : [],
            coordinates : [],
            acceleration : [],
            coolant: [],
          },
          checked: (i > 1) ? false : true,
          buttonVariant: (i > 1) ? 'outlined' : 'contained'
        }
      }

      let colors = chroma.scale(["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"]).mode('lch').colors(Object.keys(drivers).length)
      let colorIndex = 0;

      for (let [key, value] of Object.entries(drivers)) {
        drivers[key].color = colors[colorIndex];
        colorIndex++;
      }

      this.setState({ drivers: drivers })
    })
  }

  componentDidMount() {
    let intervalRequestID = setInterval(() => this.getNewData(), this.state.intervalRequestTime);
    let intervalStreamID = setInterval(() => this.setNewData(), this.state.intervalStreamTime);
    this.setState({ intervalStreamID: intervalStreamID, intervalRequestID: intervalRequestID })
  }

  setNewData() {
    if (this.state.gotData) {
      let data_speed = []
      let data_RPM = []
      let data_Throttle = []
      let data_coolant = []
      let coordinates = []
      let acceleration = []

      for (let [key, value] of Object.entries(this.state.drivers)) {
          data_speed.push([key, value.data.speed.shift()])
          data_RPM.push([key, value.data.rpm.shift()])
          data_Throttle.push([key, value.data.throttle.shift()])
          data_coolant.push([key, value.data.coolant.shift()])
          coordinates.push([key, value.color, value.data.coordinates.shift(), value.checked])
          acceleration.push([key,  value.data.acceleration.shift()])
      }

      this.setState({
        stream_data : {
          speed : data_speed ,
          rpm : data_RPM,
          throttle : data_Throttle,
          coolant : data_coolant,
          coordinates : coordinates,
          acceleration : acceleration,
        },
      })
    }
  }


  stopIntervals() {
    if (this.state.intervalRequestID) {
      clearInterval(this.state.intervalRequestID);
      this.setState({ intervalRequestID: null })
    }
    if (this.state.intervalStreamID) {
      clearInterval(this.state.intervalStreamID);
      this.setState({ intervalStreamID: null })
    }

    let simulationButtons = this.state.simulationButtons
    simulationButtons.start.variant = 'contained'
    simulationButtons.stop.variant = 'outlined'
  }

  startIntervals() {
    if (!this.state.intervalRequestID) {
      let intervalRequestID = setInterval(() => this.getNewData(), this.state.intervalRequestTime);
      this.setState({ intervalRequestID: intervalRequestID })
    }
    if (!this.state.intervalStreamID) {
      let intervalStreamID = setInterval(() => this.setNewData(), this.state.intervalStreamTime);
      this.setState({ intervalStreamID: intervalStreamID })
    }

    let simulationButtons = this.state.simulationButtons
    simulationButtons.stop.variant = 'contained'
    simulationButtons.start.variant = 'outlined'
  }

  generateInitSeries() {
    let firstSeries = []
    for (let [key, value] of Object.entries(this.state.drivers)) {
      firstSeries.push({ name: key, data: [], chekced: value.checked })
    }
    return firstSeries
  }

  handleMetricCheck(buttonId) {
    let metricButtons = this.state.metricButtons
    if (metricButtons[buttonId].show) {
      metricButtons[buttonId].show = false
      metricButtons[buttonId].variant = 'outlined'
    }
    else {
      metricButtons[buttonId].show = true
      metricButtons[buttonId].variant = 'contained'
    }
    this.setState({ metricButtons });
  }

  changeRace(event, newAlignment){
    if (newAlignment !== null && this.state.gotData) {
      this.stopIntervals()
      this.setState(this.state = {
                drivers: {},
                race:newAlignment,
                intervalRequestID: null,
                intervalRequestTime: 2000,
                intervalStreamID: null,
                intervalStreamTime: 100,
                gotData: false,
                currentTime: 200,
                stream_data: {
                  coolant: [],
                  speed : [],
                  rpm : [],
                  throttle : [],
                  coordinates : [],
                  acceleration : [],
                },
                metricButtons: {
                  speed: {
                    show: true,
                    variant: 'contained'
                  },
                  rpm: {
                    show: false,
                    variant: 'outlined'
                  },
                  throttle: {
                    show: false,
                    variant: 'outlined'
                  },
                  coolant: {
                    show: false,
                    variant: 'outlined'
                  },
                },
                simulationButtons: {
                  start: {
                    variant: 'outlined'
                  },
                  stop: {
                    variant: 'contained'
                  }
                } 
              })

    let initialDrivers = []
    fetch(`/api/raceInfo?race_id=${this.state.race}`)
    .then(response => response.json())
    .then(data => {
      initialDrivers = data[0]._source.Drivers

      let drivers = {}
      for (var i = 0; i < initialDrivers.length; i++) {
        drivers[initialDrivers[i]] = {
          name: initialDrivers[i],
          data:{
            speed : [],
            rpm : [],
            throttle : [],
            coordinates : [],
            acceleration : [],
            coolant: [],
          },
          checked: (i > 1) ? false : true,
          buttonVariant: (i > 1) ? 'outlined' : 'contained'
        }
      }

      let intervalRequestID = setInterval(() => this.getNewData(), this.state.intervalRequestTime);
      

      let colors = chroma.scale(["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"]).mode('lch').colors(Object.keys(drivers).length)
      let colorIndex = 0;

      for (let [key, value] of Object.entries(drivers)) {
        drivers[key].color = colors[colorIndex];
        colorIndex++;
      }

      this.setState({ drivers: drivers, intervalRequestID: intervalRequestID })
    }).then( () => { 
      let intervalStreamID = setInterval(() => this.setNewData(), this.state.intervalStreamTime);
      this.setState({ intervalStreamID: intervalStreamID })
    })
    }
  };

  render() {
    return (
      <ThemeProvider theme={blueTheme}>
      <Container maxWidth={false} className="Container">
          <Grid container>
            <Grid className="MenuContainer">

              <Typography align='center' variant="h5" >
                <Icon>
                  <img src="logo2.png"/>
                </Icon>
                Visual Race
              </Typography>

              <hr/>
              
              <Typography gutterBottom align='center' variant="h6" >
                Simulation
              </Typography>
              
              <Grid container  justify="space-around">
                <ThemeProvider theme={greenTheme}>
                  <Button onClick={this.startIntervals.bind(this)} color="primary" variant={this.state.simulationButtons.start.variant} >
                    Start
                  </Button>
                </ThemeProvider>
                
                <ThemeProvider theme={redTheme}>
                  <Button onClick={this.stopIntervals.bind(this)} color="primary" variant={this.state.simulationButtons.stop.variant} >
                    Stop
                  </Button>
                </ThemeProvider>
              </Grid>

              <Divider className="divider" />

              <Typography gutterBottom align='center' variant="h6" >
                Drivers
              </Typography>

              <PilotSelection handler={this.handleDriverCheck} drivers={this.state.drivers} />
             
              <Divider className="divider" />

              <Typography gutterBottom align='center' variant="h6">
                Metrics
              </Typography>

              <ThemeProvider theme={blueTheme}>
                <MetricSelection handler={this.handleMetricCheck} metricButtons={this.state.metricButtons} />
              </ThemeProvider>
 
              <Divider className="divider" />
 
              <Typography gutterBottom align='center' variant="h6">
                Race
              </Typography>
            
              <Grid container spacing={2} direction="column" alignItems="center">
                <Grid item>
                <ThemeProvider theme={blueTheme}>
                    <ToggleButtonGroup value={this.state.race} exclusive onChange={this.changeRace.bind(this)}>
                      <ToggleButton value="Varano" >
                        Varano
                      </ToggleButton>
                      <ToggleButton value="Nuvolari">
                        Nuvolari
                      </ToggleButton> 
                    </ToggleButtonGroup>
                  </ThemeProvider>
                </Grid>
              </Grid>
            </Grid>

            <Grid container className="ChartContainer">
              <Grid className="metricsContainer">
                 {
                    !this.state.gotData ?
                      
                      <Skeleton variant="rect" width={"100%"} height={"100%"} />
                      :

                      <Grid>
                        <Container>
                          <Paper className="paperClass">
                            <Circuit race_id={this.state.race} data={this.state.stream_data.coordinates} />
                          </Paper>
                          <Divider className="divider" />
                        </Container>
                        <Container>
                        <Grid className="ChartsInnerContainer">
                        {

                          this.state.metricButtons["speed"].show &&
                          <Box className="boxChart">
                            <Paper className="paperClass" >
                              <LiveChart max={this.state.currentTime} firstSeries={this.generateInitSeries()} colors={this.getDriversColors()} drivers={this.getDrivers()} maxYScale={160} minYScale={0} id={"Speed [Km/h]"} data={this.state.stream_data.speed} />
                            </Paper>
                            <Divider className="divider" />
                          </Box> 
                        }

                        {
                          this.state.metricButtons["rpm"].show &&
                          <Box className="boxChart">
                            <Paper className="paperClass">
                              <LiveChart max={this.state.currentTime} firstSeries={this.generateInitSeries()} colors={this.getDriversColors()} drivers={this.getDrivers()} maxYScale={15000} minYScale={0} id={"Revolutions per minute [rpm]"} data={this.state.stream_data.rpm} />
                            </Paper>
                            <Divider className="divider" />
                          </Box> 
                        }

                        {
                          this.state.metricButtons["throttle"].show &&
                          <Box className="boxChart">
                            <Paper className="paperClass">
                              <LiveChart max={this.state.currentTime} firstSeries={this.generateInitSeries()} colors={this.getDriversColors()} drivers={this.getDrivers()} maxYScale={20} minYScale={0} id={"Throttle [deg]"} data={this.state.stream_data.throttle} />
                            </Paper>
                            <Divider className="divider" />
                          </Box> 
                          
                        }

                        {
                          this.state.metricButtons["coolant"].show &&
                          <Box className="boxChart">
                            <Paper className="paperClass">
                              <LiveChart max={this.state.currentTime} firstSeries={this.generateInitSeries()} colors={this.getDriversColors()} drivers={this.getDrivers()} maxYScale={110} minYScale={60} id={"Coolant [°C]"} data={this.state.stream_data.coolant} />
                              
                            </Paper>
                            <Divider className="divider" />
                          </Box> 
                        }
                        </Grid>
                        </Container>
                      </Grid>
                  }

              </Grid>
 
              <Grid className="driverMetricsContainer">
                {
                  !this.state.gotData ?
                    <Skeleton variant="rect" height={"90vh"} />
                    :
                      <DriverChart drivers={this.getDrivers()} acceleration={this.state.stream_data.acceleration} />                    
                }
              </Grid>
            </Grid>
         </Grid>
       </Container>
       </ThemeProvider>
    );
  }
}

export default Main;

if (document.getElementById('index')) {
  ReactDOM.render(<Main />, document.getElementById('index'));
}
