import React from 'react';
import { useNavigate } from 'react-router-dom';
import SensorDetailsPage from './SensorDetailsPage'; // Assumes SensorDetailsPage is defined similarly

function SensorsListPage({ sensorsData, onDataChanged }) {
    const navigate = useNavigate();

    // Handler when a sensor item is clicked
    const handleSensorClick = (sensor, index) => {
        // Navigate to the sensor details page, passing sensor data and callbacks via state
        navigate('/sensor-details', {
            state: {
                sensorData: sensor,
                sensorIndex: index,
                onUpdate: (updatedSensor) => {
                    // Create a new sensors array with the updated sensor
                    const newSensorsData = sensorsData.map((s, i) =>
                        i === index ? updatedSensor : s
                    );
                    onDataChanged(newSensorsData);
                },
                onDelete: () => {
                    // Create a new sensors array without the deleted sensor
                    const newSensorsData = sensorsData.filter((_, i) => i !== index);
                    onDataChanged(newSensorsData);
                    navigate(-1); // Navigate back to the previous page
                },
            },
        });
    };

    return (
        <div>
            {/* App Bar */}
            <header style={{ backgroundColor: '#6200EE', color: '#FFF', padding: '16px' }}>
                <h1>All IoT Sensors</h1>
            </header>

            {/* List of Sensors */}
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {sensorsData.map((sensor, index) => (
                    <li
                        key={sensor.sensor_id}
                        onClick={() => handleSensorClick(sensor, index)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '16px',
                            borderBottom: '1px solid #ccc',
                            cursor: 'pointer',
                        }}
                    >
                        {/* Leading icon (using an emoji as a placeholder for Icons.sensors) */}
                        <span style={{ marginRight: '16px' }}>🖧</span>
                        <div style={{ flex: 1 }}>
                            {/* Sensor ID */}
                            <div>{sensor.sensor_id}</div>
                            {/* Sensor category */}
                            <div>Category: {sensor.category}</div>
                        </div>
                        {/* Trailing arrow icon (using an emoji as a placeholder) */}
                        <span>➡️</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SensorsListPage;
