import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddSensorPage({ onAddSensor }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        sensorId: "",
        category: "HVAC",
        energyUsage: "",
        additionalField: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const newSensor = {
            sensorId: formData.sensorId,
            category: formData.category,
            dataPoints: [
                {
                    timestamp: Date.now(),
                    energyUsage: formData.energyUsage,
                    additionalField: formData.additionalField,
                },
            ],
        };
        onAddSensor(newSensor);
        navigate("/");
    };

    return (
        <div style={styles.container}>
            <div style={styles.form}>
                <h1>Add Sensor</h1>
                <input
                    name="sensorId"
                    placeholder="Sensor ID"
                    value={formData.sensorId}
                    onChange={handleInputChange}
                    style={styles.input}
                />
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={styles.input}
                >
                    <option value="HVAC">HVAC</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Outlets">Outlets</option>
                    <option value="Doors">Doors</option>
                    <option value="Hot Water">Hot Water</option>
                    <option value="Laundry">Laundry</option>
                </select>
                <input
                    name="energyUsage"
                    placeholder="Energy Usage (kWh)"
                    value={formData.energyUsage}
                    onChange={handleInputChange}
                    style={styles.input}
                />
                <button onClick={handleSubmit} style={styles.button}>
                    Add Sensor
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full viewport height
        backgroundColor: "#f7f7f7", // Light background
    },
    form: {
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    },
    input: {
        width: "100%",
        padding: "0.5rem",
        margin: "0.5rem 0",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "1rem",
    },
    button: {
        width: "100%",
        padding: "0.75rem",
        marginTop: "1rem",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        fontSize: "1rem",
        cursor: "pointer",
    },
};

export default AddSensorPage;
