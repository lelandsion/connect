const express = require("express");
const Sensor = require("../models/Sensor");

const router = express.Router();

/**
 * @route   GET /api/sensors
 * @desc    Get all sensors
 */
router.get("/", async (req, res) => {
    try {
        const sensors = await Sensor.find();
        res.json(sensors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


/**
 * @route   GET /api/sensors/:id
 * @desc    Get a single sensor by ID
 */
router.get("/:id", async (req, res) => {
    try {
        const sensor = await Sensor.findById(req.params.id);
        if (!sensor) {
            return res.status(404).json({ error: "Sensor not found" });
        }
        res.json(sensor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

/**
 * @route   POST /api/sensors
 * @desc    Add a new sensor
 */
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


/**
 * @route   PUT /api/sensors/:id
 * @desc    Update a sensor by ID
 */
// Update a sensor by ID
router.put("/:id", async (req, res) => {
    try {
        const { type, location } = req.body;
        const updatedSensor = await Sensor.findByIdAndUpdate(
            req.params.id,
            { type, location },
            { new: true } // Return the updated document
        );

        if (!updatedSensor) {
            return res.status(404).json({ error: "Sensor not found" });
        }

        res.json(updatedSensor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Delete a sensor by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedSensor = await Sensor.findByIdAndDelete(req.params.id);
        if (!deletedSensor) {
            return res.status(404).json({ error: "Sensor not found" });
        }
        res.json({ message: "Sensor deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

/**
 * @route   DELETE /api/sensors/:id
 * @desc    Delete a sensor by ID
 */
router.delete("/:id", async (req, res) => {
    try {
        const deletedSensor = await Sensor.findByIdAndDelete(req.params.id);
        if (!deletedSensor) {
            return res.status(404).json({ error: "Sensor not found" });
        }
        res.json({ message: "Sensor deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;