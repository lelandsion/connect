import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import DayAheadChart from "./DayAheadChart";

ChartJS.register(ArcElement, Tooltip, Legend);

function DashboardPage() {
    const navigate = useNavigate();
    const [energyUsage, setEnergyUsage] = useState(null);

    useEffect(() => {
        const fetchEnergyData = async () => {
            try {
                const response = await axios.get("http://localhost:5003/api/energy_data");
                const fetchedData = response.data;

                // Aggregate energy usage based on HVAC, Lighting, and MELs
                const usage = {
                    HVAC: 0,
                    Lighting: 0,
                    MELs: 0,  // Miscellaneous Electric Loads
                };

                fetchedData.forEach((entry) => {
                    usage.HVAC += entry.total_hvac || 0;
                    usage.Lighting += entry.total_lighting || 0;
                    usage.MELs += entry.total_mels || 0;
                });

                setEnergyUsage(usage);
            } catch (error) {
                console.error("Error fetching energy data:", error);
            }
        };

        fetchEnergyData();
    }, []);

    if (!energyUsage) return <p>Loading energy data...</p>;

    const hasData = Object.values(energyUsage).some((value) => value > 0);

    const chartData = {
        labels: hasData ? Object.keys(energyUsage) : ["No Data"],
        datasets: [
            {
                label: "Total Energy Usage by Category (kWh)",
                data: hasData ? Object.values(energyUsage) : [1],
                backgroundColor: hasData
                    ? ["#FF6384", "#36A2EB", "#FFCE56"] // Colors for HVAC, Lighting, MELs
                    : ["#C0C0C0"], // Gray for no data
            },
        ],
    };

    return (
        <div>
            <h1>Energy Usage Dashboard</h1>
            <h2>Total Energy Usage Breakdown (HVAC, Lighting, MELs)</h2>

            <div style={{ display: "flex", justifyContent: "center" }}>
                <Pie data={chartData} />
            </div>

            {!hasData && (
                <p style={{ textAlign: "center", color: "#666", marginTop: "10px" }}>
                    No data available. Add sensors to start tracking energy usage!
                </p>
            )}

            <button onClick={() => navigate("/day-ahead-forecast")}>
                View Day-Ahead Forecast
            </button>

            <h2>Day-Ahead Energy Forecast</h2>
            <DayAheadChart />
        </div>
    );
}

export default DashboardPage;