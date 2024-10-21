import 'dart:convert';
import 'package:flutter/material.dart';

/// Represents energy data recorded at a specific time.
///
/// This class stores information about the current and optimized energy usage.
class EnergyData {
  final DateTime time; // The time the data was recorded
  final int currentUsage; // Current energy usage in some unit (e.g., watts)
  final int optimizedUsage; // Optimized energy usage in the same unit

  EnergyData(this.time, this.currentUsage, this.optimizedUsage);

  /// Converts JSON data to an EnergyData instance.
  factory EnergyData.fromJson(Map<String, dynamic> json) {
    return EnergyData(
      DateTime.parse(json['time']), // Parse the time from the JSON
      json['currentUsage'], // Current energy usage from the JSON
      json['optimizedUsage'], // Optimized energy usage from the JSON
    );
  }
}

/// Represents a building node containing energy data.
///
/// This class includes the node's name and a list of recorded energy data.
class BuildingNode {
  final String nodeName; // The name of the building node (e.g., HVAC, Lighting)
  final List<EnergyData> data; // List of energy data associated with the node

  BuildingNode({required this.nodeName, required this.data});

  /// Parses JSON data for a building node and its associated energy data.
  factory BuildingNode.fromJson(Map<String, dynamic> json) {
    var energyList = json['data'] as List; // Get the energy data list from JSON
    List<EnergyData> dataList =
    energyList.map((e) => EnergyData.fromJson(e)).toList(); // Map JSON to EnergyData instances

    return BuildingNode(
      nodeName: json['nodeName'], // Node name from JSON
      data: dataList, // List of energy data
    );
  }
}

// Sample JSON input for testing and demonstration purposes.
String jsonInput = '''
[
  {
    "nodeName": "HVAC",
    "data": [
      {"time": "2023-09-01T09:00:00", "currentUsage": 200, "optimizedUsage": 160},
      {"time": "2023-09-01T10:00:00", "currentUsage": 220, "optimizedUsage": 170}
    ]
  },
  {
    "nodeName": "Lighting",
    "data": [
      {"time": "2023-09-01T09:00:00", "currentUsage": 100, "optimizedUsage": 80},
      {"time": "2023-09-01T10:00:00", "currentUsage": 120, "optimizedUsage": 90}
    ]
  }
]
''';

// Parses the sample JSON data into a list of BuildingNode instances.
List<BuildingNode> parseJsonData() {
  final jsonData = json.decode(jsonInput) as List; // Decode the JSON input
  return jsonData.map((node) => BuildingNode.fromJson(node)).toList(); // Map each JSON node to BuildingNode
}

/// Finds high traffic times based on the current usage of the building node.
///
/// Returns a list of time strings where the current usage exceeds a specified threshold.
List<String> findHighTrafficTimes(BuildingNode node) {
  List<String> highTrafficTimes = []; // List to store times of high usage

  for (var data in node.data) {
    if (data.currentUsage > 200) { // Arbitrary threshold for high usage
      highTrafficTimes.add(data.time.toIso8601String()); // Add the time in ISO 8601 format
    }
  }

  return highTrafficTimes; // Return the list of high traffic times
}
