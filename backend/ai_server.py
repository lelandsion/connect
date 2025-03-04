from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model

app = Flask(__name__)

# Load the trained AI model
model = load_model("../energy_optimization_ai/saved_models/hourly_energy_prediction-2.keras")  # Make sure the file exists

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get input data from Node.js API
        data = request.get_json()
        input_features = np.array(data["features"])

        # Make AI prediction
        prediction = model.predict(input_features)

        # Return the prediction as JSON
        return jsonify({"prediction": prediction.tolist()})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5005)  # Run Flask on port 5005