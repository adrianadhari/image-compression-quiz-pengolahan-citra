from flask import Flask, request, jsonify, send_from_directory
import cv2
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'static/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Endpoint untuk upload dan compress image
@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    # Simpan gambar yang di-upload
    input_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(input_path)

    # Proses kompresi menggunakan OpenCV
    output_path = os.path.join(app.config['UPLOAD_FOLDER'], 'compressed_' + file.filename)
    image = cv2.imread(input_path)
    cv2.imwrite(output_path, image, [int(cv2.IMWRITE_JPEG_QUALITY), 50])  # Kompres dengan kualitas 50

    # Hitung ukuran file asli dan terkompresi
    original_size = os.path.getsize(input_path) / 1024  # dalam KB
    compressed_size = os.path.getsize(output_path) / 1024  # dalam KB

    # Return informasi ukuran dan path gambar
    return jsonify({
        "original_size": f"{original_size:.2f} KB",
        "compressed_size": f"{compressed_size:.2f} KB",
        "original_image": f"/static/{file.filename}",
        "compressed_image": f"/static/compressed_{file.filename}"
    }), 200  # Jangan lupa return kode 200 di akhir

# Route untuk akses gambar
@app.route('/static/<path:filename>')
def serve_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
