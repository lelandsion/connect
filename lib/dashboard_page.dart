import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_charts/charts.dart';
import 'add_sensor_page.dart';
import 'trends_page.dart';
import 'sensors_list_page.dart'; // Import this in dashboard_page.dart
import 'time_series_page.dart';

class DashboardPage extends StatefulWidget {
  final List<Map<String, dynamic>> sensorsData;
  final Function onDataChanged;

  DashboardPage({required this.sensorsData, required this.onDataChanged});

  @override
  _DashboardPageState createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  late List<Map<String, dynamic>> sensorsData;

  @override
  void initState() {
    super.initState();
    sensorsData = widget.sensorsData;
  }

  @override
  Widget build(BuildContext context) {
    final totalSensors = sensorsData.length;
    final energyUsageByCategory = _calculateEnergyUsageByCategory();

    return Scaffold(
      appBar: AppBar(
        title: Text('Energy Usage Dashboard'),
        actions: [
          IconButton(
            icon: Icon(Icons.list),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => SensorsListPage(
                    sensorsData: sensorsData,
                    onDataChanged: widget.onDataChanged, // Pass the callback here
                  ),
                ),
              );
            },
          ),
          // Button to navigate to Trends Page

        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Pie Chart
            _buildPieChart(energyUsageByCategory),
            SizedBox(height: 16),
            // Add IoT Sensor Button
            ElevatedButton(
              onPressed: () async {
                // Navigate to AddSensorPage and await for new sensor data
                final newSensor = await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => AddSensorPage(),
                  ),
                );

                if (newSensor != null) {
                  setState(() {
                    sensorsData.add(newSensor);
                    widget.onDataChanged();  // Save the data after adding a sensor
                  });
                }
              },
              child: Text('Add IoT Sensor'),
            ),
            SizedBox(height: 16),
            // Sensor Visuals
            Expanded(
              child: totalSensors > 10
                  ? Text('You have added $totalSensors IoT sensors.')
                  : GridView.builder(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2),
                itemCount: totalSensors,
                itemBuilder: (context, index) {
                  final sensor = sensorsData[index];
                  return _buildSensorVisual(sensor, index);  // Pass index here
                },
              )
            ),
          ],
        ),
      ),
      // Bottom Navigation to access other pages
      bottomNavigationBar: BottomAppBar(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            IconButton(
              icon: Icon(Icons.dashboard),
              onPressed: () {}, // Already on DashboardPage
            ),
            IconButton(
              icon: Icon(Icons.timeline),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => TimeSeriesPage(sensorsData: sensorsData),
                  ),
                );
              },
            ),
            IconButton(
              icon: Icon(Icons.add),
              onPressed: () async {
                // Navigate to AddSensorPage and await for new sensor data
                final newSensor = await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => AddSensorPage(),
                  ),
                );

                if (newSensor != null) {
                  setState(() {
                    sensorsData.add(newSensor);
                  });
                }
              },
            ),
            IconButton(
              icon: Icon(Icons.list),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => SensorsListPage(
                      sensorsData: sensorsData,
                      onDataChanged: widget.onDataChanged,  // Add this line to pass the callback
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Map<String, double> _calculateEnergyUsageByCategory() {
    Map<String, double> usageByCategory = {
      'HVAC': 0,
      'Lighting': 0,
      'Outlets': 0,
      'Doors': 0,
      'Hot Water': 0,
      'Laundry': 0,
    };

    for (var sensor in sensorsData) {
      String category = sensor['category'];
      double totalSensorUsage = sensor['data_points'].fold(0, (sum, dataPoint) {
        return sum + (double.tryParse(dataPoint['energy_usage'].toString()) ?? 0);
      });

      if (usageByCategory.containsKey(category)) {
        usageByCategory[category] = usageByCategory[category]! + totalSensorUsage;
      }
    }

    return usageByCategory;
  }


  Widget _buildPieChart(Map<String, double> energyUsageByCategory) {
    return SfCircularChart(
      title: ChartTitle(text: 'Total Energy Usage by Category (kWh)'),
      legend: Legend(isVisible: true),
      series: <CircularSeries>[
        PieSeries<MapEntry<String, double>, String>(
          dataSource: energyUsageByCategory.entries.toList(),
          xValueMapper: (MapEntry<String, double> data, _) => data.key,
          yValueMapper: (MapEntry<String, double> data, _) => data.value,
          dataLabelSettings: DataLabelSettings(isVisible: true),
        )
      ],
    );
  }

  Widget _buildSensorVisual(Map<String, dynamic> sensor, int index) {
    String category = sensor['category'];
    IconData iconData;
    Color color;

    switch (category) {
      case 'HVAC':
        iconData = Icons.ac_unit;
        color = Colors.blue;
        break;
      case 'Lighting':
        iconData = Icons.lightbulb_outline;
        color = Colors.yellow;
        break;
      case 'Outlets':
        iconData = Icons.power;
        color = Colors.green;
        break;
      case 'Doors':
        iconData = Icons.door_front_door;
        color = Colors.orange;
        break;
      case 'Hot Water':
        iconData = Icons.water;
        color = Colors.lightBlue;
        break;
      case 'Laundry':
        iconData = Icons.local_laundry_service;
        color = Colors.purple;
        break;
      default:
        iconData = Icons.device_unknown;
        color = Colors.grey;
    }

    return Card(
      color: color.withOpacity(0.2),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(iconData, size: 50, color: color),
          SizedBox(height: 8),
          Text(sensor['sensor_id'], style: TextStyle(fontWeight: FontWeight.bold)),
          Text('${sensor['energy_usage']} kWh'),
          IconButton(
            icon: Icon(Icons.delete, color: Colors.red),
            onPressed: () {
              _removeSensor(index);
            },
          ),
        ],
      ),
    );
  }

  void _removeSensor(int index) {
    setState(() {
      sensorsData.removeAt(index);
      widget.onDataChanged();  // Save the data after removing a sensor
    });
  }
// ... (Rest of the code remains the same, including _buildPieChart and _buildSensorVisual methods)
}
