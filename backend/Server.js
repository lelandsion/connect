const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const uri = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5003;
const clientOptions = { };

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.set('debug', true);
mongoose.connect(uri, clientOptions)
    .then(async () => {
        console.log('Connected to MongoDB.');
        console.log('Database name:', mongoose.connection.db.databaseName); // Logs the exact database name
        console.log('Host:', mongoose.connection.host);                     // Logs the host (cluster)
        console.log('Port:', mongoose.connection.port || "Default MongoDB Port");

        try {
            const collection = await mongoose.connection.db.collection('energy_data');
            console.log("Using collection:", collection.collectionName);
        } catch (err) {
            console.error("Collection not found:", err);
        }
    })
    .catch(err => console.error('MongoDB connection error:', err));

// const authRoutes = require('./routes/auth'); // Add this later
const sensorRoutes = require('./routes/sensors');  // New route for sensors
const energyDataRoutes = require('./routes/energy_data');  // New route for sensor readings
// const userRoutes = require('./routes/user');

// Route handlers
app.get("/", (req, res) => {
    res.send("Backend is running!");
});
// app.use('/api/auth', authRoutes); // Add this later
app.use('/api/sensors', sensorRoutes);  // Manage IoT sensors
app.use('/api/energy_data', energyDataRoutes);  // Store & retrieve sensor readings
//app.use('/api/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

