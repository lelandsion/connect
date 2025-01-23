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
        <div>
            <h1>Add Sensor</h1>
            <input
                name="sensorId"
                placeholder="Sensor ID"
                value={formData.sensorId}
                onChange={handleInputChange}
            />
            <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
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
            />
            <button onClick={handleSubmit}>Add Sensor</button>
        </div>
    );
}

export default AddSensorPage;
