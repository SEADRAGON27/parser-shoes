function validateForm(): boolean {
    const model = (document.getElementById('model') as HTMLInputElement)?.value.trim();
    const category = (document.getElementById('gender') as HTMLInputElement)?.value.trim();
    const modelError = document.getElementById('modelError') as HTMLElement;
    const categoryError = document.getElementById('genderError') as HTMLElement;
    const modelField = document.getElementById('model') as HTMLInputElement;
    const categoryField = document.getElementById('gender') as HTMLInputElement;
  
    modelError.textContent = '';
    categoryError.textContent = '';
    modelField.classList.remove('error');
    categoryField.classList.remove('error');
  
    if (!/^[a-zA-Z0-9\s]+$/.test(model)) {
        modelError.textContent = 'Please write a model.';
        modelField.classList.add('error');
    }
  
    if (!['man', 'woman', 'child'].includes(category.toLowerCase())) {
        categoryError.textContent = 'Please write a valid gender (man, woman, or child).';
        categoryField.classList.add('error');
    }
  
    return !modelError.textContent && !categoryError.textContent;
}
  
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    const modelInput = document.getElementById('model');
    const genderInput = document.getElementById('gender');
  
    if (form && modelInput && genderInput) {
        form.addEventListener('submit', function(event) {
            if (!validateForm()) {
                event.preventDefault();
                alert('Please correct the errors before submitting.');
            }
        });
  
        modelInput.addEventListener('input', validateForm);
        modelInput.addEventListener('blur', validateForm);
        genderInput.addEventListener('input', validateForm);
        genderInput.addEventListener('blur', validateForm);
    }
});