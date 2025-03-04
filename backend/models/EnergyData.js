    const mongoose = require('mongoose');

    const energy_dataSchema = new mongoose.Schema({
        sensor_id: {
            type: Number,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        energy_usage: {
            type: Number,
            required: true,
        },
        device_type: {
            type: String,
            default: []
        },
        location: {
            type: String,
            default: []
        },
    }, { collection: "energy_data" });

    module.exports = mongoose.model('EnergyData', energy_dataSchema);