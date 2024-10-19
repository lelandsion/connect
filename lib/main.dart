import 'package:flutter/material.dart';
import 'package:get_storage/get_storage.dart';  // Import GetStorage
import 'dashboard_page.dart';
import 'dart:convert';

void main() async {
  await GetStorage.init();  // Initialize GetStorage
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final box = GetStorage();  // Create a GetStorage instance
  List<Map<String, dynamic>> sensorsData = [];

  @override
  void initState() {
    super.initState();
    _loadSensorsData();
  }

  void _loadSensorsData() {
    String? data = box.read('sensorsData');  // Read data from GetStorage
    if (data != null) {
      setState(() {
        sensorsData = List<Map<String, dynamic>>.from(jsonDecode(data));
      });
    }
  }

  void _saveSensorsData() {
    box.write('sensorsData', jsonEncode(sensorsData));  // Save data to GetStorage
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Energy Management',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: DashboardPage(
        sensorsData: sensorsData,
        onDataChanged: () {
          _saveSensorsData();  // Save data whenever changes are made
        },
      ),
    );
  }
}
