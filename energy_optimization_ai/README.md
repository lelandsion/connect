# AI Energy Optimization for Smart Buildings 🏢

This project leverages **AI-powered energy forecasting** to identify trends and **optimize energy usage** in commercial buildings. Using **historical energy data**, we trained a **LSTM-based deep learning model** to predict future consumption and simulate potential **energy savings strategies**.

## 📌 Key Features
- **Time Series Forecasting**: Predicts **hourly energy usage** for **HVAC, lighting, and miscellaneous loads**.
- **Data-Driven Insights**: Identifies peak energy usage patterns and correlations with temperature and occupancy.
- **Energy Optimization Simulation**: Models the impact of **reducing peak loads by 10%** to demonstrate **potential savings**.
- **Multi-Output LSTM Model**: Uses deep learning to forecast energy consumption based on **past usage patterns**.

## 📊 Dataset
The dataset includes:
- **Energy consumption data**: HVAC, lighting, plug loads.
- **Temperature & sensor readings**: Interior and exterior temperatures.
- **Fan speed & water heating data**: HVAC system operation insights.

> **Data link:** Google Drive folder: https://drive.google.com/drive/folders/1VM2BEzEf6DWlQJjtFA5V4z5oq1DteCGd?usp=share_link.

## 🤖  Model Training & Prediction
1. **Data Preprocessing**: Normalize and structure time-series data.
2. **Train an LSTM Model**: Use a **TPU-optimized** sequential model with **past 8-hour data** to predict the next hour.
3. **Evaluate & Visualize Predictions**: Compare **actual vs. predicted** energy usage across different systems.
4. **Energy Optimization Simulation**: Model **a 10% reduction in peak usage** to estimate potential savings.

## 📈 Results
- **Highly accurate predictions** with **low Mean Absolute Error (MAE)**.
- **Peak demand hours** identified, supporting **targeted energy-saving strategies**.
- **Optimized energy use simulation** demonstrated **significant reduction in HVAC loads**.

## 📦 Project Structure
```
💚 ai-energy-optimization
│── 💛 notebooks/  # Jupyter notebooks for training & analysis
│── 💛 models/  # Saved AI models for inference
│── 💛 data/  # Placeholder for dataset access via `gdown`
│── README.md  # This file
│── requirements.txt  # Dependencies for running the project
```

## 🛠️ Setup & Run

### Google Colab links:
**[Introduction Notebook](https://colab.research.google.com/drive/1UOwEtu5qBP4ysiTNCZUyzbm4W454bgLq?usp=sharing)** 👈 
   Overview of the project, objectives, and initial exploration.

**[Data Preprocessing Notebook](https://colab.research.google.com/drive/1knCKYpCKZKSI864ljbQ_t4d4rXMT1v8C?usp=sharing )** 👈 
   Data cleaning, normalization, and preparation for AI models.

**[Energy Forecasting Notebook](https://colab.research.google.com/drive/1E3Ek7pXRXCntxrZbkR8WfJjZgbaw-Ex8?usp=sharing)** 👈
   Predicts hourly energy consumption for HVAC, lighting, and MELS.

**[Temperature Forecasting Notebook](https://colab.research.google.com/drive/1n_cT2Yfv6YOwmGyTxpEHzyUEhPx-Ajv7?usp=sharing)** 👈 
   Predicts hourly temperature for different building zones.

**[Anomaly Detection Notebook](https://colab.research.google.com/drive/15TKIbA3ZRT6YmPZ4T-SQ6ajvWgVHtEvt?usp=sharing)** 👈 
   Identifies energy spikes and anomalies for optimization insights.


1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ai-energy-optimization.git
   cd ai-energy-optimization
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Jupyter notebook**:
    - Open `notebooks/energy_forecasting.ipynb` in **Google Colab** or Jupyter.

4. **Download the dataset**:
   The dataset is stored in **Google Drive** and can be downloaded using:
   ```python
   import gdown
   gdown.download_folder("https://drive.google.com/drive/folders/YOUR_FOLDER_ID", output="./data", quiet=False)
   ```

## 📈 Visualizations
### 🔵 AI Forecasting vs. Actual Energy Usage
> **Comparing AI predictions with real-world energy consumption**
<img src="https://raw.githubusercontent.com/lelandsion/connect/main/energy_optimization_ai/visualizations/Screenshot 2025-02-04 at 12.59.23 AM.png" alt="HVAC Forecast" width="9000" />
Comparing AI predictions with real-world energy consumption
This visualization compares actual energy usage against AI-predicted usage for HVAC, lighting, and MELS systems, demonstrating the model’s forecasting accuracy over time.

### 🔴 Energy Savings Simulation
> **Estimated savings by reducing peak energy demand**
<img src="https://raw.githubusercontent.com/lelandsion/connect/main/energy_optimization_ai/visualizations/Screenshot 2025-02-04 at 1.00.10 AM.png" alt="Energy Savings" width="1200" />
Estimated savings by reducing peak energy demand
This graph models the effect of reducing peak energy demand by 10%. The “Before Optimization” line represents the original energy usage, while the “After Optimization” line demonstrates the potential for energy savings.


visualizations/Screenshot 2025-02-04 at 1.00.10 AM.png
## 📌 Actionable Insights
➜ **Target HVAC adjustments during peak hours** to reduce demand.  
 **Potential Savings**: Optimizing HVAC use can **cut energy costs by up to 15%**, leading to **$50,000–$500,000 in annual savings per building** depending on size.

➜ **Use AI to recommend energy-efficient schedules** based on historical data.  
 **Impact**: Adaptive scheduling can lead to a **5–10% decrease in overall energy consumption**, reducing **GHG emissions by thousands of metric tons** annually across a city-wide rollout.

➜ **Optimize energy loads dynamically** using real-time IoT data.  
 **Smart integration with IoT sensors** can enable **automated demand response**, reducing **grid strain** and lowering **peak energy costs** for businesses.

➜ **Simulate financial cost savings** from reducing peak energy use.  
 **Monetary Impact**: A **10% reduction in peak demand** across **10,000 buildings** could result in **$50M+ in collective energy savings per year**.

➜ **Prevent energy waste with anomaly detection** to catch inefficient systems.  
 **Real-World Benefit**: Detecting and fixing **faulty HVAC systems** early can **save up to 30% in wasted energy costs**, preventing unnecessary expenses and emissions.

## 📱 Future Improvements
- **Integrate real-time IoT sensor data** for dynamic forecasting.
- **Develop an AI-powered energy optimization API**.
- **Expand simulation to include financial cost savings**.

## 🏛️ License
This project is open-source under the **MIT License**.

## ✉️ Contact
For questions or collaboration:

📧 [lelandsion@gmail.com](lelandsion@gmail.com).  
📧 [ckwestendorf@gmail.com](ckwestendorf@gmail.com)


🔗 [LinkedIn Leland](https://linkedin.com/in/lelandsion)
🔗 [LinkedIn Cole](https://linkedin.com/in/https://www.linkedin.com/in/cole-westendorf-b773ba2a8/)


