from flask import Flask, request, send_from_directory, render_template
from pathlib import Path
import random
import string
import pyminizip

app = Flask(__name__)
UPLOAD_FOLDER = Path('uploads')
UPLOAD_FOLDER.mkdir(exist_ok=True)

def generate_password(length=16):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

@app.route('/')
def index():
    return render_template('index.html', title='HIKYAKU（飛脚）')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No files part', 400
    files = request.files.getlist('file')
    if not files:
        return 'No files selected', 400

    zip_filename = 'uploaded_files.zip'
    zip_path = UPLOAD_FOLDER / zip_filename
    password = generate_password()

    temp_files = []
    for file in files:
        if file.filename == '':
            continue
        file_path = UPLOAD_FOLDER / file.filename
        file.save(file_path)
        temp_files.append(str(file_path))

    # Create password-protected ZIP file
    encrypted_zip_path = str(UPLOAD_FOLDER / f"encrypted_{zip_filename}")
    pyminizip.compress_multiple(temp_files, [], encrypted_zip_path, password, 5)

    # Clean up temporary files
    for temp_file in temp_files:
        Path(temp_file).unlink()

    return f'Upload successful. ZIP password: {password}', 200

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True)