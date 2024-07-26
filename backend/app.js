import express from "express";
import cors from "cors";
import pkg from "body-parser";
const { urlencoded, json } = pkg;
import { supabase } from "./connection.js";
import nodemailer from "nodemailer";

var duration;
var slotTime;
var distance;
var decideFactor;

const app = express();
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.post("/send-data", async (req, res) => {
    const data = req.body;
    console.log(data);
    slotTime = data.slotTime;
    distance = data.distance;
    duration = data.duration;
    decideFactor = slotTime + distance + duration;

    // Insert data into Supabase
    const { error } = await supabase.from("cmpVals").insert([
        {
            Rnumber: data.Rnumber,
            decideFactor,
            station: data.station,
            vehicleType: data.vehicleType,
        },
    ]);

    if (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to insert data" });
    }

    res.json({ message: "Form data received successfully!" });
});

app.get("/get-data", async (req, res) => {
    const { data, error } = await supabase.from("cmpVals").select("*");

    if (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch data" });
    }

    res.json(data);
});

app.post("/delete-data", async (req, res) => {
    const deleteVehicleData = req.body;

    // Delete from cmpVals
    const { error: deleteError } = await supabase
        .from("cmpVals")
        .delete()
        .eq("Rnumber", deleteVehicleData.rnumber);

    if (deleteError) {
        console.error(deleteError);
        return res
            .status(500)
            .json({ error: "Failed to delete data from cmpVals" });
    }

    // Insert into dropedEntries
    const { error: insertError } = await supabase
        .from("dropedEntries")
        .insert([{ Rnumber: deleteVehicleData.rnumber }]);

    if (insertError) {
        console.error(insertError);
        return res
            .status(500)
            .json({ error: "Failed to insert data into dropedEntries" });
    }

    res.json({ message: "Data deleted and inserted successfully!" });
});

app.post("/send-email", async (req, res) => {
    const data = req.body;
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "evcharge4@gmail.com",
            pass: "evcharge@123",
        },
    });
    const mailOptions = {
        from: "evcharge4@gmail.com",
        to: data.email,
        subject: "Your EV Charge Slot has been booked",
        text: `Your EV Charge Slot has been booked at ${data.station} for ${data.slotTime} minutes. Your vehicle number is ${data.rnumber}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        res.status(200).send("Email sent successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send("Failed to send email");
    }
});

app.listen(4000, () => {
    console.log("Server started on port 4000");
});
