import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function SensorDetailsPage({ sensorData: initialPropData, onUpdate, onDelete}) {
    // Retrieve sensor data and callbacks from location state if not provided as props
    const location = useLocation();
    const initialSensorData = initialPropData || (location.state && location.state.sensorData);


    // Local copy of sensor data
    const [sensorData, setSensorData] = useState(initialSensorData || {});
    // Input states for the new data point
    const [timestamp, setTimestamp] = useState('');
    const [energyUsage, setEnergyUsage] = useState('');
    const [additionalField, setAdditionalField] = useState('');


    // If no sensor data is provided, render a fallback message.
    if (!initialSensorData) {
        return <div>No sensor data provided.</div>;
    }

    // Stub for picking a date/time (you can integrate a datetime picker library here)
    const pickDateTime = () => {
        // For example, you might open a modal or use an HTML date input.
    };

    // Adds a new data point to the sensor's data
    const addDataPoint = () => {
        const dataPoint = {
            timestamp: timestamp,
            energy_usage: energyUsage,
        };

        // Add additional fields based on the sensor category
        if (sensorData.category === 'HVAC' || sensorData.category === 'Outlets') {
            dataPoint.temperature = additionalField;
        } else if (sensorData.category === 'Lighting') {
            dataPoint.lighting_level = additionalField;
        } else if (sensorData.category === 'Hot Water') {
            dataPoint.water_usage = additionalField;
        }

        // Create an updated sensor object with the new data point added.
        const updatedSensorData = {
            ...sensorData,
            dataPoints: [...sensorData.dataPoints, dataPoint],
        };

        setSensorData(updatedSensorData);
        if (onUpdate) {
            onUpdate(updatedSensorData);
        }

        // Clear the input fields
        setTimestamp('');
        setEnergyUsage('');
        setAdditionalField('');
    };

    // Handle sensor deletion and navigate back
    const handleDelete = () => {
        if (onDelete) {
            onDelete();
        }
        window.history.back();
    };

    return (
        <div style={{ padding: '16px', fontFamily: 'sans-serif' }}>
            {/* App Bar */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Sensor Details: {sensorData.sensor_id}</h1>
                <button onClick={handleDelete}>Delete</button>
            </header>

            {/* Data Points List */}
            <div style={{ maxHeight: '300px', overflowY: 'auto', margin: '16px 0' }}>
                <ul>
                    {sensorData.dataPoints.map((dataPoint, index) => (
                        <li key={index} style={{ marginBottom: '8px' }}>
                            <div><strong>Timestamp:</strong> {dataPoint.timestamp}</div>
                            <div><strong>Energy Usage:</strong> {dataPoint.energy_usage} kWh</div>
                        </li>
                    ))}
                </ul>
            </div>

            <hr />

            {/* Form to add a new data point */}
            <div style={{ marginTop: '16px' }}>
                <div style={{ marginBottom: '8px' }}>
                    <label>
                        Timestamp (Unix Epoch):{' '}
                        <input
                            type="number"
                            value={timestamp}
                            onChange={(e) => setTimestamp(e.target.value)}
                            onFocus={pickDateTime}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: '8px' }}>
                    <label>
                        Energy Usage (kWh):{' '}
                        <input
                            type="number"
                            value={energyUsage}
                            onChange={(e) => setEnergyUsage(e.target.value)}
                        />
                    </label>
                </div>

                {/* Conditionally render additional field based on sensor category */}
                {(sensorData.category === 'HVAC' || sensorData.category === 'Outlets') && (
                    <div style={{ marginBottom: '8px' }}>
                        <label>
                            Temperature (Celsius):{' '}
                            <input
                                type="number"
                                value={additionalField}
                                onChange={(e) => setAdditionalField(e.target.value)}
                            />
                        </label>
                    </div>
                )}
                {sensorData.category === 'Lighting' && (
                    <div style={{ marginBottom: '8px' }}>
                        <label>
                            Lighting Level (Lux):{' '}
                            <input
                                type="number"
                                value={additionalField}
                                onChange={(e) => setAdditionalField(e.target.value)}
                            />
                        </label>
                    </div>
                )}
                {sensorData.category === 'Hot Water' && (
                    <div style={{ marginBottom: '8px' }}>
                        <label>
                            Water Usage (Liters):{' '}
                            <input
                                type="number"
                                value={additionalField}
                                onChange={(e) => setAdditionalField(e.target.value)}
                            />
                        </label>
                    </div>
                )}

                <button onClick={addDataPoint}>Add Data Point</button>
            </div>
        </div>
    );
}

export default SensorDetailsPage;
