# main.py

from preprocess.data_loader import DataLoader
from preprocess.encoder import Encoder
from preprocess.scaler import Scaler
from models.kmeans_model import KMeansModel
from utils.logger import get_logger
from utils.config import (DATA_PATH, PROCESSED_DATA_PATH, ENCODERS_PATH,
                          SCALER_PATH, MODEL_PATH)

import pandas as pd

logger = get_logger(__name__)

def main():
    logger.info("Starting data loading...")
    data_loader = DataLoader(DATA_PATH)
    data = data_loader.load_data()
    df = data_loader.flatten_data(data)

    logger.info("Starting data encoding...")
    encoder = Encoder()
    columns = {
        'multi': ['colors', 'materials'],
        'single': ['pattern', 'fit', 'category', 'item_type']
    }
    df_encoded = encoder.fit_transform(df, columns)
    encoder.save_encoders(ENCODERS_PATH)

    # Save feature columns for future use
    feature_columns = df_encoded.columns.difference(['outfit_id', 'item_id'])
    with open('data/processed/feature_columns.txt', 'w') as f:
        for col in feature_columns:
            f.write(f"{col}\n")

    logger.info("Starting data scaling...")
    scaler = Scaler()
    X = df_encoded[feature_columns]
    X_scaled = scaler.fit_transform(X)
    scaler.save_scaler(SCALER_PATH)

    logger.info("Starting model training...")
    model = KMeansModel(n_clusters=3)
    model.train(X_scaled)
    model.save_model(MODEL_PATH)

    # Add cluster labels to DataFrame
    df_encoded['cluster'] = model.predict(X_scaled)
    df_encoded.to_csv('data/processed/outfits_encoded.csv', index=False)

    logger.info("Model training complete.")

if __name__ == "__main__":
    main()
