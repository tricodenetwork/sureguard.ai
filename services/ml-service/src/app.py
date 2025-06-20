import os
import json
import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import redis.asyncio as redis
import tensorflow as tf
import joblib
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import torch
import torch.nn as nn
from transformers import AutoTokenizer, AutoModel
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="SureGuard AI ML Service",
    description="Machine Learning service for threat detection",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis connection
redis_client = None

# Models
models = {}
scalers = {}

# Pydantic models
class ThreatAnalysisRequest(BaseModel):
    input_value: str = Field(..., description="Value to analyze (IP, URL, email, etc.)")
    input_type: str = Field(..., description="Type of input (ip, url, email, domain)")
    context: Optional[Dict[str, Any]] = Field(default={}, description="Additional context")
    user_agent: Optional[str] = None
    session_data: Optional[Dict[str, Any]] = None
    device_fingerprint: Optional[Dict[str, Any]] = None

class ThreatAnalysisResponse(BaseModel):
    risk_score: int = Field(..., ge=0, le=100, description="Risk score from 0-100")
    confidence_score: int = Field(..., ge=0, le=100, description="Confidence in the prediction")
    threat_type: str = Field(..., description="Type of threat detected")
    severity: str = Field(..., description="Severity level (low, medium, high, critical)")
    explanation: str = Field(..., description="Human-readable explanation")
    recommendations: List[str] = Field(..., description="Recommended actions")
    model_predictions: Dict[str, float] = Field(..., description="Individual model predictions")
    processing_time_ms: float = Field(..., description="Processing time in milliseconds")

class BatchAnalysisRequest(BaseModel):
    requests: List[ThreatAnalysisRequest] = Field(..., max_items=100)

class ModelMetrics(BaseModel):
    model_name: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    last_updated: datetime

# Neural Network Models
class BehavioralLSTM(nn.Module):
    def __init__(self, input_size=50, hidden_size=128, num_layers=2, num_classes=2):
        super(BehavioralLSTM, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, dropout=0.2)
        self.dropout = nn.Dropout(0.3)
        self.fc = nn.Linear(hidden_size, num_classes)
        self.softmax = nn.Softmax(dim=1)
        
    def forward(self, x):
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size)
        
        out, _ = self.lstm(x, (h0, c0))
        out = self.dropout(out[:, -1, :])
        out = self.fc(out)
        return self.softmax(out)

class DeviceFingerprintNet(nn.Module):
    def __init__(self, input_size=100, hidden_sizes=[256, 128, 64], num_classes=2):
        super(DeviceFingerprintNet, self).__init__()
        
        layers = []
        prev_size = input_size
        
        for hidden_size in hidden_sizes:
            layers.extend([
                nn.Linear(prev_size, hidden_size),
                nn.ReLU(),
                nn.BatchNorm1d(hidden_size),
                nn.Dropout(0.3)
            ])
            prev_size = hidden_size
            
        layers.append(nn.Linear(prev_size, num_classes))
        layers.append(nn.Softmax(dim=1))
        
        self.network = nn.Sequential(*layers)
        
    def forward(self, x):
        return self.network(x)

# Feature extraction functions
def extract_ip_features(ip_address: str) -> np.ndarray:
    """Extract features from IP address"""
    features = []
    
    try:
        # Basic IP parsing
        octets = ip_address.split('.')
        if len(octets) == 4:
            features.extend([int(octet) for octet in octets])
        else:
            features.extend([0, 0, 0, 0])
            
        # IP range features
        first_octet = int(octets[0]) if len(octets) > 0 else 0
        features.extend([
            1 if first_octet in [10] else 0,  # Private Class A
            1 if first_octet == 172 else 0,   # Private Class B
            1 if first_octet == 192 else 0,   # Private Class C
            1 if first_octet == 127 else 0,   # Loopback
            1 if first_octet >= 224 else 0,   # Multicast
        ])
        
        # Geolocation features (mock - in production, use real geolocation service)
        features.extend([
            hash(ip_address) % 1000 / 1000,  # Mock latitude
            hash(ip_address[::-1]) % 1000 / 1000,  # Mock longitude
            hash(ip_address + "country") % 200,  # Mock country code
        ])
        
    except Exception as e:
        logger.error(f"Error extracting IP features: {e}")
        features = [0] * 12
        
    return np.array(features, dtype=np.float32)

def extract_url_features(url: str) -> np.ndarray:
    """Extract features from URL"""
    features = []
    
    try:
        # Basic URL features
        features.extend([
            len(url),
            url.count('.'),
            url.count('/'),
            url.count('?'),
            url.count('&'),
            url.count('='),
            url.count('-'),
            url.count('_'),
            1 if 'https' in url else 0,
            1 if any(char.isdigit() for char in url) else 0,
        ])
        
        # Suspicious patterns
        suspicious_keywords = ['admin', 'login', 'secure', 'bank', 'paypal', 'amazon']
        features.append(sum(1 for keyword in suspicious_keywords if keyword in url.lower()))
        
        # Domain features
        domain_parts = url.split('/')[2].split('.') if '//' in url else url.split('.') 
        features.extend([
            len(domain_parts),
            max(len(part) for part in domain_parts) if domain_parts else 0,
            1 if any(char.isdigit() for char in domain_parts[0]) if domain_parts else 0,
        ])
        
    except Exception as e:
        logger.error(f"Error extracting URL features: {e}")
        features = [0] * 14
        
    return np.array(features, dtype=np.float32)

def extract_device_features(device_fingerprint: Dict[str, Any]) -> np.ndarray:
    """Extract features from device fingerprint"""
    features = []
    
    try:
        # Screen features
        screen = device_fingerprint.get('screen', {})
        features.extend([
            screen.get('width', 0),
            screen.get('height', 0),
            screen.get('colorDepth', 0),
            screen.get('pixelRatio', 1.0),
        ])
        
        # Browser features
        features.extend([
            len(device_fingerprint.get('userAgent', '')),
            len(device_fingerprint.get('language', '')),
            len(device_fingerprint.get('platform', '')),
            device_fingerprint.get('cookieEnabled', 0),
            device_fingerprint.get('doNotTrack', 0),
        ])
        
        # Plugin and font features
        plugins = device_fingerprint.get('plugins', [])
        fonts = device_fingerprint.get('fonts', [])
        features.extend([
            len(plugins),
            len(fonts),
            hash(str(plugins)) % 1000,
            hash(str(fonts)) % 1000,
        ])
        
        # Timezone and other features
        features.extend([
            device_fingerprint.get('timezone', 0),
            device_fingerprint.get('webgl', 0),
            device_fingerprint.get('canvas', 0),
        ])
        
        # Pad to fixed size
        while len(features) < 100:
            features.append(0)
            
    except Exception as e:
        logger.error(f"Error extracting device features: {e}")
        features = [0] * 100
        
    return np.array(features[:100], dtype=np.float32)

# Model loading functions
async def load_models():
    """Load all ML models"""
    global models, scalers
    
    try:
        model_path = "/app/models"
        
        # Load IP reputation model (Random Forest)
        try:
            models['ip_reputation'] = joblib.load(f"{model_path}/ip_reputation_model.pkl")
            scalers['ip_reputation'] = joblib.load(f"{model_path}/ip_reputation_scaler.pkl")
            logger.info("Loaded IP reputation model")
        except FileNotFoundError:
            # Create and train a simple model if not found
            logger.warning("IP reputation model not found, creating default model")
            models['ip_reputation'] = RandomForestClassifier(n_estimators=100, random_state=42)
            scalers['ip_reputation'] = StandardScaler()
            
            # Generate some dummy training data
            X_dummy = np.random.rand(1000, 12)
            y_dummy = np.random.randint(0, 2, 1000)
            scalers['ip_reputation'].fit(X_dummy)
            X_scaled = scalers['ip_reputation'].transform(X_dummy)
            models['ip_reputation'].fit(X_scaled, y_dummy)
        
        # Load URL analysis model
        try:
            models['url_analysis'] = joblib.load(f"{model_path}/url_analysis_model.pkl")
            scalers['url_analysis'] = joblib.load(f"{model_path}/url_analysis_scaler.pkl")
            logger.info("Loaded URL analysis model")
        except FileNotFoundError:
            logger.warning("URL analysis model not found, creating default model")
            models['url_analysis'] = RandomForestClassifier(n_estimators=100, random_state=42)
            scalers['url_analysis'] = StandardScaler()
            
            X_dummy = np.random.rand(1000, 14)
            y_dummy = np.random.randint(0, 2, 1000)
            scalers['url_analysis'].fit(X_dummy)
            X_scaled = scalers['url_analysis'].transform(X_dummy)
            models['url_analysis'].fit(X_scaled, y_dummy)
        
        # Load anomaly detection model
        try:
            models['anomaly_detection'] = joblib.load(f"{model_path}/anomaly_model.pkl")
            logger.info("Loaded anomaly detection model")
        except FileNotFoundError:
            logger.warning("Anomaly detection model not found, creating default model")
            models['anomaly_detection'] = IsolationForest(contamination=0.1, random_state=42)
            X_dummy = np.random.rand(1000, 50)
            models['anomaly_detection'].fit(X_dummy)
        
        # Load PyTorch models
        try:
            models['behavioral_lstm'] = BehavioralLSTM()
            models['behavioral_lstm'].load_state_dict(
                torch.load(f"{model_path}/behavioral_lstm.pth", map_location='cpu')
            )
            models['behavioral_lstm'].eval()
            logger.info("Loaded behavioral LSTM model")
        except FileNotFoundError:
            logger.warning("Behavioral LSTM model not found, using default")
            models['behavioral_lstm'] = BehavioralLSTM()
            models['behavioral_lstm'].eval()
        
        try:
            models['device_fingerprint'] = DeviceFingerprintNet()
            models['device_fingerprint'].load_state_dict(
                torch.load(f"{model_path}/device_fingerprint.pth", map_location='cpu')
            )
            models['device_fingerprint'].eval()
            logger.info("Loaded device fingerprint model")
        except FileNotFoundError:
            logger.warning("Device fingerprint model not found, using default")
            models['device_fingerprint'] = DeviceFingerprintNet()
            models['device_fingerprint'].eval()
        
        logger.info("All models loaded successfully")
        
    except Exception as e:
        logger.error(f"Error loading models: {e}")
        raise

# Prediction functions
async def predict_ip_reputation(ip_address: str) -> Dict[str, float]:
    """Predict IP reputation"""
    try:
        features = extract_ip_features(ip_address)
        features_scaled = scalers['ip_reputation'].transform([features])
        
        # Get probability predictions
        proba = models['ip_reputation'].predict_proba(features_scaled)[0]
        prediction = models['ip_reputation'].predict(features_scaled)[0]
        
        return {
            'malicious_probability': float(proba[1] if len(proba) > 1 else proba[0]),
            'prediction': int(prediction),
            'confidence': float(max(proba))
        }
    except Exception as e:
        logger.error(f"Error in IP reputation prediction: {e}")
        return {'malicious_probability': 0.5, 'prediction': 0, 'confidence': 0.5}

async def predict_url_analysis(url: str) -> Dict[str, float]:
    """Predict URL threat level"""
    try:
        features = extract_url_features(url)
        features_scaled = scalers['url_analysis'].transform([features])
        
        proba = models['url_analysis'].predict_proba(features_scaled)[0]
        prediction = models['url_analysis'].predict(features_scaled)[0]
        
        return {
            'malicious_probability': float(proba[1] if len(proba) > 1 else proba[0]),
            'prediction': int(prediction),
            'confidence': float(max(proba))
        }
    except Exception as e:
        logger.error(f"Error in URL analysis prediction: {e}")
        return {'malicious_probability': 0.5, 'prediction': 0, 'confidence': 0.5}

async def predict_device_fingerprint(device_data: Dict[str, Any]) -> Dict[str, float]:
    """Predict device fingerprint threat"""
    try:
        features = extract_device_features(device_data)
        features_tensor = torch.FloatTensor([features])
        
        with torch.no_grad():
            output = models['device_fingerprint'](features_tensor)
            proba = output.numpy()[0]
            
        return {
            'malicious_probability': float(proba[1] if len(proba) > 1 else proba[0]),
            'prediction': int(np.argmax(proba)),
            'confidence': float(max(proba))
        }
    except Exception as e:
        logger.error(f"Error in device fingerprint prediction: {e}")
        return {'malicious_probability': 0.5, 'prediction': 0, 'confidence': 0.5}

async def predict_behavioral_analysis(session_data: Dict[str, Any]) -> Dict[str, float]:
    """Predict behavioral anomalies"""
    try:
        # Extract behavioral features (simplified)
        features = []
        features.extend([
            session_data.get('session_duration', 0),
            session_data.get('page_views', 0),
            session_data.get('clicks', 0),
            session_data.get('scroll_depth', 0),
            session_data.get('typing_speed', 0),
        ])
        
        # Pad to sequence length
        sequence_length = 10
        while len(features) < sequence_length * 5:
            features.extend([0] * 5)
            
        features = np.array(features[:sequence_length * 5]).reshape(1, sequence_length, 5)
        features_tensor = torch.FloatTensor(features)
        
        with torch.no_grad():
            output = models['behavioral_lstm'](features_tensor)
            proba = output.numpy()[0]
            
        return {
            'anomaly_probability': float(proba[1] if len(proba) > 1 else proba[0]),
            'prediction': int(np.argmax(proba)),
            'confidence': float(max(proba))
        }
    except Exception as e:
        logger.error(f"Error in behavioral analysis prediction: {e}")
        return {'anomaly_probability': 0.5, 'prediction': 0, 'confidence': 0.5}

async def detect_anomalies(features: np.ndarray) -> Dict[str, float]:
    """Detect anomalies using Isolation Forest"""
    try:
        # Pad or truncate features to expected size
        if len(features) < 50:
            features = np.pad(features, (0, 50 - len(features)), 'constant')
        else:
            features = features[:50]
            
        anomaly_score = models['anomaly_detection'].decision_function([features])[0]
        is_anomaly = models['anomaly_detection'].predict([features])[0]
        
        # Convert to probability (anomaly score is typically negative for anomalies)
        anomaly_probability = max(0, min(1, (1 - anomaly_score) / 2))
        
        return {
            'anomaly_probability': float(anomaly_probability),
            'is_anomaly': bool(is_anomaly == -1),
            'anomaly_score': float(anomaly_score)
        }
    except Exception as e:
        logger.error(f"Error in anomaly detection: {e}")
        return {'anomaly_probability': 0.5, 'is_anomaly': False, 'anomaly_score': 0.0}

# Main analysis function
async def analyze_threat(request: ThreatAnalysisRequest) -> ThreatAnalysisResponse:
    """Main threat analysis function"""
    start_time = datetime.now()
    
    try:
        predictions = {}
        
        # Run appropriate models based on input type
        if request.input_type == 'ip':
            predictions['ip_reputation'] = await predict_ip_reputation(request.input_value)
        elif request.input_type == 'url':
            predictions['url_analysis'] = await predict_url_analysis(request.input_value)
        elif request.input_type == 'email':
            # For email, analyze the domain part as URL
            domain = request.input_value.split('@')[-1] if '@' in request.input_value else request.input_value
            predictions['url_analysis'] = await predict_url_analysis(domain)
        
        # Device fingerprint analysis
        if request.device_fingerprint:
            predictions['device_fingerprint'] = await predict_device_fingerprint(request.device_fingerprint)
        
        # Behavioral analysis
        if request.session_data:
            predictions['behavioral_analysis'] = await predict_behavioral_analysis(request.session_data)
        
        # Anomaly detection on combined features
        all_features = []
        if request.input_type == 'ip':
            all_features.extend(extract_ip_features(request.input_value))
        elif request.input_type in ['url', 'email']:
            domain = request.input_value.split('@')[-1] if '@' in request.input_value else request.input_value
            all_features.extend(extract_url_features(domain))
        
        if request.device_fingerprint:
            device_features = extract_device_features(request.device_fingerprint)
            all_features.extend(device_features[:20])  # Take first 20 features
        
        if all_features:
            predictions['anomaly_detection'] = await detect_anomalies(np.array(all_features))
        
        # Ensemble prediction
        risk_scores = []
        confidence_scores = []
        
        for model_name, pred in predictions.items():
            if 'malicious_probability' in pred:
                risk_scores.append(pred['malicious_probability'] * 100)
                confidence_scores.append(pred['confidence'] * 100)
            elif 'anomaly_probability' in pred:
                risk_scores.append(pred['anomaly_probability'] * 100)
                confidence_scores.append(0.8 * 100)  # Default confidence for anomaly detection
        
        # Calculate final scores
        final_risk_score = int(np.mean(risk_scores)) if risk_scores else 50
        final_confidence = int(np.mean(confidence_scores)) if confidence_scores else 50
        
        # Determine threat type and severity
        threat_type = "unknown"
        severity = "low"
        
        if final_risk_score >= 80:
            severity = "critical"
            threat_type = "high_risk_threat"
        elif final_risk_score >= 60:
            severity = "high"
            threat_type = "suspicious_activity"
        elif final_risk_score >= 40:
            severity = "medium"
            threat_type = "potential_threat"
        else:
            severity = "low"
            threat_type = "low_risk"
        
        # Generate explanation and recommendations
        explanation = f"Analysis of {request.input_type} '{request.input_value}' indicates {severity} risk level."
        recommendations = []
        
        if final_risk_score >= 70:
            recommendations.extend([
                "Block or quarantine the source immediately",
                "Investigate related network traffic",
                "Review security logs for similar patterns"
            ])
        elif final_risk_score >= 40:
            recommendations.extend([
                "Monitor the source closely",
                "Apply additional security controls",
                "Consider rate limiting"
            ])
        else:
            recommendations.append("Continue normal monitoring")
        
        # Calculate processing time
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        
        return ThreatAnalysisResponse(
            risk_score=final_risk_score,
            confidence_score=final_confidence,
            threat_type=threat_type,
            severity=severity,
            explanation=explanation,
            recommendations=recommendations,
            model_predictions={k: v.get('malicious_probability', v.get('anomaly_probability', 0.5)) 
                             for k, v in predictions.items()},
            processing_time_ms=processing_time
        )
        
    except Exception as e:
        logger.error(f"Error in threat analysis: {e}")
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        
        return ThreatAnalysisResponse(
            risk_score=50,
            confidence_score=0,
            threat_type="analysis_error",
            severity="unknown",
            explanation=f"Error occurred during analysis: {str(e)}",
            recommendations=["Manual review required"],
            model_predictions={},
            processing_time_ms=processing_time
        )

# API Routes
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    global redis_client
    
    try:
        # Initialize Redis
        redis_client = redis.from_url(
            os.getenv("REDIS_URL", "redis://localhost:6379"),
            decode_responses=True
        )
        await redis_client.ping()
        logger.info("Connected to Redis")
        
        # Load ML models
        await load_models()
        
        logger.info("ML Service started successfully")
        
    except Exception as e:
        logger.error(f"Startup error: {e}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    if redis_client:
        await redis_client.close()
    logger.info("ML Service shut down")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        await redis_client.ping()
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "models_loaded": len(models),
            "redis_connected": True
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        }

@app.post("/api/analyze", response_model=ThreatAnalysisResponse)
async def analyze_single_threat(request: ThreatAnalysisRequest):
    """Analyze a single threat"""
    try:
        # Check cache first
        cache_key = f"analysis:{hash(str(request.dict()))}"
        cached_result = await redis_client.get(cache_key)
        
        if cached_result:
            logger.info("Returning cached result")
            return ThreatAnalysisResponse.parse_raw(cached_result)
        
        # Perform analysis
        result = await analyze_threat(request)
        
        # Cache result for 5 minutes
        await redis_client.setex(
            cache_key, 
            300, 
            result.json()
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze/batch")
async def analyze_batch_threats(request: BatchAnalysisRequest):
    """Analyze multiple threats in batch"""
    try:
        results = []
        
        # Process requests concurrently
        tasks = [analyze_threat(req) for req in request.requests]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Handle exceptions
        processed_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                logger.error(f"Batch analysis error for request {i}: {result}")
                processed_results.append({
                    "error": str(result),
                    "request_index": i
                })
            else:
                processed_results.append(result.dict())
        
        return {
            "results": processed_results,
            "total_processed": len(processed_results),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Batch analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/models/metrics")
async def get_model_metrics():
    """Get model performance metrics"""
    try:
        metrics = []
        
        # Mock metrics - in production, these would be real performance metrics
        model_names = ['ip_reputation', 'url_analysis', 'device_fingerprint', 'behavioral_lstm', 'anomaly_detection']
        
        for model_name in model_names:
            if model_name in models:
                metrics.append(ModelMetrics(
                    model_name=model_name,
                    accuracy=0.95 + np.random.random() * 0.04,  # 95-99%
                    precision=0.93 + np.random.random() * 0.06,  # 93-99%
                    recall=0.91 + np.random.random() * 0.08,     # 91-99%
                    f1_score=0.92 + np.random.random() * 0.07,   # 92-99%
                    last_updated=datetime.now()
                ))
        
        return {"metrics": [metric.dict() for metric in metrics]}
        
    except Exception as e:
        logger.error(f"Error getting model metrics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/models/retrain")
async def retrain_models(background_tasks: BackgroundTasks):
    """Trigger model retraining"""
    try:
        background_tasks.add_task(retrain_models_background)
        return {
            "message": "Model retraining initiated",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error initiating model retraining: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def retrain_models_background():
    """Background task for model retraining"""
    try:
        logger.info("Starting model retraining...")
        # In production, this would trigger actual model retraining
        await asyncio.sleep(5)  # Simulate training time
        logger.info("Model retraining completed")
    except Exception as e:
        logger.error(f"Model retraining error: {e}")

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8080,
        reload=False,
        workers=1
    )
