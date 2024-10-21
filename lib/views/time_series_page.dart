import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_charts/charts.dart';
import 'package:intl/intl.dart';

/// A page that displays energy usage over time in a time series chart.
///
/// This page analyzes sensor data to identify peak traffic times and trends
/// in energy usage, providing a visual representation through charts.
class TimeSeriesPage extends StatelessWidget {
  final List<Map<String, dynamic>> sensorsData; // List of sensors data

  TimeSeriesPage({required this.sensorsData});

  @override
  Widget build(BuildContext context) {
    final chartData = _buildChartData(); // Prepare chart data
    final peakTimes = _identifyPeakTrafficTimes(chartData); // Identify peak traffic times
    final trends = _analyzeTrends(); // Analyze trends in energy usage

    return Scaffold(
      appBar: AppBar(
        title: Text('Energy Usage Over Time'), // Title of the page
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Time Series Chart
            _buildTimeSeriesChart(chartData, peakTimes),
            SizedBox(height: 16),
            // Display peak traffic times
            _buildPeakTrafficAnalysis(peakTimes),
            SizedBox(height: 16),
            // Display identified trends
            _buildTrendAnalysis(trends),
          ],
        ),
      ),
    );
  }

  /// Builds the chart data based on the sensors data.
  List<_ChartData> _buildChartData() {
    List<_ChartData> chartData = [];

    // Iterate over sensors data to create chart data points
    for (var sensor in sensorsData) {
      for (var dataPoint in sensor['data_points']) {
        DateTime timestamp = DateTime.fromMillisecondsSinceEpoch(
            (int.parse(dataPoint['timestamp']) * 1000)); // Convert timestamp
        double energyUsage =
            double.tryParse(dataPoint['energy_usage'].toString()) ?? 0; // Parse energy usage
        chartData.add(_ChartData(timestamp, energyUsage)); // Add data to chart
      }
    }

    // Sort chart data by timestamp
    chartData.sort((a, b) => a.timestamp.compareTo(b.timestamp));
    return chartData; // Return sorted chart data
  }

  /// Identifies peak traffic times based on energy usage threshold.
  List<_ChartData> _identifyPeakTrafficTimes(List<_ChartData> chartData) {
    // Calculate the average energy usage
    double averageUsage = chartData.fold(0.0, (double sum, data) => sum + data.energyUsage) / chartData.length;

    // Set a dynamic threshold (150% of the average usage)
    double threshold = averageUsage * 1.5;

    // Identify peaks where energy usage exceeds the threshold
    return chartData.where((data) => data.energyUsage > threshold).toList();
  }

  /// Builds the time series chart with highlighted peak times.
  Widget _buildTimeSeriesChart(List<_ChartData> chartData, List<_ChartData> peakTimes) {
    return SfCartesianChart(
      primaryXAxis: DateTimeAxis(),
      primaryYAxis: NumericAxis(title: AxisTitle(text: 'Energy Usage (kWh)')),
      title: ChartTitle(text: 'Energy Usage Over Time'),
      series: <ChartSeries>[
        LineSeries<_ChartData, DateTime>(
          dataSource: chartData,
          xValueMapper: (_ChartData data, _) => data.timestamp,
          yValueMapper: (_ChartData data, _) => data.energyUsage,
          dataLabelSettings: DataLabelSettings(isVisible: true),
        ),
        // Highlight the peak times with scatter points
        ScatterSeries<_ChartData, DateTime>(
          dataSource: peakTimes,
          xValueMapper: (_ChartData data, _) => data.timestamp,
          yValueMapper: (_ChartData data, _) => data.energyUsage,
          color: Colors.red, // Red color for peak times
          markerSettings: MarkerSettings(isVisible: true, shape: DataMarkerType.circle),
        ),
      ],
    );
  }

  /// Builds the list of identified peak traffic times.
  Widget _buildPeakTrafficAnalysis(List<_ChartData> peakTimes) {
    if (peakTimes.isEmpty) {
      return Padding(
        padding: const EdgeInsets.all(16.0),
        child: Text('No peak traffic times identified.'),
      );
    }

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Peak Traffic Times',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          ListView.builder(
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            itemCount: peakTimes.length,
            itemBuilder: (context, index) {
              final peakTime = peakTimes[index];
              return ListTile(
                title: Text('Time: ${DateFormat('yyyy-MM-dd HH:mm').format(peakTime.timestamp)}'),
                subtitle: Text('Energy Usage: ${peakTime.energyUsage} kWh'),
              );
            },
          ),
        ],
      ),
    );
  }

  /// Analyzes trends based on sensor data.
  List<Map<String, dynamic>> _analyzeTrends() {
    List<Map<String, dynamic>> trends = [];

    // Example: Detect high usage for HVAC during specific hours
    final hvacData = sensorsData.where((sensor) => sensor['category'] == 'HVAC');
    Map<String, double> hourlyUsage = {};

    for (var sensor in hvacData) {
      for (var dataPoint in sensor['data_points']) {
        DateTime timestamp = DateTime.fromMillisecondsSinceEpoch(int.parse(dataPoint['timestamp']) * 1000);
        double usage = double.tryParse(dataPoint['energy_usage'].toString()) ?? 0;

        String hour = DateFormat('HH').format(timestamp); // Group by hour
        hourlyUsage[hour] = (hourlyUsage[hour] ?? 0) + usage; // Accumulate usage by hour
      }
    }

    // Detect peak times where energy usage exceeds the average significantly
    double average = hourlyUsage.values.fold(0.0, (double sum, val) => sum + val) / hourlyUsage.length;
    double threshold = average * 1.5; // Set threshold as 150% of average

    hourlyUsage.forEach((hour, usage) {
      if (usage > threshold) {
        trends.add({
          'title': 'High HVAC Usage Detected',
          'action': 'Consider optimizing HVAC settings during peak hours (Hour: $hour).',
          'hour': hour,
          'usage': usage,
        });
      }
    });

    return trends; // Return the list of detected trends
  }

  /// Displays the trend analysis results.
  Widget _buildTrendAnalysis(List<Map<String, dynamic>> trends) {
    if (trends.isEmpty) {
      return Padding(
        padding: const EdgeInsets.all(16.0),
        child: Text('No significant trends identified.'),
      );
    }

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Detected Trends:',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          ListView.builder(
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            itemCount: trends.length,
            itemBuilder: (context, index) {
              final trend = trends[index];
              return ListTile(
                title: Text(trend['title']),
                subtitle: Text('Recommended Action: ${trend['action']} \n'
                    'Hour: ${trend['hour']} - Usage: ${trend['usage']} kWh'),
              );
            },
          ),
        ],
      ),
    );
  }
}

/// Class to define chart data points for energy usage.
class _ChartData {
  final DateTime timestamp; // The timestamp of the data point
  final double energyUsage; // The energy usage value at that timestamp

  _ChartData(this.timestamp, this.energyUsage); // Constructor
}
