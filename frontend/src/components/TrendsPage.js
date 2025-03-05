import React from 'react';
// Import the React wrapper components from @syncfusion/ej2-react-charts
import {
    ChartComponent,
    SeriesCollectionDirective,
    SeriesDirective,
    Inject
} from '@syncfusion/ej2-react-charts';
// Import the chart modules from the core package @syncfusion/ej2-charts
import {
    LineSeries,
    ScatterSeries,
    DateTime,
    Legend,
    Tooltip
} from '@syncfusion/ej2-charts';

function TrendsPage({ sensorsData }) {
    // Builds the chart data by iterating over sensorsData.
    const buildEnergyUsageChartData = () => {
        const chartData = [];
        sensorsData.forEach(sensor => {
            sensor.dataPoints.forEach(dataPoint => {
                // Convert Unix epoch (in seconds) to JavaScript Date object.
                const timestamp = new Date(parseInt(dataPoint.timestamp, 10) * 1000);
                const energyUsage = parseFloat(dataPoint.energy_usage) || 0;
                chartData.push({ timestamp, energyUsage });
            });
        });
        // Sort data points by timestamp.
        chartData.sort((a, b) => a.timestamp - b.timestamp);
        return chartData;
    };

    const chartData = buildEnergyUsageChartData();

    // Define peakTimes as a subset of chartData (for example, energyUsage above a threshold)
    const threshold = 100; // adjust this value as needed
    const peakTimes = chartData.filter(data => data.energyUsage > threshold);


    // Analyzes trends based on sensorsData. In this example, we aggregate energy usage for HVAC sensors.
    const analyzeTrends = () => {
        const trends = [];
        // Filter sensors for the HVAC category.
        const hvacSensors = sensorsData.filter(sensor => sensor.category === 'HVAC');
        // Aggregate energy usage from each HVAC sensor.
        const totalHvacUsage = hvacSensors.reduce((sum, sensor) => {
            // Note: Ensure sensor.energy_usage exists; otherwise, default to 0.
            return sum + (parseFloat(sensor.energy_usage ? sensor.energy_usage.toString() : '0') || 0);
        }, 0);
        // If usage exceeds a threshold, add a trend.
        if (totalHvacUsage > 100) {
            trends.push({
                title: 'High HVAC energy usage detected',
                action: 'Consider optimizing HVAC settings during off-peak hours.',
            });
        }
        // Additional trend analyses can be added here.
        return trends;
    };

    const trends = analyzeTrends();


    return (
        <div style={{ fontFamily: 'sans-serif' }}>
            {/* App Bar */}
            <header style={{ backgroundColor: '#6200EE', color: '#FFF', padding: '16px' }}>
                <h1>Trends and Power Saving Actions</h1>
            </header>
            <div style={{ padding: '16px' }}>
                {/* Energy Usage Chart */}
                <ChartComponent
                    primaryXAxis={{ valueType: 'DateTime' }}
                    primaryYAxis={{ title: 'Energy Usage (kWh)' } }
                    title="Energy Usage Over Time"
                    tooltip={{ enable: true }}
                >
                    <Inject services={[LineSeries, ScatterSeries, DateTime, Legend, Tooltip]} />
                    <SeriesCollectionDirective>
                        <SeriesDirective
                            dataSource={chartData}
                            xName="timestamp"
                            yName="energyUsage"
                            type="Line"
                            marker={{ visible: true }}
                        />
                        <SeriesDirective
                            dataSource={peakTimes}
                            xName="timestamp"
                            yName="energyUsage"
                            type="Scatter"
                            marker={{ visible: true, shape: 'Circle' }}
                            fill="red"
                        />
                    </SeriesCollectionDirective>
                </ChartComponent>
                {/* Trend Analysis */}
                <div style={{ padding: '16px' }}>
                    {trends.length === 0 ? (
                        <div style={{ textAlign: 'center' }}>No trends identified yet.</div>
                    ) : (
                        trends.map((trend, index) => (
                            <div
                                key={index}
                                style={{
                                    marginBottom: '16px',
                                    borderBottom: '1px solid #ccc',
                                    paddingBottom: '8px',
                                }}
                            >
                                <h3>{trend.title || 'No title'}</h3>
                                <p>{trend.action || 'No action'}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default TrendsPage;
