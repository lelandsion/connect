import 'package:flutter/material.dart';

class SensorDetailsPage extends StatefulWidget {
  final Map<String, dynamic> sensorData;
  final Function(Map<String, dynamic>) onUpdate;
  final Function onDelete;

  SensorDetailsPage({
    required this.sensorData,
    required this.onUpdate,
    required this.onDelete,
  });

  @override
  _SensorDetailsPageState createState() => _SensorDetailsPageState();
}

class _SensorDetailsPageState extends State<SensorDetailsPage> {
  late Map<String, dynamic> sensorData;
  final TextEditingController _energyUsageController = TextEditingController();
  final TextEditingController _additionalFieldController = TextEditingController();
  final TextEditingController _timestampController = TextEditingController();

  @override
  void initState() {
    super.initState();
    sensorData = widget.sensorData;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Sensor Details: ${sensorData['sensor_id']}'),
        actions: [
          IconButton(
            icon: Icon(Icons.delete),
            onPressed: () {
              widget.onDelete();
              Navigator.pop(context);
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Display sensor data points
          Expanded(
            child: ListView.builder(
              itemCount: sensorData['data_points'].length,
              itemBuilder: (context, index) {
                final dataPoint = sensorData['data_points'][index];
                return ListTile(
                  title: Text('Timestamp: ${dataPoint['timestamp']}'),
                  subtitle: Text('Energy Usage: ${dataPoint['energy_usage']} kWh'),
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
                TextField(
                  controller: _timestampController,
                  decoration: InputDecoration(labelText: 'Timestamp (Unix Epoch)'),
                  keyboardType: TextInputType.number,
                  onTap: _pickDateTime,
                ),
                TextField(
                  controller: _energyUsageController,
                  decoration: InputDecoration(labelText: 'Energy Usage (kWh)'),
                  keyboardType: TextInputType.number,
                ),
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

  void _pickDateTime() async {
    // Same as before
  }

  void _addDataPoint() {
    final dataPoint = {
      'timestamp': _timestampController.text,
      'energy_usage': _energyUsageController.text,
    };

    if (sensorData['category'] == 'HVAC' || sensorData['category'] == 'Outlets') {
      dataPoint['temperature'] = _additionalFieldController.text;
    } else if (sensorData['category'] == 'Lighting') {
      dataPoint['lighting_level'] = _additionalFieldController.text;
    } else if (sensorData['category'] == 'Hot Water') {
      dataPoint['water_usage'] = _additionalFieldController.text;
    }

    setState(() {
      sensorData['data_points'].add(dataPoint);
    });

    // Update the sensor data in parent
    widget.onUpdate(sensorData);

    // Clear input fields
    _timestampController.clear();
    _energyUsageController.clear();
    _additionalFieldController.clear();
  }
}
