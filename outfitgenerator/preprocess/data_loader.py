# preprocess/data_loader.py
import json
import pandas as pd

class DataLoader:
    def __init__(self, data_path):
        self.data_path = data_path

    def load_data(self):
        # Load JSON data
        with open(self.data_path, 'r') as f:
            data = json.load(f)
        return data

    def flatten_data(self, data):
        # Flatten nested JSON into a DataFrame
        rows = []
        for outfit in data:
            for item in outfit['items']:
                row = {
                    'outfit_id': outfit['outfit_id'],
                    'item_id': item['item_id'],
                    'category': item['category'],
                    'colors': item['colors'],
                    'materials': item['materials'],
                    'pattern': item['pattern'],
                    'fit': item['fit'],
                    'item_type': item['item_id']
                }
                rows.append(row)
        df = pd.DataFrame(rows)
        return df
