import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    HStack,
    VStack,
    IconButton,
    Input,
    Text,
    Select,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";

import {
    useLoadScript,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
} from "@react-google-maps/api";
import { useEffect, useState, useRef } from "react";
import emailjs from "@emailjs/browser";

const mapContainerStyle = {
    width: "100vw",
    height: "100%",
};

const options = {
    disableDefaultUI: true,
    zoomControl: true,
};

function Map() {
    const [center, setCenter] = useState({ lat: 0, lng: 0 });
    const [userLocation, setUserLocation] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [map, setMap] = useState(null);
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");
    const [slotTime, setSlotTime] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [vehicleType, setVehicleType] = useState("two wheeler");
    const [data, setData] = useState([]);
    const [deleteVehicle, setDeleteVehicle] = useState("");
    const [email, setEmail] = useState("");

    const { isLoaded, loadError } = useLoadScript({
        id: "google-map-script",
        googleMapsApiKey: "AIzaSyBl-1-PGa4XPEK6kErLLbOAlrKmhFXgHL4",
        libraries: ["places"],
    });

    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef();
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destiantionRef = useRef();

    async function calculateRoute(event) {
        event.preventDefault();

        if (userLocation === "" || destiantionRef.current.value === "") {
            return;
        }
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService();
        const results = await directionsService.route({
            origin: userLocation,
            destination: destiantionRef.current.value,
            // eslint-disable-next-line no-undef
            travelMode: google.maps.TravelMode.DRIVING,
        });
        setDirectionsResponse(results);
        setDistance(results.routes[0].legs[0].distance.text);
        setDuration(results.routes[0].legs[0].duration.text);

        const data = {
            distance: parseFloat(distance),
            duration: parseFloat(duration),
            slotTime: parseFloat(slotTime),
            rnumber: vehicleNumber,
            station: destiantionRef.current.value,
            vehicleType: vehicleType,
        };
        try {
            const response = await fetch("http://localhost:4000/send-data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to submit form");
            }
        } catch (error) {
            console.error(error);
        }
        // try {
        //     const response = await fetch("http://localhost:4000/send-email", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(data),
        //     });
        //     if (!response.ok) {
        //         throw new Error("Failed to submit form");
        //     }
        // } catch (error) {
        //     console.log(error);
        // }
        alert(
            "Your slot has been booked successfully!! at: " +
                destiantionRef.current.value,
        );
        await fetchData();
        const templateParams = {
            user_name: "EV Charge",
            to_name: vehicleNumber,
            message:
                "You have booked a slot at: " + destiantionRef.current.value,
            user_email: email,
            subject: "booking successful",
        };

        emailjs
            .send(
                "service_dmtnbg9",
                "template_7h3v4dd",
                templateParams,
                "sl0TXfhhu70fdRK8M",
            )
            .then(
                (result) => {
                    console.log(result.text);
                },
                (error) => {
                    console.log(error.text);
                },
            );
    }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const result = await fetch("http://localhost:4000/get-data");
        const body = await result.json();
        setData(body);
    };

    function clearRoute() {
        setDirectionsResponse(null);
        setDistance("");
        setDuration("");
        originRef.current.value = "";
        destiantionRef.current.value = "";
    }

    async function deleteVehicleData() {
        const data = {
            rnumber: deleteVehicle,
        };
        try {
            const response = await fetch("http://localhost:4000/delete-data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to submit form");
            }
        } catch (error) {
            console.error(error);
        }
        alert(deleteVehicle);
    }

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
                console.log("user location: ", userLocation);
            } catch (error) {
                console.error(error);
            }
        };

        getUserLocation();
    }, []);

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading maps";

    return (
        <div className="relative flex flex-col items-center h-screen w-screen pr-40">
            <div
                className="absolute left-0 top-0 h-full w-[calc(100%-10rem)]"
                id="map-container"
            >
                {/* Google Map Box */}
                <GoogleMap
                    center={center}
                    zoom={15}
                    mapContainerStyle={mapContainerStyle}
                    options={options}
                    onLoad={(map) => setMap(map)}
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
                    {directionsResponse && (
                        <DirectionsRenderer directions={directionsResponse} />
                    )}
                    {markers.map((marker) => (
                        <Marker
                            key={marker.place_id}
                            position={marker.geometry.location}
                            label={marker.name}
                            title={marker.name}
                            onClick={() => {
                                let a =
                                    "https://maps.googleapis.com/maps/api/geocode/json?latlng=${marker.geometry.location}&key=${AIzaSyBl-1-PGa4XPEK6kErLLbOAlrKmhFXgHL4}";

                                alert(marker.geometry.location + "\n" + a);
                            }}
                        />
                    ))}
                </GoogleMap>
            </div>
            <div className="p-4 rounded-lg m-4 bg-white shadow-md min-w-[768px] z-10">
                <div className="flex justify-between items-center space-x-2">
                    <div className="flex-grow">
                        <Autocomplete>
                            <input
                                type="text"
                                id="destination"
                                placeholder="Destination"
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </Autocomplete>
                    </div>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            id="slotTime"
                            placeholder="Slot Time (Hours)"
                            className="px-3 py-2 border rounded-md"
                        />
                        <input
                            type="text"
                            id="vehicleNumber"
                            placeholder="Vehicle Number"
                            className="px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <select
                            id="vehicleType"
                            className="px-3 py-2 border rounded-md"
                        >
                            <option value="two wheeler">Two Wheeler</option>
                            <option value="four wheeler">Four Wheeler</option>
                        </select>
                    </div>
                    <div>
                        <input
                            type="email"
                            id="userEmail"
                            placeholder="Enter your Email"
                            className="px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div className="flex space-x-2">
                        <button
                            id="calculateRoute"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Calculate Route
                        </button>
                        <button
                            id="clearRoute"
                            className="p-2 bg-gray-200 rounded-full"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <span id="distance">Distance: </span>
                    <span id="duration">Duration: </span>
                    <button
                        id="centerMap"
                        className="p-2 bg-blue-500 text-white rounded-full"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clip-rule="evenodd"
                            ></path>
                        </svg>
                    </button>
                </div>
                <div className="mt-4">
                    <div className="flex justify-between items-center space-x-2">
                        <input
                            type="text"
                            id="deleteVehicle"
                            placeholder="Delete an entry"
                            className="flex-grow px-3 py-2 border rounded-md"
                        />
                        <button
                            id="deleteVehicleBtn"
                            className="px-4 py-2 bg-red-500 text-white rounded-md"
                        >
                            Delete Vehicle
                        </button>
                    </div>
                </div>
            </div>
            <div className="absolute top-0 right-0 h-full w-40 bg-white shadow-lg p-4 z-10">
                <div className="space-y-4">
                    {Array.isArray(data) ? (
                        data.map((item) => (
                            <div
                                key={item.Rnumber}
                                className="text-gray-700 text-md"
                            >
                                {item.Rnumber}
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 text-md">
                            No data available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Map;
