# api/app.py

from flask import Flask, request, jsonify
import pandas as pd
from preprocess.encoder import Encoder
from preprocess.scaler import Scaler
from models.kmeans_model import KMeansModel
from utils.config import ENCODERS_PATH, SCALER_PATH, MODEL_PATH
import joblib

app = Flask(__name__)

# Load the encoders, scaler, and model
encoder = Encoder()
encoder.load_encoders(ENCODERS_PATH)

scaler = Scaler()
scaler.load_scaler(SCALER_PATH)

model = KMeansModel()
model.load_model(MODEL_PATH)

# Load the processed data
df = pd.read_csv('data/processed/outfits_encoded.csv')

# Get feature columns
with open('data/processed/feature_columns.txt', 'r') as f:
    feature_columns = f.read().splitlines()

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    selected_attributes = data['selected_attributes']

    # Convert input to DataFrame
    input_df = pd.DataFrame([selected_attributes])

    # Encode input data
    columns = {
        'multi': ['colors', 'materials'],
        'single': ['pattern', 'fit', 'category', 'item_type']
    }
    input_encoded = encoder.transform(input_df, columns)
    input_encoded = input_encoded.reindex(columns=feature_columns, fill_value=0)

    # Scale input data
    input_scaled = scaler.transform(input_encoded)

    # Predict cluster
    cluster_label = model.predict(input_scaled)[0]

    # Get recommendations
    recommendations = df[df['cluster'] == cluster_label]
    recommendations_json = recommendations.to_dict(orient='records')

    return jsonify({'recommendations': recommendations_json})

if __name__ == '__main__':
    app.run(debug=True)
