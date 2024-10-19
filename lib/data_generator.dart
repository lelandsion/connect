import 'dart:convert';
import 'package:flutter/material.dart';

class EnergyData {
  final DateTime time;
  final int currentUsage;
  final int optimizedUsage;

  EnergyData(this.time, this.currentUsage, this.optimizedUsage);

  // Convert JSON to EnergyData
  factory EnergyData.fromJson(Map<String, dynamic> json) {
    return EnergyData(
      DateTime.parse(json['time']),
      json['currentUsage'],
      json['optimizedUsage'],
    );
  }
}

class BuildingNode {
  final String nodeName;
  final List<EnergyData> data;

  BuildingNode({required this.nodeName, required this.data});

  // Parse the JSON for each node and its energy data
  factory BuildingNode.fromJson(Map<String, dynamic> json) {
    var energyList = json['data'] as List;
    List<EnergyData> dataList =
    energyList.map((e) => EnergyData.fromJson(e)).toList();

    return BuildingNode(
      nodeName: json['nodeName'],
      data: dataList,
    );
  }
}

// Sample JSON input
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

// Parse JSON data
List<BuildingNode> parseJsonData() {
  final jsonData = json.decode(jsonInput) as List;
  return jsonData.map((node) => BuildingNode.fromJson(node)).toList();
}

List<String> findHighTrafficTimes(BuildingNode node) {
  List<String> highTrafficTimes = [];

  for (var data in node.data) {
    if (data.currentUsage > 200) { // Arbitrary threshold for high usage
      highTrafficTimes.add(data.time.toIso8601String());
    }
  }

  return highTrafficTimes;
}
