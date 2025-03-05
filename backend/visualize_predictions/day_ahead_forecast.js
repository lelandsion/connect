const axios = require("axios");
const EnergyData = require("../models/EnergyData");

// Placeholder Min/Max values (replace these with actual scaler values)
const minValues = [0, 0, 0];  // Assuming 0 is the lowest value for all
const maxValues = [500, 250, 150];  // Approximate maximum values

// Manually scale using min/max from training
function minMaxScale(value, min, max) {
    return (value - min) / (max - min);
}

// Manually unscale to get original values back
function minMaxUnscale(value, min, max) {
    return value * (max - min) + min;
}

/**
 * Generates a day-ahead (24-hour) forecast by chaining single-step predictions.
 * @returns {Promise<Array>} A 24-length array where each element contains predicted [hvac, lighting, mels].
 */
async function getDayAheadForecast() {
    try {
        // 1️⃣ Fetch the last 8 hours of real data from MongoDB
        let windowData = await EnergyData.find().sort({ timestamp: -1 }).limit(8);

        if (windowData.length !== 8) {
            throw new Error("Not enough data for prediction");
        }

        // Reverse to get chronological order (oldest first)
        windowData.reverse();

        // Convert Mongoose documents to raw arrays of features and **normalize**
        let currentWindow = windowData.map(doc => [
            minMaxScale(doc.total_hvac ?? 0, minValues[0], maxValues[0]),
            minMaxScale(doc.total_lighting ?? 0, minValues[1], maxValues[1]),
            minMaxScale(doc.total_mels ?? 0, minValues[2], maxValues[2])
        ]);

        // Array to store the 24 predictions
        const dayAheadPredictions = [];

        // 2️⃣ Chain predictions for the next 24 hours
        for (let i = 0; i < 24; i++) {
            // Wrap the current window in an array to get shape (1, 8, 3)
            const formattedInput = [currentWindow];

            // Call the AI prediction endpoint
            const response = await axios.post("http://localhost:5005/predict", {
                features: formattedInput
            });

            // Get the AI model's predicted values
            const predictedRow = response.data.prediction[0];

            // 3️⃣ **Denormalize** the prediction values
            const denormalizedPrediction = [
                minMaxUnscale(predictedRow[0], minValues[0], maxValues[0]),
                minMaxUnscale(predictedRow[1], minValues[1], maxValues[1]),
                minMaxUnscale(predictedRow[2], minValues[2], maxValues[2])
            ];

            // Store the denormalized predictions
            dayAheadPredictions.push({
                hour: i + 1,
                total_hvac: denormalizedPrediction[0],
                total_lighting: denormalizedPrediction[1],
                total_mels: denormalizedPrediction[2]
            });

            // 4️⃣ Shift the window: remove oldest and add new prediction
            currentWindow.shift();
            currentWindow.push(predictedRow);
        }

        return dayAheadPredictions;
    } catch (error) {
        console.error("Error generating day-ahead forecast:", error);
        return null;
    }
}

module.exports = { getDayAheadForecast };