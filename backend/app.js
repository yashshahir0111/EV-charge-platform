const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connection = require("./connection");
const nodemailer = require("nodemailer");

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
                console.log(result);
                res.json(result);
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

// app.post("/send-email", async (req, res) => {
//     const data = req.body;
//     const transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 587,
//         secure: false,
//         auth: {
//             user: "evcharge4@gmail.com",
//             pass: "evcharge@123",
//         },
//     });
//     const mailOptions = {
//         from: "evcharge4@gmail.com",
//         to: data.email,
//         subject: "Your EV Charge Slot has been booked",
//         text: `Your EV Charge Slot has been booked at ${data.station} for ${data.slotTime} minutes. Your vehicle number is ${data.rnumber}`,
//     };

//     try {
//         const info = await transporter.sendMail(mailOptions);
//         console.log("Message sent: %s", info.messageId);
//         res.status(200).send("Email sent successfully");
//     } catch (err) {
//         console.log(err);
//         res.status(500).send("Failed to send email");
//     }
// });

app.listen(4000, () => {
    console.log("Server started on port 4000");
});
