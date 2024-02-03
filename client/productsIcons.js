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
        productsContainer === null || productsContainer === void 0 ? void 0 : productsContainer.appendChild(productDiv);
    });
    productsContainer === null || productsContainer === void 0 ? void 0 : productsContainer.addEventListener('click', function (event) {
        const clickedElement = event.target;
        if (clickedElement.tagName === 'IMG') {
            const productElement = clickedElement.closest('.product');
            const productLink = productElement === null || productElement === void 0 ? void 0 : productElement.querySelector('a');
            if (productLink) {
                window.location.href = productLink.href;
            }
        }
    });
});
export {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdHNJY29ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGllbnQvcHJvZHVjdHNJY29ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxNQUFNLFFBQVEsR0FBRztJQUNiO1FBQ0ksSUFBSSxFQUFFLGlCQUFpQjtRQUN2QixJQUFJLEVBQUUsd0ZBQXdGO1FBQzlGLEtBQUssRUFBRSxNQUFNO1FBQ2IsS0FBSyxFQUFFLHdCQUF3QjtLQUNsQztJQUNELHFDQUFxQztDQUV4QyxDQUFDO0FBRUYsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFO0lBQzFDLE1BQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBRXhFLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDdkIsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqRCxVQUFVLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUVqQyxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25ELFlBQVksQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUNqQyxZQUFZLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDaEMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVyQyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hELFdBQVcsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUNoQyxXQUFXLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDdkMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVwQyxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25ELFlBQVksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO1FBQ2pDLFlBQVksQ0FBQyxXQUFXLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUM7UUFDL0MsVUFBVSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVyQyxpQkFBaUIsYUFBakIsaUJBQWlCLHVCQUFqQixpQkFBaUIsQ0FBRSxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxpQkFBaUIsYUFBakIsaUJBQWlCLHVCQUFqQixpQkFBaUIsQ0FBRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxLQUFLO1FBQ3hELE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxNQUFxQixDQUFDO1FBRW5ELElBQUksY0FBYyxDQUFDLE9BQU8sS0FBSyxLQUFLLEVBQUU7WUFDbEMsTUFBTSxjQUFjLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMxRCxNQUFNLFdBQVcsR0FBRyxjQUFjLGFBQWQsY0FBYyx1QkFBZCxjQUFjLENBQUUsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXZELElBQUksV0FBVyxFQUFFO2dCQUNiLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUM7YUFDM0M7U0FDSjtJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMifQ==