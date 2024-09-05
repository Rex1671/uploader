document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const progressBar = document.getElementById('progress-bar');
    const results = document.getElementById('results');

    const storage = firebase.storage().ref();

    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', handleFiles);

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragging');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragging');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragging');
        handleFiles(e.dataTransfer.files);
    });

    function handleFiles(files) {
        const now = new Date().toISOString().replace(/:/g, '-'); // Replace ':' for compatibility with Firebase Storage
        Array.from(files).forEach(file => uploadFile(file, now));
    }

    function uploadFile(file, folderName) {
        const fileRef = storage.child(`${folderName}/${file.name}`);
        const uploadTask = fileRef.put(file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressBar.value = progress;
        }, (error) => {
            console.error('Upload failed:', error);
            results.innerHTML += `<p>Failed to upload ${file.name}</p>`;
        }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                results.innerHTML += `<p>Uploaded ${file.name}: <a href="${downloadURL}" target="_blank">${downloadURL}</a></p>`;
            });
        });
    }
});
