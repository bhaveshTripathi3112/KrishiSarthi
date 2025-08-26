from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
from typing import Dict, Any
import uvicorn

# Load the trained model
try:
    model = joblib.load("Crop_Recommendation.joblib")
except FileNotFoundError:
    raise Exception("Model file 'Crop_Recommendation.joblib' not found. Please ensure the model is trained and saved.")

app = FastAPI(title="Crop Recommendation API", description="API for crop recommendation based on soil and climate conditions")

class CropPredictionInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class CropPredictionOutput(BaseModel):
    predicted_crop: str
    confidence: float
    input_features: Dict[str, float]

@app.get("/")
async def root():
    return {"message": "Crop Recommendation API", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": True}

@app.post("/predict", response_model=CropPredictionOutput)
async def predict_crop(input_data: CropPredictionInput):
    try:
        # Convert input to numpy array
        features = np.array([[
            input_data.N,
            input_data.P,
            input_data.K,
            input_data.temperature,
            input_data.humidity,
            input_data.ph,
            input_data.rainfall
        ]])
        
        # Make prediction
        prediction = model.predict(features)[0]
        
        # Get prediction probabilities for confidence score
        prediction_proba = model.predict_proba(features)
        confidence = float(np.max(prediction_proba))
        
        return CropPredictionOutput(
            predicted_crop=prediction,
            confidence=confidence,
            input_features={
                "N": input_data.N,
                "P": input_data.P,
                "K": input_data.K,
                "temperature": input_data.temperature,
                "humidity": input_data.humidity,
                "ph": input_data.ph,
                "rainfall": input_data.rainfall
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/predict-detailed")
async def predict_crop_detailed(input_data: CropPredictionInput):
    try:
        # Convert input to numpy array
        features = np.array([[
            input_data.N,
            input_data.P,
            input_data.K,
            input_data.temperature,
            input_data.humidity,
            input_data.ph,
            input_data.rainfall
        ]])
        
        # Make prediction
        prediction = model.predict(features)[0]
        
        # Get prediction probabilities for all classes
        prediction_proba = model.predict_proba(features)[0]
        
        # Get top 5 predictions with probabilities
        classes = model.classes_
        class_probabilities = dict(zip(classes, prediction_proba))
        top_predictions = sorted(class_probabilities.items(), key=lambda x: x[1], reverse=True)[:5]
        
        return {
            "predicted_crop": prediction,
            "confidence": float(np.max(prediction_proba)),
            "top_5_predictions": [{"crop": crop, "probability": float(prob)} for crop, prob in top_predictions],
            "all_probabilities": {crop: float(prob) for crop, prob in class_probabilities.items()},
            "input_features": {
                "N": input_data.N,
                "P": input_data.P,
                "K": input_data.K,
                "temperature": input_data.temperature,
                "humidity": input_data.humidity,
                "ph": input_data.ph,
                "rainfall": input_data.rainfall
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/model-info")
async def get_model_info():
    try:
        # Get feature names (assuming the order from training)
        feature_names = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        
        # Get unique classes if available
        classes = list(model.classes_) if hasattr(model, 'classes_') else []
        
        return {
            "model_type": "LightGBM Classifier",
            "features": feature_names,
            "n_features": len(feature_names),
            "n_classes": len(classes),
            "classes": classes
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting model info: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)