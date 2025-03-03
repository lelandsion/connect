const mongoose = require("mongoose");

const SensorSchema = new mongoose.Schema({
    type: { type: String, required: true },
    location: { type: String, required: true },
    installedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Sensor", SensorSchema);