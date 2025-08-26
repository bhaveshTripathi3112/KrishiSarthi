import streamlit as st
import requests
import json
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# FastAPI endpoint
API_URL = "http://localhost:8000"

st.set_page_config(
    page_title="Crop Recommendation System",
    page_icon="🌾",
    layout="wide"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        color: #2E8B57;
        text-align: center;
        margin-bottom: 2rem;
    }
    .prediction-box {
        background-color: #f0f8f0;
        padding: 1rem;
        border-radius: 10px;
        border-left: 5px solid #2E8B57;
        margin: 1rem 0;
    }
    .confidence-box {
        background-color: #e6f3ff;
        padding: 1rem;
        border-radius: 10px;
        border-left: 5px solid #4169E1;
        margin: 1rem 0;
    }
    .input-container {
        background-color: #fafafa;
        padding: 1.5rem;
        border-radius: 10px;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

def check_api_health():
    """Check if the FastAPI server is running"""
    try:
        response = requests.get(f"{API_URL}/health", timeout=5)
        return response.status_code == 200
    except requests.exceptions.RequestException:
        return False

def get_model_info():
    """Get model information from the API"""
    try:
        response = requests.get(f"{API_URL}/model-info", timeout=5)
        if response.status_code == 200:
            return response.json()
        return None
    except requests.exceptions.RequestException:
        return None

def make_prediction(input_data):
    """Make prediction using the FastAPI endpoint"""
    try:
        response = requests.post(
            f"{API_URL}/predict",
            json=input_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            return response.json(), None
        else:
            return None, f"API Error: {response.status_code} - {response.text}"
    except requests.exceptions.RequestException as e:
        return None, f"Connection Error: {str(e)}"

def make_detailed_prediction(input_data):
    """Make detailed prediction using the FastAPI endpoint"""
    try:
        response = requests.post(
            f"{API_URL}/predict-detailed",
            json=input_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            return response.json(), None
        else:
            return None, f"API Error: {response.status_code} - {response.text}"
    except requests.exceptions.RequestException as e:
        return None, f"Connection Error: {str(e)}"

def create_input_visualization(input_data):
    """Create a radar chart for input parameters"""
    categories = ['N', 'P', 'K', 'Temperature', 'Humidity', 'pH', 'Rainfall']
    values = [
        input_data['N'], input_data['P'], input_data['K'],
        input_data['temperature'], input_data['humidity'],
        input_data['ph'], input_data['rainfall']
    ]
    
    # Normalize values for better visualization (simple min-max scaling)
    normalized_values = []
    ranges = {
        'N': (0, 140), 'P': (5, 145), 'K': (5, 205),
        'temperature': (8, 45), 'humidity': (14, 100),
        'ph': (3.5, 10), 'rainfall': (20, 300)
    }
    
    for i, cat in enumerate(['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']):
        min_val, max_val = ranges[cat]
        normalized = (values[i] - min_val) / (max_val - min_val) * 100
        normalized_values.append(max(0, min(100, normalized)))
    
    fig = go.Figure()
    
    fig.add_trace(go.Scatterpolar(
        r=normalized_values,
        theta=categories,
        fill='toself',
        name='Input Values',
        line_color='rgb(46, 139, 87)',
        fillcolor='rgba(46, 139, 87, 0.3)'
    ))
    
    fig.update_layout(
        polar=dict(
            radialaxis=dict(
                visible=True,
                range=[0, 100]
            )),
        showlegend=False,
        title="Input Parameters Visualization",
        height=400
    )
    
    return fig

def main():
    st.markdown('<h1 class="main-header">🌾 Crop Recommendation System</h1>', unsafe_allow_html=True)
    
    # Check API health
    if not check_api_health():
        st.error("⚠️ FastAPI server is not running! Please start the FastAPI server first.")
        st.markdown("**To start the FastAPI server:**")
        st.code("python fastapi_app.py", language="bash")
        st.markdown("**Or with uvicorn:**")
        st.code("uvicorn fastapi_app:app --reload", language="bash")
        return
    
    st.success("✅ Connected to FastAPI server")
    
    # Get model info
    model_info = get_model_info()
    if model_info:
        with st.expander("ℹ️ Model Information"):
            col1, col2 = st.columns(2)
            with col1:
                st.write(f"**Model Type:** {model_info.get('model_type', 'N/A')}")
                st.write(f"**Number of Features:** {model_info.get('n_features', 'N/A')}")
            with col2:
                st.write(f"**Number of Classes:** {model_info.get('n_classes', 'N/A')}")
                if model_info.get('classes'):
                    st.write(f"**Available Crops:** {len(model_info['classes'])}")
    
    # Create two columns for input and results
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown('<div class="input-container">', unsafe_allow_html=True)
        st.subheader("🌱 Enter Soil & Climate Parameters")
        
        # Soil nutrients
        st.markdown("**Soil Nutrients (mg/kg)**")
        col_n, col_p, col_k = st.columns(3)
        with col_n:
            nitrogen = st.number_input("Nitrogen (N)", min_value=0.0, max_value=200.0, value=90.0, step=1.0)
        with col_p:
            phosphorus = st.number_input("Phosphorus (P)", min_value=0.0, max_value=200.0, value=42.0, step=1.0)
        with col_k:
            potassium = st.number_input("Potassium (K)", min_value=0.0, max_value=300.0, value=43.0, step=1.0)
        
        # Climate conditions
        st.markdown("**Climate Conditions**")
        col_temp, col_hum = st.columns(2)
        with col_temp:
            temperature = st.number_input("Temperature (°C)", min_value=0.0, max_value=50.0, value=20.9, step=0.1)
        with col_hum:
            humidity = st.number_input("Humidity (%)", min_value=0.0, max_value=100.0, value=82.0, step=0.1)
        
        col_ph, col_rain = st.columns(2)
        with col_ph:
            ph = st.number_input("pH", min_value=0.0, max_value=14.0, value=6.5, step=0.1)
        with col_rain:
            rainfall = st.number_input("Rainfall (mm)", min_value=0.0, max_value=400.0, value=202.9, step=0.1)
        
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Predict button
        predict_button = st.button("🔮 Predict Recommended Crop", type="primary", use_container_width=True)
        debug_button = st.button("🔍 Detailed Analysis", use_container_width=True)
    
    with col2:
        if predict_button or debug_button:
            # Prepare input data
            input_data = {
                "N": nitrogen,
                "P": phosphorus,
                "K": potassium,
                "temperature": temperature,
                "humidity": humidity,
                "ph": ph,
                "rainfall": rainfall
            }
            
            if debug_button:
                # Make detailed prediction
                with st.spinner("Making detailed analysis..."):
                    prediction_result, error = make_detailed_prediction(input_data)
                
                if error:
                    st.error(f"❌ {error}")
                else:
                    # Display detailed results
                    st.markdown('<div class="prediction-box">', unsafe_allow_html=True)
                    st.subheader("🎯 Top Crop Recommendations")
                    
                    for i, pred in enumerate(prediction_result['top_5_predictions']):
                        confidence_percent = pred['probability'] * 100
                        st.write(f"**{i+1}. {pred['crop'].upper()}** - {confidence_percent:.1f}%")
                        st.progress(pred['probability'])
                        st.write("")
                    
                    st.markdown('</div>', unsafe_allow_html=True)
                    
                    # Show input visualization
                    st.subheader("📈 Input Parameters Radar Chart")
                    radar_fig = create_input_visualization(input_data)
                    st.plotly_chart(radar_fig, use_container_width=True)
                    
                    # Show input summary
                    with st.expander("📋 Input Summary"):
                        input_df = pd.DataFrame([input_data])
                        st.dataframe(input_df, use_container_width=True)
                    
                    # Show all probabilities
                    with st.expander("🔍 All Crop Probabilities"):
                        all_probs = prediction_result['all_probabilities']
                        prob_df = pd.DataFrame(
                            [(crop, prob*100) for crop, prob in all_probs.items()],
                            columns=['Crop', 'Probability (%)']
                        ).sort_values('Probability (%)', ascending=False)
                        st.dataframe(prob_df, use_container_width=True)
            
            else:
                # Make regular prediction
                with st.spinner("Making prediction..."):
                    prediction_result, error = make_prediction(input_data)
                
                if error:
                    st.error(f"❌ {error}")
                else:
                    # Display prediction
                    st.markdown('<div class="prediction-box">', unsafe_allow_html=True)
                    st.subheader("🎯 Recommended Crop")
                    st.markdown(f"## {prediction_result['predicted_crop'].upper()}")
                    st.markdown('</div>', unsafe_allow_html=True)
                    
                    # Display confidence
                    confidence_percent = prediction_result['confidence'] * 100
                    st.markdown('<div class="confidence-box">', unsafe_allow_html=True)
                    st.subheader("📊 Prediction Confidence")
                    st.progress(prediction_result['confidence'])
                    st.markdown(f"**{confidence_percent:.1f}%** confidence")
                    st.markdown('</div>', unsafe_allow_html=True)
                    
                    # Show input visualization
                    st.subheader("📈 Input Parameters Radar Chart")
                    radar_fig = create_input_visualization(input_data)
                    st.plotly_chart(radar_fig, use_container_width=True)
                    
                    # Show input summary
                    with st.expander("📋 Input Summary"):
                        input_df = pd.DataFrame([input_data])
                        st.dataframe(input_df, use_container_width=True)
    
    # Sample data section
    st.markdown("---")
    st.subheader("📚 Sample Data for Testing")
    
    sample_data = {
        "Crop": ["Rice", "Wheat", "Cotton", "Sugarcane"],
        "N": [90, 30, 120, 75],
        "P": [42, 40, 70, 32],
        "K": [43, 20, 80, 30],
        "Temperature": [20.9, 15.5, 25.2, 30.1],
        "Humidity": [82.0, 65.0, 75.0, 85.0],
        "pH": [6.5, 7.2, 6.8, 6.0],
        "Rainfall": [202.9, 120.0, 180.0, 250.0]
    }
    
    sample_df = pd.DataFrame(sample_data)
    st.dataframe(sample_df, use_container_width=True)
    
    col_sample1, col_sample2, col_sample3, col_sample4 = st.columns(4)
    
    sample_buttons = []
    for i, (col, crop) in enumerate(zip([col_sample1, col_sample2, col_sample3, col_sample4], sample_data["Crop"])):
        with col:
            if st.button(f"Try {crop} Sample", key=f"sample_{i}"):
                # Update session state with sample values
                st.session_state.update({
                    'sample_n': sample_data['N'][i],
                    'sample_p': sample_data['P'][i],
                    'sample_k': sample_data['K'][i],
                    'sample_temp': sample_data['Temperature'][i],
                    'sample_hum': sample_data['Humidity'][i],
                    'sample_ph': sample_data['pH'][i],
                    'sample_rain': sample_data['Rainfall'][i]
                })
                st.rerun()
    
    # Apply sample values if they exist in session state
    if 'sample_n' in st.session_state:
        st.info("Sample data loaded! Scroll up to see the values and click predict.")

if __name__ == "__main__":
    main()