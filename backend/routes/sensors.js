const express = require("express");
const Sensor = require("../models/Sensor");

const router = express.Router();

// Add a new sensor
router.post("/", async (req, res) => {
    try {
        const { type, location } = req.body;
        const newSensor = new Sensor({ type, location });
        await newSensor.save();
        res.status(201).json(newSensor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Get all sensors
router.get("/", async (req, res) => {
    try {
        const sensors = await Sensor.find();
        res.json(sensors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;