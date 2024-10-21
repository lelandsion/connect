import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:intl/intl.dart';
import 'trends_page.dart'; // Import for the TrendsPage

/// A page for adding IoT sensor modules to the system.
class AddSensorPage extends StatefulWidget {
  @override
  _AddSensorPageState createState() => _AddSensorPageState();
}

class _AddSensorPageState extends State<AddSensorPage> {
  String _sensorType = 'HVAC'; // Default sensor type
  final TextEditingController _sensorIdController = TextEditingController();
  final TextEditingController _timestampController = TextEditingController();
  final TextEditingController _energyUsageController = TextEditingController();
  final TextEditingController _additionalFieldController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Add IoT Sensor Module'),
        actions: [
          // Button to navigate back to the Dashboard Page
          IconButton(
            icon: Icon(Icons.dashboard),
            onPressed: () {
              Navigator.pop(context); // Go back to DashboardPage
            },
          ),
          // Button to navigate to the Trends Page
          IconButton(
            icon: Icon(Icons.show_chart),
            onPressed: () {
              // Navigate to TrendsPage without data for now
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => TrendsPage(sensorsData: []),
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              // Dropdown for selecting sensor type
              DropdownButton<String>(
                value: _sensorType,
                onChanged: (String? newValue) {
                  setState(() {
                    _sensorType = newValue!;
                    _clearFields(); // Clear fields when sensor type changes
                  });
                },
                items: <String>[
                  'HVAC',
                  'Lighting',
                  'Outlets',
                  'Doors',
                  'Hot Water',
                  'Laundry'
                ].map<DropdownMenuItem<String>>((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value),
                  );
                }).toList(),
              ),
              // Build text fields for sensor input
              _buildPromptFields(),
              SizedBox(height: 16),
              // Button to add the sensor
              ElevatedButton(
                onPressed: _addSensor,
                child: Text('Add Sensor'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Builds input fields for sensor data entry based on the selected sensor type.
  Widget _buildPromptFields() {
    return Column(
      children: [
        // Input field for Sensor ID
        TextField(
          controller: _sensorIdController,
          decoration: InputDecoration(labelText: 'Sensor ID'),
        ),
        // Input field for Timestamp
        TextField(
          controller: _timestampController,
          decoration: InputDecoration(labelText: 'Timestamp (Unix Epoch)'),
          keyboardType: TextInputType.number,
          onTap: _pickDateTime, // Opens date/time picker
        ),
        // Input field for Energy Usage
        TextField(
          controller: _energyUsageController,
          decoration: InputDecoration(labelText: 'Energy Usage (kWh)'),
          keyboardType: TextInputType.number,
        ),
        // Additional field based on the sensor type
        if (_sensorType == 'HVAC' || _sensorType == 'Outlets')
          TextField(
            controller: _additionalFieldController,
            decoration: InputDecoration(labelText: 'Temperature (Celsius)'),
            keyboardType: TextInputType.number,
          ),
        if (_sensorType == 'Lighting')
          TextField(
            controller: _additionalFieldController,
            decoration: InputDecoration(labelText: 'Lighting Level (Lux)'),
            keyboardType: TextInputType.number,
          ),
        if (_sensorType == 'Hot Water')
          TextField(
            controller: _additionalFieldController,
            decoration: InputDecoration(labelText: 'Water Usage (Liters)'),
            keyboardType: TextInputType.number,
          ),
      ],
    );
  }

  /// Opens a date and time picker to select the timestamp for the sensor.
  void _pickDateTime() async {
    DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
    );

    if (picked != null) {
      final time = await showTimePicker(
        context: context,
        initialTime: TimeOfDay.now(),
      );

      if (time != null) {
        DateTime fullDateTime = DateTime(
            picked.year, picked.month, picked.day, time.hour, time.minute);
        int unixTimestamp = fullDateTime.millisecondsSinceEpoch ~/ 1000;
        setState(() {
          _timestampController.text = unixTimestamp.toString(); // Set the Unix timestamp
        });
      }
    }
  }

  /// Collects the sensor data entered by the user and returns it to the previous page.
  void _addSensor() {
    final sensorData = {
      'sensor_id': _sensorIdController.text,
      'timestamp': _timestampController.text,
      'energy_usage': _energyUsageController.text,
      'category': _sensorType,
      'data_points': [], // Initialize with an empty list
    };

    // Create the first data point
    final dataPoint = {
      'timestamp': _timestampController.text,
      'energy_usage': _energyUsageController.text,
    };

    // Add additional fields based on the selected sensor type
    if (_sensorType == 'HVAC' || _sensorType == 'Outlets') {
      dataPoint['temperature'] = _additionalFieldController.text;
    } else if (_sensorType == 'Lighting') {
      dataPoint['lighting_level'] = _additionalFieldController.text;
    } else if (_sensorType == 'Hot Water') {
      dataPoint['water_usage'] = _additionalFieldController.text;
    }

    // Ensure 'data_points' is initialized if it's null
    sensorData['data_points'] = sensorData['data_points'] ?? [];
    (sensorData['data_points'] as List<dynamic>).add(dataPoint);

    // Return the new sensor data to the previous page
    Navigator.pop(context, sensorData);
  }

  /// Clears the input fields for new sensor entry.
  void _clearFields() {
    _sensorIdController.clear();
    _timestampController.clear();
    _energyUsageController.clear();
    _additionalFieldController.clear();
  }
}
