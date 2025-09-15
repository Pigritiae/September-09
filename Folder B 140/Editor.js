// Get all necessary DOM elements
const imageUpload = document.getElementById('imageUpload');
const preview = document.getElementById('preview');
const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const saturation = document.getElementById('saturation');
const blur = document.getElementById('blur');
let img = null;

// The event listeners must be placed inside a DOMContentLoaded event to ensure all HTML elements are loaded before the script tries to attach event listeners to them.
document.addEventListener('DOMContentLoaded', () => {

    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                img = new Image();
                img.src = e.target.result;
                // Added a class to the image element for styling
                img.classList.add('preview-img');
                img.onload = () => {
                    preview.innerHTML = '';
                    preview.appendChild(img);
                    applyFilters();
                };
            };
            reader.readAsDataURL(file);
        }
    });

    // Event listeners for the filter controls to apply the effect in real-time
    brightness.addEventListener('input', applyFilters);
    contrast.addEventListener('input', applyFilters);
    saturation.addEventListener('input', applyFilters);
    blur.addEventListener('input', applyFilters);

    // Initial check to ensure that the image variable is null before any image is loaded
    if (img === null) {
        // You can add a placeholder image here or a message if you want
    }
});

function applyFilters() {
    if (img) {
        // Corrected: The filter values were not correctly formatted into a single string.
        // It should be a space-separated list of functions. I've also re-ordered them for better readability.
        // The brightness, contrast, and saturation values are ratios, so we use /100.
        // The blur value is in pixels, so we append 'px'.
        const brightnessValue = brightness.value;
        const contrastValue = contrast.value;
        const saturationValue = saturation.value;
        const blurValue = blur.value;
        
        img.style.filter = `brightness(${brightnessValue}%) contrast(${contrastValue}%) saturate(${saturationValue}%) blur(${blurValue}px)`;
    }
}

function saveImage() {
    if (img) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        // Corrected: The `filter` property is not a direct property of the context.
        // You need to set the filter on the context before drawing the image.
        ctx.filter = `brightness(${brightness.value}%) contrast(${contrast.value}%) saturate(${saturation.value}%) blur(${blur.value}px)`;
        ctx.drawImage(img, 0, 0);

        const link = document.createElement('a');
        link.download = 'edited_image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    } else {
        alert('Please Upload an Image First.');
    }
}
/* Código corrigido pela IA Gemini, por mais que apenas on drag do contrast do código copiado original não estava funcionando */