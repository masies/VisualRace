import React from 'react';
import * as d3 from "d3";
import * as mapConfig from './MapConfig.json';


class Circuit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      race_id: this.props.race_id,
      coordinates: {},
      map: null,
      fetched: false
    }
  }

  componentDidMount() {
    fetch(`/api/circuit?race_id=${this.state.race_id}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ coordinates: data });

        var map = new google.maps.Map(d3.select("#map").node(), {
          styles: mapConfig.default,
          backgroundColor: 'hsla(0, 0%, 0%, 0)',
          streetViewControl: false,
          rotateControl: true,
          mapTypeControl: true,
          zoomControl: true,
          fullscreenControl: false,
          center: new google.maps.LatLng(this.state.coordinates.centroid.location.lat, this.state.coordinates.centroid.location.lon),
        });
        map.setMapTypeId('satellite');
        var markerBounds = new google.maps.LatLngBounds();
        markerBounds.extend(new google.maps.LatLng(this.state.coordinates.min_lat.value, this.state.coordinates.min_lon.value));
        markerBounds.extend(new google.maps.LatLng(this.state.coordinates.max_lat.value, this.state.coordinates.max_lon.value));
        map.fitBounds(markerBounds);
        this.setState({ map: map });
        this.draw()

      })

  }

  draw() {
    var overlay = new google.maps.OverlayView();

    var self = this
    overlay.onAdd = function () {
      var layer = d3.select(this.getPanes().overlayLayer).append("div").attr("class", "stations");

      overlay.draw = function () {
        var projection = this.getProjection();
        var padding = 10;
        var marker = layer.selectAll("svg")
          .data(d3.entries(self.props.data))
          .each(transform)
          .enter().append("svg")
          .each(transform)
          .attr("class", "marker");

        d3.selectAll(".circle").each(function () {
          var currCircle = this;
          d3.select(this).select("rect").transition().duration(900).style("visibility", function () {
            return (currCircle === clickedCircle) ? "visible" : "hidden";
          });
        });

        marker.append("circle")
          .attr("r", 5.5)
          .attr("cx", padding)
          .attr("cy", padding)
          .attr("fill", (d) => d.value[1]);

        marker.append("text")
          .style("font-size", "10px")
          .attr("x", padding + 8)
          .attr("y", padding)
          .attr("dy", ".41em")
          .text((d) => d.value[0]);


        function transform(d) {
          d3.select(this).style("visibility", () => d.value[3] ? "visible" : "hidden");
          d = new google.maps.LatLng(d.value[2][1], d.value[2][0]);
          d = projection.fromLatLngToDivPixel(d);
          return d3.select(this)
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px");
        }
      }
    }
    overlay.setMap(this.state.map);
    this.setState({ overlay: overlay });
    this.setState({ fetched: true });
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.data.toString() !== nextProps.data.toString()) {
      if (this.state.overlay && this.state.fetched && this.state.overlay.draw) {
        this.state.overlay.draw()
      }
    }
    return false;
  }

  render() {
    return (
      <div id="map" style={{ width: "100%", height: "300px" }}>
      </div>
    )
  }
}




export default Circuit;