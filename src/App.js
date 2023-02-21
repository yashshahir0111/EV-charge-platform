import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const mapContainerStyle = {
    width: "100vw",
    height: "100vh",
};

const options = {
    disableDefaultUI: false,
    zoomControl: true,
};

function Map() {
    const [center, setCenter] = useState({ lat: 0, lng: 0 });
    const [userLocation, setUserLocation] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [map, setMap] = useState(null);

    const { isLoaded, loadError } = useLoadScript({
        id: "google-map-script",
        googleMapsApiKey: "AIzaSyBl-1-PGa4XPEK6kErLLbOAlrKmhFXgHL4",
        libraries: ["places"],
    });

    // useEffect(() => {
    //     if (isLoaded && userLocation) {
    //         const service = new window.google.maps.places.PlacesService(map);
    //         service.nearbySearch(
    //             {
    //                 location: userLocation,
    //                 radius: 50000,
    //                 type: ["ev_station"],
    //             },
    //             (results, status) => {
    //                 if (
    //                     status ===
    //                     window.google.maps.places.PlacesServiceStatus.OK
    //                 ) {
    //                     setMarkers(results);
    //                 }
    //             },
    //         );
    //     }
    // }, [isLoaded, userLocation, map]);

    useEffect(() => {
        if (!isLoaded) return;

        const service = new window.google.maps.places.PlacesService(
            document.createElement("div"),
        );
        service.nearbySearch(
            {
                location: userLocation,
                radius: 4000, // search within 1km
                keyword: [
                    "charging station",
                    "ev charging station",
                    "ev station",
                    "ev charger",
                    "ev charging",
                    "ev charging station near me",
                    "ev charging station near me",
                    "ev station near me",
                    "ev charger near me",
                    "ev charging near me",
                    "ev charging station nearby",
                    "ev charging station nearby",
                    "ev station nearby",
                    "ev charger nearby",
                    "ev charging nearby",
                    "ev charging station close by",
                    "ev charging station close by",
                    "ev station close by",
                    "ev charger close by",
                    "ev charging close by",
                    "ev charging station close to me",
                    "ev charging station close to me",
                    "ev station close to me",
                    "ev charger close to me",
                    "ev charging close to me",
                    "ev charging station close",
                    "ev charging station close",
                    "ev station close",
                    "ev charger close",
                    "ev charging close",
                    "ev charging station nearby me",
                    "ev charging station nearby me",
                    "ev station nearby me",
                    "ev charger nearby me",
                    "ev charging nearby me",
                    "ev charging station close by me",
                    "ev charging station close by me",
                    "ev station close by me",
                    "ev charger close by me",
                    "ev charging close by me",
                    "ev charging station close to",
                    "ev charging station close to",
                    "ev station close to",
                    "ev charger close to",
                    "ev charging close to",
                    "ev charging station close by to me",
                    "ev charging station close by to me",
                    "ev station close by to me",
                    "ev charger close by to me",
                    "ev charging close by to me",
                    "ev charging station close by to",
                    "ev charging station close by to",
                    "ev station close by to",
                    "ev charger close by to",
                    "ev charging close by to",
                    "ev charging station close to by me",
                    "ev charging station close to by me",
                    "ev station close to by me",
                    "ev charger close to by me",
                    "ev charging close to by me",
                    "ev charging station close to by",
                    "ev charging station close to by",
                    "ev station close to by",
                    "ev charger close to by",
                    "ev charging close to by",
                    "ev charging station close by to by me",
                    "ev charging station close by to by me",
                    "ev station close by to by me",
                    "ev charger close by to by me",
                    "ev charging close by to by me",
                    "ev charging station close by to by",
                    "ev charging station close by to by",
                    "ev station close by to by",
                    "ev charger close by",
                    "ev charging close by",
                    "ev charging station close to by",
                ],
                type: ["establishment"],
            },
            (results, status) => {
                if (status === "OK") {
                    setMarkers(results);
                }
            },
        );
    }, [isLoaded, userLocation, map]);

    useEffect(() => {
        const getUserLocation = async () => {
            try {
                const {
                    coords: { latitude, longitude },
                } = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        timeout: 5000,
                        maximumAge: 5000,
                        enableHighAccuracy: true,
                    });
                });
                setCenter({ lat: latitude, lng: longitude });
                setUserLocation({ lat: latitude, lng: longitude });
            } catch (error) {
                console.error(error);
            }
        };

        getUserLocation();
    }, []);

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading maps";

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={17}
            center={center}
            options={options}
        >
            {console.log(markers)}
            {userLocation && (
                <Marker
                    position={userLocation}
                    icon={
                        "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
                    }
                />
            )}
            {markers.map((marker) => (
                <Marker
                    key={marker.place_id}
                    position={marker.geometry.location}
                    label={marker.name}
                    title={marker.name}
                />
            ))}
        </GoogleMap>
    );
}

export default Map;
