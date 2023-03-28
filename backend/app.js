const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connection = require("./connection");

var duration;
var slotTime;
var distance;
var decideFactor;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/send-data", async (req, res) => {
    const data = req.body;
    console.log(data);
    slotTime = data.slotTime;
    distance = data.distance;
    duration = data.duration;
    decideFactor = slotTime + distance + duration;
    res.json({ message: "Form data received successfully!" });
    const insertCmpVals =
        "INSERT INTO cmpVals (Rnumber, decideFactor, station, vehicleType) VALUES (?, ?, ?, ?)";
    const insertFinalTable =
        "INSERT INTO finalTable (rnumber, slotTime, duration,distance,station,decideFactor,vehicleType) VALUES (?, ?, ?, ?, ?, ?, ?)";
    connection.query(
        insertCmpVals,
        [data.rnumber, decideFactor, data.station, data.vehicleType],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Data inserted into cmpVals");
            }
        },
    );
    connection.query(
        insertFinalTable,
        [
            data.rnumber,
            slotTime,
            duration,
            distance,
            data.station,
            decideFactor,
            data.vehicleType,
        ],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Data inserted into finalTable");
            }
        },
    );
});

app.get("/get-data", (req, res) => {
    connection.query(
        "SELECT * FROM cmpVals ORDER BY decideFactor",
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        },
    );
});

app.post("/delete-data", (req, res) => {
    const dropedEntries = "INSERT INTO dropedEntries(Rnumber) VALUES (?)";
    const deleteVehicle = "DELETE FROM cmpVals WHERE Rnumber = ?";
    const deleteVehicleData = req.body;
    connection.query(
        deleteVehicle,
        [deleteVehicleData.rnumber],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Vehicle data deleted from cmpVals");
            }
        },
    );
    connection.query(
        dropedEntries,
        [deleteVehicleData.rnumber],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Vehicle data inserted into dropedEntries");
            }
        },
    );
});

app.listen(4000, () => {
    console.log("Server started on port 4000");
});
