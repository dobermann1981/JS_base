"use strict"

// Класс товар 
class Product {
    constructor(name, price) {
        this.name = name; // Имя товара 
        this.price = price; // Цена товара
        this.count = 1;  // Количество данного товара в корзине
    }
}

// Класс корзина
class Bascet {
    constructor() {
        this.summa = 0; // сумма стоимости всех товаров в корзине
        this.productsCount = 0; // счетчик количетсва всех товаров в корзине
        this.products = []; // массив  всех добавляемых в корзину товаров
    }

    /**
     * добавляет товар в корзину. Если товар с таким же именем есть в корзине, 
     * то увеличивает его количество на 1
     * @param {string} name Имя товара
     * @param {number} price Цена товара
     * @returns {*} undefine
     */
    addProduct(name, price) {
        if (this.ifIncludedProduct(name).include) {
            //если такой товар уже есть в корзине
            //увеличиваем счетчик данного товара на 1
            this.products[this.ifIncludedProduct(name).index].count++;
        } else {
            //если товар отсутвует в корзине, то добавляем его
            this.products.push(new Product(name, price));
        }
    }

    /**
    * Определяет наличие товара в корзине по его имени
    * @param {string} name Имя товара
    * @returns {include:boolean, index:Number} include: true - товар
    * уже есть в корзине,include: false - товара нет в корзине
    * index- индекс товара в массиве продуктов корзины
    * */
    ifIncludedProduct(name) {
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].name === name) {
                return { include: true, index: i };
                break;
            }
        }
        return { include: false, index: this.products.length };
    }

    /**
    * Увеличивает общую стоимость товаров всей корзины на полученную 
    * стоимость товара
    * @param {number} price Цена товара 
    * @returns {*} undefine
    */
    addSumm(price) {
        this.summa += price;
    }

    /**
     * увеличивает общее количество товаров в корзине на переданное количество
     * @param {number} count Количество товара, по умолчанию=1
     * @returns {*} undefine
     */
    countItarate(count = 1) {
        this.productsCount += count;
    }

    /**
    * выводит на страницу общее количество товаров 
    * @param {HTMLElement} element Место вывода счетчика общего количества 
    * товаров в корзине
    * @returns {*} undefine
    */
    countPrompt(element) {
        element.textContent = this.productsCount.toString();
    }

    /**
    * выдает полный HTML-код корзины
    * @returns {string} полный HTML-код корзины
    * */
    getBascetMarkup() {
        let htmlBascetLine = '';
        // перебираем весь массив с товарами и формируем
        // HTML-код строк товаров корзины
        for (let i = 0; i < this.products.length; i++) {
            htmlBascetLine += `<div class="bascet-line">
            <div class="bascet-line-row-name">${this.products[i].name}</div>
            <div class="bascet-line-row-wrp">
                <div class="bascet-line-row">${this.products[i].count}</div>
                <div class="bascet-line-row">${this.products[i].price}</div>
                <div class="bascet-line-row">
                ${this.products[i].count * this.products[i].price}</div>
            </div>
        </div>`;
        }
        // Формируем  новый полный HTML-код корзины и возвращаем
        return `<div class="bascet-line title">
            <div class="bascet-line-row-name">Название товара</div>
            <div class="bascet-line-row-wrp">
                <div class="bascet-line-row">Количество</div>
                <div class="bascet-line-row">Цена за шт.</div>
                <div class="bascet-line-row">Итого</div>
            </div>
        </div>`+ htmlBascetLine +
            `<div class="bascet-line sum">
            Товаров в корзине на сумму: \$${this.summa.toFixed(2)}
            </div>`;
    }
}

// создаем объект корзина. она пустая
const bascet = new Bascet();

// Берем элемент - отображение счетчика у корзины (кружок)
//отображение-скрытие состава корзины при клике на этот счетчик,
//при клике на корзину - уходим на страницу корзины (CSS)
document.querySelector('.menu-ico-bascet-count').
    addEventListener('click', event => {
        event.preventDefault();
        document.querySelector('.bascet-wrp').classList.toggle('hiden');
    });

// обработчик клика на кнопку добавления товара в корзину
// Проверяем куда кликнули
// если клик на кнопку или иконку в кнопке, действие по умолчанию
// не выполнять (переход на страницу товара), а добавить товар в корзину
document.querySelector('.items').addEventListener('click', event => {
    if (event.target.classList.contains('btn-add-item') ||
        event.target.classList.contains('btn-add-item-ico')) {
        event.preventDefault();
        bascet.countItarate();
        bascet.countPrompt(document.querySelector('.menu-ico-bascet-count'));
        bascet.addProduct(
            getClickProductNameEl(event.target).textContent.trim(),
            getClickProductPrice(getClickProductNameEl(event.target)));
        bascet.addSumm(getClickProductPrice(getClickProductNameEl(event.target)));
        document.querySelector('.bascet-wrp').
            innerHTML = bascet.getBascetMarkup();
    }
});

/**
 * Возвращает HTML-Element c описанием имени кликнутого товара
 * в зависимости от того, на что кликнули - получаем элемент с описанием товара
 * @param {HTML-element} element - HTML-element на который произведен клик
 * @returns {HTML-element} HTML-element 
 */
function getClickProductNameEl(element) {
    if (element.classList.contains('btn-add-item')) {
        return element.parentElement.nextElementSibling;
    }
    if (element.classList.contains('btn-add-item-ico')) {
        return element.parentElement.parentElement.nextElementSibling;
    }
}

/**
 * Определяет цену кликнутого товара по HTML элементу-описанию  карточки товара
 * @param {HTML} element HTML-element c описанием товара
 * @returns {number} цена товара 
 */
function getClickProductPrice(element) {
    return +element.nextElementSibling.nextElementSibling.textContent.trim()
        .substring(1);
}
