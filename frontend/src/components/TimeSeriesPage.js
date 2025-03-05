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


function TimeSeriesPage({ sensorsData }) {
    // Builds the chart data based on the sensors data.
    const buildChartData = () => {
        const chartData = [];
        sensorsData.forEach((sensor) => {
            sensor.dataPoints.forEach((dataPoint) => {
                // Convert timestamp (assumed to be a Unix Epoch string) into a Date object
                const timestamp = new Date(parseInt(dataPoint.timestamp) * 1000);
                // Parse energy usage, defaulting to 0 if parsing fails
                const energyUsage = parseFloat(dataPoint.energy_usage) || 0;
                chartData.push({ timestamp, energyUsage });
            });
        });
        // Sort the data by timestamp
        chartData.sort((a, b) => a.timestamp - b.timestamp);
        return chartData;
    };

    // Identifies peak traffic times based on a dynamic threshold (150% of average energy usage)
    const identifyPeakTrafficTimes = (chartData) => {
        if (chartData.length === 0) return [];
        const totalUsage = chartData.reduce((sum, data) => sum + data.energyUsage, 0);
        const averageUsage = totalUsage / chartData.length;
        const threshold = averageUsage * 1.5;
        return chartData.filter((data) => data.energyUsage > threshold);
    };

    // Analyzes trends based on sensor data. Example: Aggregates HVAC usage by hour.
    const analyzeTrends = () => {
        const trends = [];
        // Filter sensors for the HVAC category
        const hvacSensors = sensorsData.filter((sensor) => sensor.category === 'HVAC');
        const hourlyUsage = {};

        hvacSensors.forEach((sensor) => {
            sensor.dataPoints.forEach((dataPoint) => {
                const timestamp = new Date(parseInt(dataPoint.timestamp) * 1000);
                const usage = parseFloat(dataPoint.energy_usage) || 0;
                // Group by hour (using the "HH" portion from ISO string)
                const hour = timestamp.toISOString().substr(11, 2);
                hourlyUsage[hour] = (hourlyUsage[hour] || 0) + usage;
            });
        });

        const hours = Object.keys(hourlyUsage);
        if (hours.length === 0) return trends;
        const totalHourly = hours.reduce((sum, hour) => sum + hourlyUsage[hour], 0);
        const averageHourly = totalHourly / hours.length;
        const threshold = averageHourly * 1.5;

        Object.entries(hourlyUsage).forEach(([hour, usage]) => {
            if (usage > threshold) {
                trends.push({
                    title: 'High HVAC Usage Detected',
                    action: `Consider optimizing HVAC settings during peak hours (Hour: ${hour}).`,
                    hour,
                    usage,
                });
            }
        });

        return trends;
    };

    // Helper function to format a Date object into 'yyyy-MM-dd HH:mm'
    const formatDate = (date) => {
        return date.toISOString().replace('T', ' ').substring(0, 16);
    };

    // Prepare data for the chart and analyses
    const chartData = buildChartData();
    const peakTimes = identifyPeakTrafficTimes(chartData);
    const trends = analyzeTrends();

    return (
        <div style={{ padding: '16px', fontFamily: 'sans-serif' }}>
            {/* App Bar */}
            <header style={{ backgroundColor: '#6200EE', color: '#FFF', padding: '16px' }}>
                <h1>Energy Usage Over Time</h1>
            </header>

            <div style={{ marginTop: '16px' }}>
                {/* Time Series Chart */}
                <ChartComponent
                    title="Energy Usage Over Time"
                    primaryXAxis={{ valueType: 'DateTime' }}
                    primaryYAxis={{ title: 'Energy Usage (kWh)' }}
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
                        {/* Highlight peak traffic times with scatter points */}
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

                <div style={{ height: '16px' }} />

                {/* Display Peak Traffic Times */}
                <div style={{ padding: '16px' }}>
                    <h2>Peak Traffic Times</h2>
                    {peakTimes.length === 0 ? (
                        <p>No peak traffic times identified.</p>
                    ) : (
                        <ul>
                            {peakTimes.map((peakTime, index) => (
                                <li key={index}>
                                    <strong>Time:</strong> {formatDate(peakTime.timestamp)} <br />
                                    <strong>Energy Usage:</strong> {peakTime.energyUsage} kWh
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div style={{ height: '16px' }} />

                {/* Display Trend Analysis */}
                <div style={{ padding: '16px' }}>
                    <h2>Detected Trends:</h2>
                    {trends.length === 0 ? (
                        <p>No significant trends identified.</p>
                    ) : (
                        <ul>
                            {trends.map((trend, index) => (
                                <li key={index}>
                                    <strong>{trend.title}</strong>
                                    <p>Recommended Action: {trend.action}</p>
                                    <p>
                                        Hour: {trend.hour} - Usage: {trend.usage} kWh
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TimeSeriesPage;
