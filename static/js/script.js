document.addEventListener('DOMContentLoaded', function() {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');

    dropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropArea.classList.add('dragging');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('dragging');
    });

    dropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        dropArea.classList.remove('dragging');
        const files = event.dataTransfer.files;
        fileInput.files = files;
        updateFileList(files);
    });

    fileInput.addEventListener('change', (event) => {
        updateFileList(event.target.files);
    });

    function updateFileList(files) {
        fileList.innerHTML = '';
        Array.from(files).forEach(file => {
            const listItem = document.createElement('li');
            const fileName = document.createElement('span');
            fileName.textContent = file.name;

            if (file.type.startsWith('image/')) {
                const thumbnail = document.createElement('img');
                const reader = new FileReader();
                reader.onload = (e) => {
                    thumbnail.src = e.target.result;
                };
                reader.readAsDataURL(file);
                listItem.appendChild(thumbnail);
            } else {
                const icon = document.createElement('img');
                icon.src = '/static/img/file-icon.png'; // 適当なアイコン画像を指定
                icon.classList.add('icon');
                listItem.appendChild(icon);
            }

            listItem.appendChild(fileName);
            fileList.appendChild(listItem);
        });
    }

    document.getElementById('drop-area').addEventListener('click', () => {
        document.getElementById('file-input').click();
    });
});