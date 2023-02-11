//import logo from './logo.svg';
import "./App.css";
import React from "react";
import tt from "@tomtom-international/web-sdk-maps";
import { services } from "@tomtom-international/web-sdk-services";
import { useEffect, useState, useRef } from "react";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import "./App.css";

const API_KEY = "ARGNxuIf5WZeTSJog2PYtRqNeB3OA5Su";
const MAX_ZOOM = 100;
//const SAN_FRANCISCO = [-122.4194, 37.7749];
const SAN_FRANCISCO = [18.613060791108524, 73.79245718289897];

const App = () => {
    const mapElement = useRef();
    const [mapLongitude, setMapLongitude] = useState(73.8567);
    const [mapLatitude, setMapLatitude] = useState(18.5204);
    const [mapZoom, setMapZoom] = useState(17);
    const [map, setMap] = useState({});

    useEffect(() => {
        let map = tt.map({
            key: API_KEY,
            container: mapElement.current,
            center: [mapLongitude, mapLatitude],
            zoom: mapZoom,
        });
        setMap(map);
        return () => map.remove();
    }, []);
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    const [lat, setLat] = useState("");
    const [long, setLong] = useState("");
    const [locationState, setLocationState] = useState([]);

    //getting location
    navigator.geolocation.getCurrentPosition(
        (position) => {
            setLat(position.coords.latitude);
            setLong(position.coords.longitude);
            map.setCenter([long, lat]);
            new tt.Marker().setLngLat(map.getCenter()).addTo(map);
        },
        error,
        { enableHighAccuracy: true, maximumAge: 0 },
    );

    //check if allow location is blocked
    useEffect(() => {
        navigator.permissions
            .query({
                name: "geolocation",
            })
            .then((result) => {
                setLocationState(result.state);
            });
    }, [locationState]);

    useEffect(() => {
        navigator.permissions
            .query({
                name: "geolocation",
            })
            .then((result) => {
                setLocationState(result.state);
            });
    }, []);
    // console.log(lat, long);
    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const [data, setData] = useState(null);
    const [err, setErr] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (search !== "" || search !== null || search !== undefined) {
                try {
                    const response = await fetch(
                        `https://api.tomtom.com/search/2/geocode/${search}.json?key=` +
                            API_KEY,
                    );
                    const json = await response.json();
                    setData(json);
                } catch (error) {
                    setErr(error);
                }
            } else {
                console.log("no data");
            }
            map.setCenter(data.results[0].position);
        };

        fetchData();
    }, [handleSearchChange]);

    // console.log(data);
    return (
        <>
            <input
                type="text"
                name="search"
                id="search"
                value={search}
                onChange={handleSearchChange}
                placeholder="Enter place to search..."
            />
            <div ref={mapElement} className="mapDiv"></div>
        </>
    );
};

export default App;
