import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_charts/charts.dart';
import 'dashboard_page.dart';
import 'add_sensor_page.dart';

/// A page that displays trends in energy usage and suggests power-saving actions.
///
/// This page visualizes energy usage data over time and analyzes the data
/// to identify significant trends that may indicate potential optimizations.
class TrendsPage extends StatelessWidget {
  final List<Map<String, dynamic>> sensorsData; // List of sensors data

  TrendsPage({required this.sensorsData});

  @override
  Widget build(BuildContext context) {
    // Perform analysis on sensorsData to identify trends
    final trends = _analyzeTrends();

    return Scaffold(
      appBar: AppBar(
        title: Text('Trends and Power Saving Actions'), // Title of the app bar
        actions: [
          // Add navigation buttons as needed
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Visualization of energy usage data
            _buildEnergyUsageChart(),
            // Display trend analysis results
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: trends.isEmpty
                  ? Center(child: Text('No trends identified yet.')) // No trends found message
                  : ListView.builder(
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                itemCount: trends.length,
                itemBuilder: (context, index) {
                  final trend = trends[index];
                  return ListTile(
                    title: Text(trend['title'] ?? 'No title'), // Display trend title
                    subtitle: Text(trend['action'] ?? 'No action'), // Display recommended action
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Builds a chart visualizing energy usage over time.
  Widget _buildEnergyUsageChart() {
    List<_ChartData> chartData = [];

    // Collect data points for the chart from sensorsData
    for (var sensor in sensorsData) {
      for (var dataPoint in sensor['data_points']) {
        DateTime timestamp = DateTime.fromMillisecondsSinceEpoch(
            int.parse(dataPoint['timestamp']) * 1000); // Convert timestamp
        double energyUsage =
            double.tryParse(dataPoint['energy_usage'].toString()) ?? 0; // Parse energy usage
        chartData.add(_ChartData(timestamp, energyUsage)); // Add to chart data
      }
    }

    // Sort chart data by timestamp
    chartData.sort((a, b) => a.timestamp.compareTo(b.timestamp));

    return SfCartesianChart(
      primaryXAxis: DateTimeAxis(), // X-axis for timestamps
      primaryYAxis: NumericAxis(title: AxisTitle(text: 'Energy Usage (kWh)')), // Y-axis for energy usage
      title: ChartTitle(text: 'Energy Usage Over Time'), // Chart title
      series: <ChartSeries>[
        LineSeries<_ChartData, DateTime>(
          dataSource: chartData, // Data source for the line chart
          xValueMapper: (_ChartData data, _) => data.timestamp, // X value mapping
          yValueMapper: (_ChartData data, _) => data.energyUsage, // Y value mapping
        ),
      ],
    );
  }

  /// Analyzes trends based on the sensors data and identifies significant energy usage.
  List<Map<String, String>> _analyzeTrends() {
    List<Map<String, String>> trends = []; // List to store identified trends

    // Example trend: High energy usage in HVAC
    final hvacSensors = sensorsData.where((sensor) => sensor['category'] == 'HVAC');
    double totalHvacUsage = hvacSensors.fold(0, (sum, sensor) {
      return sum + (double.tryParse(sensor['energy_usage'].toString()) ?? 0); // Aggregate usage
    });

    // Identify if total HVAC usage exceeds a threshold
    if (totalHvacUsage > 100) {
      trends.add({
        'title': 'High HVAC energy usage detected',
        'action': 'Consider optimizing HVAC settings during off-peak hours.', // Suggested action
      });
    }

    // Additional trend analysis can be added here

    return trends; // Return the list of identified trends
  }
}

/// Class to define chart data points for energy usage.
class _ChartData {
  final DateTime timestamp; // The timestamp of the data point
  final double energyUsage; // The energy usage value at that timestamp

  _ChartData(this.timestamp, this.energyUsage); // Constructor
}
