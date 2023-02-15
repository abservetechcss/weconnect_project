import React, { Component, Fragment } from 'react'

import MapboxMap, { Marker } from 'react-mapbox-wrapper';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

class LocationWiseMapTiler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRaiseRequestModal: false,
      selectPort: null,
      loading: false,
    }
    this.onMapLoad = this.onMapLoad.bind(this);
  }

  onMapLoad(map) {
    this.map = map;
    this.forceUpdate();
  }

  render() {
    let _this = this;

    return (
      <Fragment>
        <MapboxMap
          accessToken="pk.eyJ1Ijoic29tbmF0aDEyMyIsImEiOiJja3Q1YWpncXkwMDN3MnFwaG45NW5rZHB1In0.WiQvLMZF5mIkPGGEJibbUQ"
          mapboxStyle={'https://api.maptiler.com/maps/56265891-a468-4b8b-a4e6-796ec83cd83f/style.json?key=senY0BEGyASfep6NUdHY'}
          className="customMap"
          coordinates={{ lat: _this.props.latitude, lng: _this.props.longitude }}
          zoom={12}
          minZoom={2}
          maxZoom={18}
          withFullscreen={true}
          withZoom={false}
          // navigationControlPosition={'top-right'}
          withCompass={true}
          onChange={(e,name) => {
          }}
          onLoad={this.onMapLoad}
        
        >
         
        </MapboxMap>
      </Fragment >
    );
  }
}

LocationWiseMapTiler.displayName = 'LocationWiseMapTiler';
export default LocationWiseMapTiler;
