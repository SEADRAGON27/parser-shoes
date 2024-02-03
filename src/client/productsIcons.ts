
const products = [
    {
        name: 'New balance 574',
        link: 'https://www.nike.one/uploads/shop/products/medium/39d2363eb321de4b933f640bb28addfc.png',
        price: '2700',
        image: 'ссылка_на_товар_1.html'
    },
    // Добавьте другие товары по аналогии
    
];

document.addEventListener('DOMContentLoaded', function () {
    const productsContainer = document.getElementById('products-container');

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';

        const productImage = document.createElement('img');
        productImage.src = product.image;
        productImage.alt = product.name;
        productDiv.appendChild(productImage);

        const productLink = document.createElement('a');
        productLink.href = product.link;
        productLink.textContent = product.name;
        productDiv.appendChild(productLink);

        const priceElement = document.createElement('div');
        priceElement.className = 'price';
        priceElement.textContent = `${product.price}₴`;
        productDiv.appendChild(priceElement);

        productsContainer?.appendChild(productDiv);
    });

    productsContainer?.addEventListener('click', function (event) {
        const clickedElement = event.target as HTMLElement;

        if (clickedElement.tagName === 'IMG') {
            const productElement = clickedElement.closest('.product');
            const productLink = productElement?.querySelector('a');

            if (productLink) {
                window.location.href = productLink.href;
            }
        }
    });
});
