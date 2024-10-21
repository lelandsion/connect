import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_charts/charts.dart';
import 'add_sensor_page.dart';
import 'trends_page.dart';
import 'sensors_list_page.dart'; // Import for the SensorsListPage
import 'time_series_page.dart';

/// A page that displays the energy usage dashboard for IoT sensors.
/// It allows users to view energy consumption statistics, add new sensors,
/// and navigate to different pages for detailed insights.
class DashboardPage extends StatefulWidget {
  final List<Map<String, dynamic>> sensorsData; // List of sensor data
  final Function onDataChanged; // Callback to notify parent of data changes

  DashboardPage({required this.sensorsData, required this.onDataChanged});

  @override
  _DashboardPageState createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  late List<Map<String, dynamic>> sensorsData; // Local copy of sensor data

  @override
  void initState() {
    super.initState();
    sensorsData = widget.sensorsData; // Initialize with data passed from the parent
  }

  @override
  Widget build(BuildContext context) {
    final totalSensors = sensorsData.length; // Total number of sensors
    final energyUsageByCategory = _calculateEnergyUsageByCategory(); // Calculate energy usage

    return Scaffold(
      appBar: AppBar(
        title: Text('Energy Usage Dashboard'),
        actions: [
          // Button to navigate to the Sensors List Page
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
          // Additional buttons can be added here for other functionalities
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Pie Chart for visualizing energy usage by category
            _buildPieChart(energyUsageByCategory),
            SizedBox(height: 16),
            // Button to navigate to Add Sensor Page
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
                    sensorsData.add(newSensor); // Add the new sensor data
                    widget.onDataChanged();  // Notify parent of data change
                  });
                }
              },
              child: Text('Add IoT Sensor'),
            ),
            SizedBox(height: 16),
            // Display the sensor visuals or a message if no sensors are added
            Expanded(
              child: totalSensors > 10
                  ? Text('You have added $totalSensors IoT sensors.')
                  : GridView.builder(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2),
                itemCount: totalSensors,
                itemBuilder: (context, index) {
                  final sensor = sensorsData[index];
                  return _buildSensorVisual(sensor, index);  // Pass index for deletion
                },
              ),
            ),
          ],
        ),
      ),
      // Bottom Navigation Bar for accessing other pages
      bottomNavigationBar: BottomAppBar(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            // Button to remain on the Dashboard Page
            IconButton(
              icon: Icon(Icons.dashboard),
              onPressed: () {}, // Already on DashboardPage
            ),
            // Button to navigate to Time Series Page
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
            // Button to add a new sensor
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
                    sensorsData.add(newSensor); // Add new sensor data
                  });
                }
              },
            ),
            // Button to navigate to the Sensors List Page
            IconButton(
              icon: Icon(Icons.list),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => SensorsListPage(
                      sensorsData: sensorsData,
                      onDataChanged: widget.onDataChanged, // Pass the callback
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

  /// Calculates total energy usage by category from the sensor data.
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

    return usageByCategory; // Return the calculated usage
  }

  /// Builds a pie chart to display energy usage by category.
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

  /// Builds a visual representation of a sensor.
  Widget _buildSensorVisual(Map<String, dynamic> sensor, int index) {
    String category = sensor['category'];
    IconData iconData;
    Color color;

    // Determine icon and color based on sensor category
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
              _removeSensor(index); // Call the method to remove the sensor
            },
          ),
        ],
      ),
    );
  }

  /// Removes a sensor from the list based on its index.
  void _removeSensor(int index) {
    setState(() {
      sensorsData.removeAt(index); // Remove the sensor at the specified index
      widget.onDataChanged();  // Notify parent of data change
    });
  }
}
