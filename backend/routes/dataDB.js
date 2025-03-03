const express = require("express");
const router = express.Router();
const energy_data = require("../models/Energy_Data");

// GET route to retrieve energy data
router.get('/energy_data', async (req, res) => {
    try {
        // Fetch all documents from the energy_data collection
        const data = await EnergyData.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;