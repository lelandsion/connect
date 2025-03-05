// Represents energy data recorded at a specific time.
// This class stores information about the current and optimized energy usage.
class EnergyData {
    constructor(time, currentUsage, optimizedUsage) {
        this.time = time; // Date object representing when the data was recorded
        this.currentUsage = currentUsage; // Current energy usage (e.g., watts)
        this.optimizedUsage = optimizedUsage; // Optimized energy usage in the same unit
    }

    // Converts JSON data to an EnergyData instance.
    static fromJson(json) {
        return new EnergyData(
            new Date(json.time), // Parse the time from the JSON string
            json.currentUsage,   // Current energy usage from the JSON
            json.optimizedUsage  // Optimized energy usage from the JSON
        );
    }
}

// Represents a building node containing energy data.
// This class includes the node's name and a list of recorded energy data.
class BuildingNode {
    constructor(nodeName, data) {
        this.nodeName = nodeName; // The name of the building node (e.g., HVAC, Lighting)
        this.data = data;         // Array of EnergyData instances
    }

    // Parses JSON data for a building node and its associated energy data.
    static fromJson(json) {
        const dataList = json.data.map(e => EnergyData.fromJson(e)); // Map each energy entry to an EnergyData instance
        return new BuildingNode(
            json.nodeName, // Node name from JSON
            dataList       // List of energy data
        );
    }
}

// Sample JSON input for testing and demonstration purposes.
const jsonInput = `
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
`;

// Parses the sample JSON data into an array of BuildingNode instances.
function parseJsonData() {
    const jsonData = JSON.parse(jsonInput); // Decode the JSON input
    return jsonData.map(node => BuildingNode.fromJson(node)); // Map each JSON node to a BuildingNode instance
}

// Finds high traffic times based on the current usage of the building node.
// Returns an array of time strings (in ISO 8601 format) where the current usage exceeds a specified threshold.
function findHighTrafficTimes(node) {
    const highTrafficTimes = []; // List to store times of high usage

    node.data.forEach(data => {
        if (data.currentUsage > 200) { // Arbitrary threshold for high usage
            highTrafficTimes.push(data.time.toISOString()); // Add the time in ISO 8601 format
        }
    });

    return highTrafficTimes; // Return the list of high traffic times
}
