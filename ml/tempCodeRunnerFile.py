from flask import Flask, request, jsonify
import pickle
from drug_detection_model import predict  # import your function

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict_endpoint():
    data = request.json
    text = data.get('text', '')
    confidence = predict(text)
    return jsonify({'confidence': confidence, 'isSuspicious': confidence > 0.7})

if __name__ == '__main__':
    app.run(port=5001)