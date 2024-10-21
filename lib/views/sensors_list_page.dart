import 'package:flutter/material.dart';
import 'sensor_details_page.dart';

/// A page that displays a list of all IoT sensors.
///
/// This page allows users to view the sensors and navigate to their
/// details page for further interactions such as updating or deleting
/// sensor data.
class SensorsListPage extends StatelessWidget {
  final List<Map<String, dynamic>> sensorsData; // List of sensor data
  final Function onDataChanged;  // Callback for notifying data changes

  SensorsListPage({required this.sensorsData, required this.onDataChanged});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('All IoT Sensors'), // Title of the app bar
      ),
      body: ListView.builder(
        itemCount: sensorsData.length, // Number of sensors to display
        itemBuilder: (context, index) {
          final sensor = sensorsData[index]; // Retrieve the sensor data for this index
          return ListTile(
            leading: Icon(Icons.sensors), // Icon for the sensor
            title: Text(sensor['sensor_id']), // Display the sensor ID
            subtitle: Text('Category: ${sensor['category']}'), // Display the sensor category
            trailing: Icon(Icons.arrow_forward), // Arrow icon indicating navigation
            onTap: () {
              // Navigate to the SensorDetailsPage when tapped
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => SensorDetailsPage(
                    sensorData: sensor, // Pass the selected sensor data
                    onUpdate: (updatedSensor) {
                      // Update the sensor data in the list
                      sensorsData[index] = updatedSensor; // Update the sensor in the list
                      onDataChanged();  // Call the data change callback to save the data
                    },
                    onDelete: () {
                      // Remove the sensor from the list
                      sensorsData.removeAt(index); // Remove the sensor from the list
                      onDataChanged();  // Save the updated data after deletion
                      Navigator.pop(context); // Navigate back to the previous page
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
