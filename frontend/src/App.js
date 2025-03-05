import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardPage from './components/DashboardPage';
import AddSensorPage from './components/AddSensorPage';
import TrendsPage from './components/TrendsPage';
import SensorDetailsPage from './components/SensorDetailsPage';
import SensorsListPage from './components/SensorsListPage';
import TimeSeriesPage from './components/TimeSeriesPage';

// Main App Component
function App() {
  const [sensorsData, setSensorsData] = useState(() => {
    const savedData = localStorage.getItem("sensorsData");
    return savedData ? JSON.parse(savedData) : [];
  });

  // Save data_preprocessing to localStorage whenever sensorsData changes
  useEffect(() => {
    localStorage.setItem("sensorsData", JSON.stringify(sensorsData));
  }, [sensorsData]);

  const addSensor = (newSensor) => {
    setSensorsData((prev) => [...prev, newSensor]);
  };

  const updateSensor = (index, updatedSensor) => {
    setSensorsData((prev) =>
        prev.map((sensor, i) => (i === index ? updatedSensor : sensor))
    );
  };

  const deleteSensor = (index) => {
    setSensorsData((prev) => prev.filter((_, i) => i !== index));
  };

  return (
      <Router>
        <Routes>
          <Route
              path="/"
              element={<DashboardPage sensorsData={sensorsData} />}
          />
          <Route
              path="/add-sensor"
              element={<AddSensorPage onAddSensor={addSensor} />}
          />
          <Route
              path="/trends"
              element={<TrendsPage sensorsData={sensorsData} />}
          />
          <Route
              path="/sensor-details"
              element={
                <SensorDetailsPage
                    sensorsData={sensorsData}
                    onUpdateSensor={updateSensor}
                    onDeleteSensor={deleteSensor}
                />
              }
          />
          <Route
            path="/sensors-list"
            element={
              <SensorsListPage
                sensorsData={sensorsData}
                onDataChanged={() => {
                /* Implement any additional behavior when the sensor data changes */
                }}
              />
            }
          />
          <Route
            path="/time-series"
            element={<TimeSeriesPage sensorsData={sensorsData} />}
          />
        </Routes>
      </Router>
  );
}

export default App;