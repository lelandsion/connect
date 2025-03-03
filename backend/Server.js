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
    .then(() => {
        console.log('Connected to MongoDB');
        console.log('Database name:', mongoose.connection.db.databaseName); // Logs the exact database name
        console.log('Host:', mongoose.connection.host);                     // Logs the host (cluster)
        console.log('Port:', mongoose.connection.port);                     // Logs the port, if available
    })
    .catch(err => console.error('MongoDB connection error:', err));

// const authRoutes = require('./routes/auth'); // Add this later
const sensorRoutes = require('./routes/sensors');  // New route for sensors
// const sensorDataRoutes = require('./routes/sensorData');  // New route for sensor readings
// const userRoutes = require('./routes/user');

// Route handlers
// app.use('/api/auth', authRoutes); // Add this later
app.use('/api/sensors', sensorRoutes);  // Manage IoT sensors
//app.use('/api/sensor-data', sensorDataRoutes);  // Store & retrieve sensor readings
//app.use('/api/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// this is working