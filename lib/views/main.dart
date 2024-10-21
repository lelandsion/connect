import 'package:flutter/material.dart';
import 'package:get_storage/get_storage.dart';  // Import GetStorage for persistent storage
import 'dashboard_page.dart';
import 'dart:convert'; // Import for JSON encoding and decoding

/// The entry point of the Energy Management application.
void main() async {
  await GetStorage.init();  // Initialize GetStorage for data persistence
  runApp(MyApp()); // Run the main app widget
}

/// The main application widget that manages the overall state.
class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final box = GetStorage();  // Create an instance of GetStorage for data storage
  List<Map<String, dynamic>> sensorsData = []; // List to store sensor data

  @override
  void initState() {
    super.initState();
    _loadSensorsData(); // Load the sensors data from storage when the app initializes
  }

  /// Loads the sensors data from persistent storage.
  void _loadSensorsData() {
    String? data = box.read('sensorsData');  // Read the data from GetStorage
    if (data != null) {
      setState(() {
        // Decode the JSON data and convert it to a list of maps
        sensorsData = List<Map<String, dynamic>>.from(jsonDecode(data));
      });
    }
  }

  /// Saves the current sensors data to persistent storage.
  void _saveSensorsData() {
    // Encode the sensors data to JSON and write it to GetStorage
    box.write('sensorsData', jsonEncode(sensorsData));
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Energy Management', // Title of the app
      theme: ThemeData(
        primarySwatch: Colors.blue, // Set the primary theme color
      ),
      home: DashboardPage(
        sensorsData: sensorsData, // Pass the sensors data to the DashboardPage
        onDataChanged: () {
          _saveSensorsData(); // Save data whenever changes are made in the dashboard
        },
      ),
    );
  }
}
