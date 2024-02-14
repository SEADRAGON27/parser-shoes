export function validateForm(): boolean {
    const model = (
        document.getElementById('model') as HTMLInputElement
    )?.value.trim();
    const category = (
        document.getElementById('category') as HTMLInputElement
    )?.value.trim();
    const modelError = document.getElementById('modelError') as HTMLElement;
    const categoryError = document.getElementById(
        'categoryError',
    ) as HTMLElement;
    const modelField = document.getElementById('model') as HTMLInputElement;
    const categoryField = document.getElementById(
        'category',
    ) as HTMLInputElement;

    modelError.textContent = ''; 
    categoryError.textContent = '';
    modelField.classList.remove('error'); 
    categoryField.classList.remove('error');

    if (!/^[a-zA-Z0-9\s]+$/.test(model)) {
        modelError.textContent = 'Please write a model.'; 
        modelField.classList.add('error'); 
    }

    if (!['man', 'woman', 'child'].includes(category)) {
        categoryError.textContent =
            'Please write a valid category (man, woman, or child).'; 
        categoryField.classList.add('error'); 
    }
    return !modelError.textContent && !categoryError.textContent;
}


document.getElementById('form')?.addEventListener('submit', function (event) {
    if (!validateForm()) {
        event.preventDefault();
        alert('Please correct the errors before submitting.');
    }
});

document.getElementById('model')?.addEventListener('input', validateForm);
document.getElementById('model')?.addEventListener('blur', validateForm);
document.getElementById('category')?.addEventListener('input', validateForm);
document.getElementById('category')?.addEventListener('blur', validateForm);
