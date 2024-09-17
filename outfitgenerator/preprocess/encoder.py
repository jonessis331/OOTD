# preprocess/encoder.py

from sklearn.preprocessing import MultiLabelBinarizer
import pandas as pd

class Encoder:
    def __init__(self):
        self.encoders = {}

    def fit_transform(self, df, columns):
        # Encode multi-valued attributes
        for col in columns['multi']:
            mlb = MultiLabelBinarizer()
            transformed = mlb.fit_transform(df[col])
            encoded_df = pd.DataFrame(transformed, columns=[f"{col}_{cls}" for cls in mlb.classes_])
            df = pd.concat([df, encoded_df], axis=1)
            self.encoders[col] = mlb
            df.drop(col, axis=1, inplace=True)
        
        # Encode single-valued attributes
        for col in columns['single']:
            dummies = pd.get_dummies(df[col], prefix=col)
            df = pd.concat([df, dummies], axis=1)
            df.drop(col, axis=1, inplace=True)
        
        return df

    def transform(self, df, columns):
        # Apply the same encoding to new data
        for col in columns['multi']:
            mlb = self.encoders.get(col)
            transformed = mlb.transform(df[col])
            encoded_df = pd.DataFrame(transformed, columns=[f"{col}_{cls}" for cls in mlb.classes_])
            df = pd.concat([df, encoded_df], axis=1)
            df.drop(col, axis=1, inplace=True)
        
        for col in columns['single']:
            dummies = pd.get_dummies(df[col], prefix=col)
            df = pd.concat([df, dummies], axis=1)
            df.drop(col, axis=1, inplace=True)
        
        return df

    def save_encoders(self, path):
        import joblib
        joblib.dump(self.encoders, path)

    def load_encoders(self, path):
        import joblib
        self.encoders = joblib.load(path)
