import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    HStack,
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
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");

    const { isLoaded, loadError } = useLoadScript({
        id: "google-map-script",
        googleMapsApiKey: "AIzaSyBl-1-PGa4XPEK6kErLLbOAlrKmhFXgHL4",
        libraries: ["places"],
    });

    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef();
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destiantionRef = useRef();

    async function calculateRoute() {
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
        document.cookie = `distance=${results.routes[0].legs[0].distance.text}`;
        document.cookie = `duration=${results.routes[0].legs[0].duration.text}`;
        document.cookie = `lat=${results.routes[0].legs[0].end_location.lat()}`;
        document.cookie = `lng=${results.routes[0].legs[0].end_location.lng()}`;
        document.cookie = `vehicleNumber=${vehicleNumber}`;
    }

    function clearRoute() {
        setDirectionsResponse(null);
        setDistance("");
        setDuration("");
        originRef.current.value = "";
        destiantionRef.current.value = "";
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
        <Flex
            position="relative"
            flexDirection="column"
            alignItems="center"
            h="100vh"
            w="100vw"
        >
            <Box position="absolute" left={0} top={0} h="100%" w="100%">
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
                                alert(document.cookie + "\n");
                            }}
                        />
                    ))}
                </GoogleMap>
            </Box>
            <Box
                p={4}
                borderRadius="lg"
                m={4}
                bgColor="white"
                shadow="base"
                minW="container.md"
                zIndex="1"
            >
                <HStack spacing={2} justifyContent="space-between">
                    <Box flexGrow={5}>
                        <Autocomplete>
                            <Input
                                type="text"
                                placeholder="Destination"
                                ref={destiantionRef}
                                w={500}
                            />
                        </Autocomplete>
                    </Box>
                    <Box>
                        <Input
                            type="text"
                            placeholder="Vehicle Number"
                            value={vehicleNumber}
                            onChange={(e) => {
                                setVehicleNumber(e.target.value);
                            }}
                        />
                    </Box>
                    <Box>
                        <Select>
                            <option value="two">Two Wheeler</option>
                            <option value="four">Four Wheeler</option>
                        </Select>
                    </Box>

                    <ButtonGroup>
                        <Button
                            colorScheme="pink"
                            type="submit"
                            onClick={calculateRoute}
                        >
                            Calculate Route
                        </Button>
                        <IconButton
                            aria-label="center back"
                            icon={<FaTimes />}
                            onClick={clearRoute}
                        />
                    </ButtonGroup>
                </HStack>
                <HStack spacing={4} mt={4} justifyContent="space-between">
                    <Text>Distance: {distance} </Text>
                    <Text>Duration: {duration} </Text>
                    <IconButton
                        aria-label="center back"
                        icon={<FaLocationArrow />}
                        isRound
                        onClick={() => {
                            map.panTo(center);
                            map.setZoom(15);
                        }}
                    />
                </HStack>
            </Box>
        </Flex>
    );
}

export default Map;
