import 'package:flutter/material.dart';

/// A page that displays details for a specific sensor and allows
/// users to add data points related to energy usage.
///
/// This page provides an interface for viewing existing data points
/// and adding new ones, along with options to delete the sensor.
class SensorDetailsPage extends StatefulWidget {
  final Map<String, dynamic> sensorData; // Sensor data passed from the previous page
  final Function(Map<String, dynamic>) onUpdate; // Callback to update the sensor data
  final Function onDelete; // Callback to delete the sensor

  SensorDetailsPage({
    required this.sensorData,
    required this.onUpdate,
    required this.onDelete,
  });

  @override
  _SensorDetailsPageState createState() => _SensorDetailsPageState();
}

class _SensorDetailsPageState extends State<SensorDetailsPage> {
  late Map<String, dynamic> sensorData; // Local copy of sensor data
  final TextEditingController _energyUsageController = TextEditingController(); // Controller for energy usage input
  final TextEditingController _additionalFieldController = TextEditingController(); // Controller for additional fields
  final TextEditingController _timestampController = TextEditingController(); // Controller for timestamp input

  @override
  void initState() {
    super.initState();
    sensorData = widget.sensorData; // Initialize sensor data
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Sensor Details: ${sensorData['sensor_id']}'), // Display sensor ID in the app bar
        actions: [
          // Button to delete the sensor
          IconButton(
            icon: Icon(Icons.delete),
            onPressed: () {
              widget.onDelete(); // Call the delete callback
              Navigator.pop(context); // Navigate back to the previous page
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Display sensor data points in a list
          Expanded(
            child: ListView.builder(
              itemCount: sensorData['data_points'].length,
              itemBuilder: (context, index) {
                final dataPoint = sensorData['data_points'][index]; // Get data point
                return ListTile(
                  title: Text('Timestamp: ${dataPoint['timestamp']}'), // Display timestamp
                  subtitle: Text('Energy Usage: ${dataPoint['energy_usage']} kWh'), // Display energy usage
                );
              },
            ),
          ),
          Divider(),
          // Form to add a new data point
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                // Input field for Timestamp
                TextField(
                  controller: _timestampController,
                  decoration: InputDecoration(labelText: 'Timestamp (Unix Epoch)'),
                  keyboardType: TextInputType.number,
                  onTap: _pickDateTime, // Open date/time picker
                ),
                // Input field for Energy Usage
                TextField(
                  controller: _energyUsageController,
                  decoration: InputDecoration(labelText: 'Energy Usage (kWh)'),
                  keyboardType: TextInputType.number,
                ),
                // Additional fields based on sensor category
                if (sensorData['category'] == 'HVAC' || sensorData['category'] == 'Outlets')
                  TextField(
                    controller: _additionalFieldController,
                    decoration: InputDecoration(labelText: 'Temperature (Celsius)'),
                    keyboardType: TextInputType.number,
                  ),
                if (sensorData['category'] == 'Lighting')
                  TextField(
                    controller: _additionalFieldController,
                    decoration: InputDecoration(labelText: 'Lighting Level (Lux)'),
                    keyboardType: TextInputType.number,
                  ),
                if (sensorData['category'] == 'Hot Water')
                  TextField(
                    controller: _additionalFieldController,
                    decoration: InputDecoration(labelText: 'Water Usage (Liters)'),
                    keyboardType: TextInputType.number,
                  ),
                // Button to add the new data point
                ElevatedButton(
                  onPressed: _addDataPoint,
                  child: Text('Add Data Point'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// Opens a date and time picker to set the timestamp for the data point.
  void _pickDateTime() async {
    // Implementation for picking a date and time
  }

  /// Adds a new data point to the sensor's data and updates the parent widget.
  void _addDataPoint() {
    final dataPoint = {
      'timestamp': _timestampController.text,
      'energy_usage': _energyUsageController.text,
    };

    // Add additional fields based on the sensor category
    if (sensorData['category'] == 'HVAC' || sensorData['category'] == 'Outlets') {
      dataPoint['temperature'] = _additionalFieldController.text;
    } else if (sensorData['category'] == 'Lighting') {
      dataPoint['lighting_level'] = _additionalFieldController.text;
    } else if (sensorData['category'] == 'Hot Water') {
      dataPoint['water_usage'] = _additionalFieldController.text;
    }

    setState(() {
      sensorData['data_points'].add(dataPoint); // Add the new data point
    });

    // Update the sensor data in the parent widget
    widget.onUpdate(sensorData);

    // Clear input fields after adding the data point
    _timestampController.clear();
    _energyUsageController.clear();
    _additionalFieldController.clear();
  }
}
