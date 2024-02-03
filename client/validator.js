var _a, _b, _c, _d, _e;
function validateForm() {
    var _a, _b;
    const model = (_a = document.getElementById('model')) === null || _a === void 0 ? void 0 : _a.value.trim();
    const category = (_b = document.getElementById('category')) === null || _b === void 0 ? void 0 : _b.value.trim();
    const modelError = document.getElementById('modelError');
    const categoryError = document.getElementById('categoryError');
    const modelField = document.getElementById('model');
    const categoryField = document.getElementById('category');
    modelError.textContent = ''; // Очищаем сообщения об ошибке
    categoryError.textContent = '';
    modelField.classList.remove('error'); // Убираем подсветку ошибки
    categoryField.classList.remove('error');
    if (!/^[a-zA-Z0-9\s]+$/.test(model)) {
        modelError.textContent = 'Please write a model.'; // Устанавливаем текст ошибки для модели
        modelField.classList.add('error'); // Добавляем подсветку ошибки
    }
    if (!['man', 'woman', 'child'].includes(category)) {
        categoryError.textContent = 'Please write a valid category (man, woman, or child).'; // Устанавливаем текст ошибки для категории
        categoryField.classList.add('error'); // Добавляем подсветку ошибки
    }
    return !modelError.textContent && !categoryError.textContent;
}
// Вызов функции валидации при изменении содержимого полей и потере фокуса
(_a = document.getElementById('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', function (event) {
    if (!validateForm()) {
        event.preventDefault();
        alert('Please correct the errors before submitting.');
    }
});
(_b = document.getElementById('model')) === null || _b === void 0 ? void 0 : _b.addEventListener('input', validateForm);
(_c = document.getElementById('model')) === null || _c === void 0 ? void 0 : _c.addEventListener('blur', validateForm);
(_d = document.getElementById('category')) === null || _d === void 0 ? void 0 : _d.addEventListener('input', validateForm);
(_e = document.getElementById('category')) === null || _e === void 0 ? void 0 : _e.addEventListener('blur', validateForm);
export {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsaWVudC92YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLFNBQVMsWUFBWTs7SUFDakIsTUFBTSxLQUFLLEdBQUcsTUFBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBc0IsMENBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ25GLE1BQU0sUUFBUSxHQUFHLE1BQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQXNCLDBDQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN6RixNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBZ0IsQ0FBQztJQUN4RSxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBZ0IsQ0FBQztJQUM5RSxNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBcUIsQ0FBQztJQUN4RSxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBcUIsQ0FBQztJQUU5RSxVQUFVLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxDQUFDLDhCQUE4QjtJQUMzRCxhQUFhLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztJQUMvQixVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLDJCQUEyQjtJQUNqRSxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUV4QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ2pDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsdUJBQXVCLENBQUMsQ0FBQyx3Q0FBd0M7UUFDMUYsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyw2QkFBNkI7S0FDbkU7SUFFRCxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUMvQyxhQUFhLENBQUMsV0FBVyxHQUFHLHVEQUF1RCxDQUFDLENBQUMsMkNBQTJDO1FBQ2hJLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsNkJBQTZCO0tBQ3RFO0lBQ0QsT0FBTyxDQUFDLFVBQVUsQ0FBQyxXQUFXLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDO0FBQ2pFLENBQUM7QUFFRCwwRUFBMEU7QUFDMUUsTUFBQSxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQywwQ0FBRSxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsVUFBVSxLQUFLO0lBQ3ZFLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRTtRQUNqQixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdkIsS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7S0FDekQ7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUlILE1BQUEsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsMENBQUUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzFFLE1BQUEsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsMENBQUUsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3pFLE1BQUEsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsMENBQUUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzdFLE1BQUEsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsMENBQUUsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDIn0=