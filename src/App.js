//import logo from './logo.svg';
import './App.css';
import React, { Component, createRef } from "react";

import tt from "@tomtom-international/web-sdk-maps";
import { services } from "@tomtom-international/web-sdk-services";

import "@tomtom-international/web-sdk-maps/dist/maps.css";
import "./App.css";

const API_KEY = "ARGNxuIf5WZeTSJog2PYtRqNeB3OA5Su";
//const SAN_FRANCISCO = [-122.4194, 37.7749];
const SAN_FRANCISCO = [73.8567, 18.5204];


/*
function App() {
  return (
   <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    
   <h1>hello</h1>
  );
}*/

export default class App extends Component {
  constructor(props)
  {

    super(props);
    this.mapRef = createRef();
  }

  componentDidMount()
  {
    this.map = tt.map({
      key: API_KEY,
      container: this.mapRef.current,
      center: SAN_FRANCISCO,
      zoom: 12
    });
  }

  render()
  {
    return(
      <div>
         <div ref={this.mapRef} className="mapDiv"></div>
      </div>
    );
  }
}

//export default App;
