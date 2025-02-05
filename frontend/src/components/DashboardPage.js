import React from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function DashboardPage({ sensorsData }) {
    const navigate = useNavigate();

    const calculateEnergyUsageByCategory = () => {
        const usage = {
            HVAC: 0,
            Lighting: 0,
            Outlets: 0,
            Doors: 0,
            "Hot Water": 0,
            Laundry: 0,
        };

        sensorsData.forEach((sensor) => {
            const totalUsage = sensor.dataPoints.reduce(
                (sum, point) => sum + parseFloat(point.energyUsage || 0),
                0
            );
            usage[sensor.category] += totalUsage;
        });

        return usage;
    };

    const energyUsage = calculateEnergyUsageByCategory();
    const hasData = Object.values(energyUsage).some((value) => value > 0);

    const chartData = {
        labels: hasData ? Object.keys(energyUsage) : ["No Data"],
        datasets: [
            {
                label: "Total Energy Usage by Category (kWh)",
                data: hasData
                    ? Object.keys(energyUsage).map((key) => energyUsage[key] || 0)
                    : [1], // Full circle for "No Data"
                backgroundColor: hasData
                    ? [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                        "#FF9F40",
                    ]
                    : ["#C0C0C0"], // Gray for no data_preprocessing
            },
        ],
    };

    const chartOptions = {
        responsive: false, // Set to false to respect fixed width/height
        maintainAspectRatio: false, // Prevent aspect ratio enforcement
        plugins: {
            legend: {
                position: "bottom",
            },
            tooltip: {
                callbacks: {
                    label: (context) =>
                        hasData
                            ? `${context.label}: ${context.raw} kWh`
                            : "No Data Available",
                },
            },
        },
        layout: {
            padding: 10,
        },
        elements: {
            arc: {
                borderWidth: 1,
                borderColor: hasData ? "#fff" : "#666", // Add a border
            },
        },
    };

    return (
        <div>
            <h1>Energy Usage Dashboard</h1>
            <h2>Total Energy Usage by Category (kWh)</h2>

            <div style={{display: "flex", justifyContent: "center"}}>
                <Pie data={chartData} options={chartOptions} width={700} height={700}/>
            </div>

            {!hasData && (
                <p style={{textAlign: "center", color: "#666", marginTop: "10px"}}>
                    No data available. Add sensors to start tracking energy usage!
                </p>
            )}
            <button onClick={() => navigate("/add-sensor")}>Add Sensor</button>
        </div>
    );
}

export default DashboardPage;