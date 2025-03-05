const express = require("express");
const router = express.Router();
const EnergyData = require("../models/EnergyData");
const { getDayAheadForecast } = require("../visualize_predictions/day_ahead_forecast");
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
        const data = await EnergyData.find({}, {
            energy_usage: 1,
            sensor_id: 1,
            timestamp: 1,
            device_type: 1,
            location: 1
        }).sort({ timestamp: -1 }).limit(50);

        console.log("🔍 RAW MONGODB RESPONSE:", JSON.stringify(data, null, 2)); // Add this log

        res.status(200).json(data);
    } catch (error) {
        console.error("❌ Error fetching energy data:", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route   POST /api/energy_data/day-ahead
 * @desc    Gets the day-ahead forecast of the next 24 hours.
 */
router.get("/day-ahead", async (req, res) => {
    try {
        const forecast = await getDayAheadForecast();
        if (!forecast) {
            return res.status(500).json({ error: "Forecast generation failed." });
        }
        res.json({ forecast });
    } catch (error) {
        console.error("Error generating day-ahead forecast:", error);
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

        if (!start || !end) {
            return res.status(400).json({ error: "Start and end dates are required." });
        }

        // Convert dates to proper format
        start = new Date(start);
        end = new Date(end);

        if (end < start) {
            return res.status(400).json({ error: "End date must be after start date." });
        }

        // Query energy data for the selected date range
        const data = await EnergyData.find({
            timestamp: { $gte: start, $lte: end }
        }).sort({ timestamp: 1 });  // Sort by oldest first

        // Aggregate total energy usage by category
        const breakdown = {
            total_hvac: 0,
            total_lighting: 0,
            total_mels: 0,
        };

        data.forEach(entry => {
            breakdown.total_hvac += entry.total_hvac || 0;
            breakdown.total_lighting += entry.total_lighting || 0;
            breakdown.total_mels += entry.total_mels || 0;
        });

        res.status(200).json({ breakdown, data });
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
        const newEntry = new EnergyData({ timestamp, energy_usage, additionalData });
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
            { timestamp, energy_usage, additionalData },
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