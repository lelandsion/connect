import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_charts/charts.dart';
import 'dashboard_page.dart';
import 'add_sensor_page.dart';

class TrendsPage extends StatelessWidget {
  final List<Map<String, dynamic>> sensorsData;

  TrendsPage({required this.sensorsData});

  @override
  Widget build(BuildContext context) {
    // Perform analysis on sensorsData to identify trends
    final trends = _analyzeTrends();

    return Scaffold(
      appBar: AppBar(
        title: Text('Trends and Power Saving Actions'),
        actions: [
          // Buttons as before
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Visualizations
            _buildEnergyUsageChart(),
            // Trend analysis
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: trends.isEmpty
                  ? Center(child: Text('No trends identified yet.'))
                  : ListView.builder(
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                itemCount: trends.length,
                itemBuilder: (context, index) {
                  final trend = trends[index];
                  return ListTile(
                    title: Text(trend['title'] ?? 'No title'),
                    subtitle: Text(trend['action'] ?? 'No action'),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEnergyUsageChart() {
    List<_ChartData> chartData = [];

    for (var sensor in sensorsData) {
      for (var dataPoint in sensor['data_points']) {
        DateTime timestamp = DateTime.fromMillisecondsSinceEpoch(
            int.parse(dataPoint['timestamp']) * 1000);
        double energyUsage =
            double.tryParse(dataPoint['energy_usage'].toString()) ?? 0;
        chartData.add(_ChartData(timestamp, energyUsage));
      }
    }

    chartData.sort((a, b) => a.timestamp.compareTo(b.timestamp));

    return SfCartesianChart(
      primaryXAxis: DateTimeAxis(),
      primaryYAxis: NumericAxis(title: AxisTitle(text: 'Energy Usage (kWh)')),
      title: ChartTitle(text: 'Energy Usage Over Time'),
      series: <ChartSeries>[
        LineSeries<_ChartData, DateTime>(
          dataSource: chartData,
          xValueMapper: (_ChartData data, _) => data.timestamp,
          yValueMapper: (_ChartData data, _) => data.energyUsage,
        ),
      ],
    );
  }

  List<Map<String, String>> _analyzeTrends() {
    // Simple analysis of sensorsData to identify trends
    List<Map<String, String>> trends = [];

    // Example trend: High energy usage in HVAC
    final hvacSensors = sensorsData.where((sensor) => sensor['category'] == 'HVAC');
    double totalHvacUsage = hvacSensors.fold(0, (sum, sensor) {
      return sum + (double.tryParse(sensor['energy_usage'].toString()) ?? 0);
    });

    if (totalHvacUsage > 100) {
      trends.add({
        'title': 'High HVAC energy usage detected',
        'action': 'Consider optimizing HVAC settings during off-peak hours.',
      });
    }

    // Add more trend analysis as needed

    return trends;
  }
}

class _ChartData {
  final DateTime timestamp;
  final double energyUsage;

  _ChartData(this.timestamp, this.energyUsage);
}
