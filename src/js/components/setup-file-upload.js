
let fileInput, placeholder, filenameDisplay;

export function setupFileUpload() {
    fileInput = document.querySelector('.register__file-input');
    placeholder = document.querySelector('.register__item-documemt-placeholder');
    filenameDisplay = document.querySelector('.register__item-document-filename');

    if (!fileInput) return;

    fileInput.addEventListener('change', function(e) {
        const file = this.files[0];
        
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please select a PDF, JPG or PNG file');
                this.value = '';
                return;
            }
            displayFileName(file);
        }
    });
}

function displayFileName(file) {
    if (placeholder) {
        placeholder.style.display = 'none';
    }
    if (filenameDisplay) {
        filenameDisplay.textContent = `${file.name}`;
        filenameDisplay.classList.add('show');
    }
}

export function resetFileDisplay() {
    if (placeholder) {
        placeholder.style.display = 'block';
    }
    
    if (filenameDisplay) {
        filenameDisplay.textContent = '';
        filenameDisplay.classList.remove('show');
    }
    
    if (fileInput) {
        fileInput.value = '';
    }
}