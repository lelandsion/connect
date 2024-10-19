import 'package:flutter/material.dart';
import 'sensor_details_page.dart';

class SensorsListPage extends StatelessWidget {
  final List<Map<String, dynamic>> sensorsData;
  final Function onDataChanged;  // Add a callback for data changes

  SensorsListPage({required this.sensorsData, required this.onDataChanged});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('All IoT Sensors'),
      ),
      body: ListView.builder(
        itemCount: sensorsData.length,
        itemBuilder: (context, index) {
          final sensor = sensorsData[index];
          return ListTile(
            leading: Icon(Icons.sensors),
            title: Text(sensor['sensor_id']),
            subtitle: Text('Category: ${sensor['category']}'),
            trailing: Icon(Icons.arrow_forward),
            onTap: () {
              // Navigate to sensor details page
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => SensorDetailsPage(
                    sensorData: sensor,
                    onUpdate: (updatedSensor) {
                      // Update sensor data in the list
                      sensorsData[index] = updatedSensor;
                      onDataChanged();  // Call the data change callback to save the data
                    },
                    onDelete: () {
                      // Remove sensor from the list
                      sensorsData.removeAt(index);
                      onDataChanged();  // Save the updated data after deletion
                      Navigator.pop(context);
                    },
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
