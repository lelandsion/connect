import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    CategoryScale
} from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

const DayAheadChart = () => {
    const [forecastData, setForecastData] = useState([]);

    useEffect(() => {
        // Fetch day-ahead forecast
        const fetchForecast = async () => {
            try {
                const response = await axios.get("http://localhost:5003/api/energy_data/day-ahead");
                setForecastData(response.data.forecast);
            } catch (error) {
                console.error("Error fetching forecast:", error);
            }
        };

        fetchForecast();
    }, []);

    // If no data, show loading
    if (forecastData.length === 0) {
        return <p>Loading forecast data...</p>;
    }

    // Extract x-axis (hours) and y-axis data (HVAC, Lighting, MELs)
    const hours = forecastData.map(entry => entry.hour);
    const hvacValues = forecastData.map(entry => entry.total_hvac);
    const lightingValues = forecastData.map(entry => entry.total_lighting);
    const melsValues = forecastData.map(entry => entry.total_mels);

    // Chart.js Data
    const data = {
        labels: hours,
        datasets: [
            {
                label: "HVAC (kWh)",
                data: hvacValues,
                borderColor: "red",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                fill: true
            },
            {
                label: "Lighting (kWh)",
                data: lightingValues,
                borderColor: "blue",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                fill: true
            },
            {
                label: "MELs (kWh)",
                data: melsValues,
                borderColor: "green",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true
            }
        ]
    };

    // Chart.js Options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top"
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Hours Ahead"
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Energy Consumption (kWh)"
                },
                beginAtZero: true
            }
        }
    };

    return (
        <div style={{ width: "80%", height: "400px", margin: "auto" }}>
            <h2>24-Hour Energy Forecast</h2>
            <Line data={data} options={options} />
        </div>
    );
};

export default DayAheadChart;