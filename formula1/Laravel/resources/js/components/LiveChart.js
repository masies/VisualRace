import React from "react";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";


class LiveChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          fontFamily: 'Poppins, Helvetica, Arial, sans-serif',
          // background: '#353941',
          id: this.props.id,
          animations: {
            enabled: true,
            easing: 'linear',
            //   animateGradually: {
            //               enabled: true,
            //               delay: 100
            //           },
            dynamicAnimation: {
              enabled: true,
              speed: 200,
            },
          },

          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        colors: this.props.colors,
        stroke: {
          curve: "smooth",
          lineCap: 'round',
          width: 2,
        },
        title: {
          text: `${this.props.id} over Time [s]`,
          align: "center"
        },
        xaxis: {
          tickAmount: 5,
          tickPlacement: 'between',
          labels: {
            formatter: function (value) {
              return (value >= 0) ? Math.ceil(value) : "";
            }
          },
          type: 'numeric',
          range: 10,
          min: 5,
          title: {
            text: "Time [s]"
          },
        },
        yaxis: {
          tickAmount: 2,
          min: this.props.minYScale > 0 ? this.props.minYScale : 0,
          max: this.props.maxYScale,
          labels: {
            formatter: function (value) {
              return Math.ceil(value);
            }
          },
          title: {
            text: this.props.id
          },
        },
        legend: {
          show: true
        },
        tooltip: {
          enabled: false
        },
        theme: {
          mode: 'light',
          palette: 'palette5',
          monochrome: {
            enabled: false,
            color: '#255aee',
            shadeTo: 'light',
            shadeIntensity: 0.65
          },
        }
      },
      series: this.props.firstSeries
    };
  }

  componentDidMount() {
    this.state.series.forEach(driver => {
      if (!driver.chekced) {
        ApexCharts.exec(this.props.id, "hideSeries", driver.name)
      }
    })
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.drivers.toString() !== nextProps.drivers.toString()) {
      nextProps.drivers.forEach(seriesName => {
        if (seriesName[0]) {
          ApexCharts.exec(this.props.id, "showSeries", seriesName[1])
        } else {
          ApexCharts.exec(this.props.id, "hideSeries", seriesName[1])
        }
      })
    }

    if (this.props.data.toString() !== nextProps.data.toString()) {
      let newSeries = []
      nextProps.data.forEach(data => {
        newSeries.push({
          name: data[0],
          data: [data[1]]
        })
      })
      ApexCharts.exec(this.props.id, "appendData", newSeries);
    }

    return false;
  }

  render() {
    return (
      <div id="chart">
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height="250"
          width="100%"
        />
      </div>
    );
  }
}

export default LiveChart;