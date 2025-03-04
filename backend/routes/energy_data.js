const express = require("express");
const router = express.Router();
const EnergyData = require("../models/EnergyData");
const axios = require("axios");
const fs = require("fs");

// Placehoder values replace with values form the saved scaler
const minValues = [0, 0, 0];  // Assuming lowest energy usage is 0
const maxValues = [500, 250, 150];  // Approximat

// Manually scale using min/max from training
function minMaxScale(value, min, max) {
    return (value - min) / (max - min);
}

// Manually unscale to get original values back
function minMaxUnscale(value, min, max) {
    return value * (max - min) + min;
}

/**
 * @route   GET /api/energy_data
 * @desc    Get all energy data
 */
router.get("/", async (req, res) => {
    try {
        const data = await EnergyData.find()
            .sort({ timestamp: -1 })  // Sort by newest first
            .limit(50);  // ✅ Fetch only 50 records

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route   GET /api/energy_data/:id
 * @desc    Get a specific energy data entry by ID
 */
router.get("/:id", async (req, res) => {
    try {
        const data = await EnergyData.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ error: "Energy data not found" });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route   GET /api/energy_data/filter
 * @desc    Get energy data between two dates
 * @query   start=YYYY-MM-DD&end=YYYY-MM-DD
 */
router.get("/filter", async (req, res) => {
    try {
        let { start, end } = req.query;

        // Ensure both dates are provided
        if (!start || !end) {
            return res.status(400).json({ error: "Both start and end dates are required." });
        }

        // Convert to proper Date format
        start = new Date(start);
        end = new Date(end);

        // Validate that end is after start
        if (end < start) {
            return res.status(400).json({ error: "End date must be after start date." });
        }

        // Query MongoDB for entries in the date range
        const data = await EnergyData.find({
            timestamp: { $gte: start, $lte: end }
        });

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route   POST /api/energy_data
 * @desc    Add a new energy data entry
 */
router.post("/", async (req, res) => {
    try {
        const { timestamp, energyUsage, additionalData } = req.body;
        const newEntry = new EnergyData({ timestamp, energyUsage, additionalData });
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/**
 * @route   POST /api/energy_data/predict
 * @desc    Get AI-based prediction using the last 8 hours of energy data
 */
router.post("/predict", async (req, res) => {
    try {
        // 1️⃣ Fetch the last 8 records from MongoDB
        const last8Hours = await EnergyData.find()
            .sort({ timestamp: -1 })
            .limit(8);

        if (last8Hours.length !== 8) {
            return res.status(400).json({ error: "Not enough data for prediction" });
        }

        // 2️⃣ Extract HVAC, MELs, Lighting
        let inputFeatures = last8Hours
            .reverse()  // Oldest first
            .map(data => {
                return [
                    typeof data.total_hvac === "number" ? data.total_hvac : 0,
                    typeof data.total_lighting === "number" ? data.total_lighting : 0,
                    typeof data.total_mels === "number" ? data.total_mels : 0
                ];
            });

        console.log("Input Features Shape:", inputFeatures.length, inputFeatures[0].length);
        inputFeatures = inputFeatures.map(row => row.map((val, idx) => (val - minValues[idx]) / (maxValues[idx] - minValues[idx])));

        // 4️⃣ Wrap in an array to ensure shape (1, 8, 3)
        const formattedInput = [inputFeatures];

        console.log("Formatted Input Sent to AI Model:", JSON.stringify(formattedInput));

        // 5️⃣ Send formatted data to AI model
        const aiResponse = await axios.post("http://localhost:5005/predict", {
            features: formattedInput
        });

        res.json({ prediction: aiResponse.data.prediction });

    } catch (error) {
        console.error("AI Prediction Error:", error);
        res.status(500).json({ error: "AI prediction failed" });
    }
});

/**
 * @route   PUT /api/energy_data/:id
 * @desc    Update an existing energy data entry by ID
 */
router.put("/:id", async (req, res) => {
    try {
        const { timestamp, energyUsage, additionalData } = req.body;
        const updatedEntry = await EnergyData.findByIdAndUpdate(
            req.params.id,
            { timestamp, energyUsage, additionalData },
            { new: true } // Return the updated document
        );

        if (!updatedEntry) {
            return res.status(404).json({ error: "Energy data not found" });
        }

        res.status(200).json(updatedEntry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route   DELETE /api/energy_data/:id
 * @desc    Delete an energy data entry by ID
 */
router.delete("/:id", async (req, res) => {
    try {
        const deletedEntry = await EnergyData.findByIdAndDelete(req.params.id);
        if (!deletedEntry) {
            return res.status(404).json({ error: "Energy data not found" });
        }
        res.json({ message: "Energy data deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;