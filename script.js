
//Vars
const productSearcher = document.querySelector(".inputProduct");
const productSelecter = document.querySelector(".possibleProducts-container");

const clientSearcher = document.querySelector(".inputClient");
const clientSelecter = document.querySelector(".possibleClient-container");

const billDate = document.querySelector(".bill-date");
const billTime = document.querySelector(".bill-time");
const billId = document.querySelector(".bill-id");
const billClient = document.querySelector(".bill-client");
const billItemsAmount = document.querySelector(".bill-items-amount");


const productsContainer = document.querySelector(".products-container");

const totalPriceText = document.querySelector(".totalPrice-text");

const date = new Date();
const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const products = [
    new Product("Salchicha", 1500000, ["Ranchera", "Americana"]),
    new Product("Arroz", 4500, []),
    new Product("Aceite", 12000, ["Girasol", "Maíz"]),
    new Product("Agua", 2500, []),
    new Product("Leche", 3800, ["Entera", "Deslactosada"]),
    new Product("Huevos", 18000, []),
    new Product("Queso", 7500, ["Mozzarella", "Cheddar", "Campesino"]),
    new Product("Pan", 3000, []),
    new Product("Café", 9500, ["Sello Rojo", "Águila Roja"]),
    new Product("Azúcar", 4000, [])
];

const clients = [
    new Client("Maria", {"Salchicha": 1400, "Arroz": 4200}),
    new Client("Carlos", {}),
    new Client("Ana", {"Aceite": 11500}),
    new Client("Pedro", {}),
    new Client("Lucia", {"Leche": 3500, "Pan": 2800}),
    new Client("Mateo", {}),
    new Client("Sofia", {"Queso": 7000}),
    new Client("David", {}),
    new Client("Valentina", {"Café": 9000, "Azúcar": 3800}),
    new Client("Andrés", {})
];

const billProducts = [];

let foundProducts = [];
let foundClients = [];

let chosenOption = [/*option, fatherOption, index, i{0:product, 1:client, 2: billProduct}*/];

let chosenClient;
let chosenProduct = [/*producto, etiqueta*/];

let billNumber = 0;

let billStarted = true;
let modifingProductAmount = false;

let editingPriceProduct = false;

//Functions

const chooseOption = (option, father, index, type)=>{
    if(chosenOption[0] != null){
        chosenOption[0].removeAttribute('id')
        chosenOption[0].id = '';
    }
    chosenOption = [option, father, index, type];
    if(option)
        chosenOption[0].id = 'option-chosen';

    if(type == 2){
        chooseBillProduct(option);
    }
}
const addOption =(container, product)=>{
    container.innerHTML += `<p class="possibleOption">${product.price == 0 ? 'Crear Producto "' : ''}${product.name}${product.price == 0 ?'"' : ''}</p>`;
}
const addProduct = product =>{
    let price = product.price;
    productsContainer.innerHTML += `
        <div class="product ${product.name} product${billProducts.length}">
            <p class="bill-text product-name">${product.name}</p>
            <p class="bill-text product-amount"></p>
            <p class="bill-text product-price">$ ${getNumberFormat(price)}</p>
        </div>`;
    
}
const getPossibleProducts = string =>{
    res = [];
    for(let i = 0; i < products.length; i ++){
        if(products[i].name.toLowerCase().startsWith(string.toLowerCase()))
            res.push(products[i])
    }
    return res;
}
const getPossibleClients = string =>{
    res = [];
    for(let i = 0; i < products.length; i ++){
        if(clients[i].name.toLowerCase().startsWith(string.toLowerCase()))
            res.push(clients[i])
    }
    return res;
}
const clearSelector = (input, selector) =>{
    input.value = '';
    selector.innerHTML = '';
}
const getTotalPrice = ()=>{
    let result = 0;
    billProducts.forEach(product => result += product.price);
    return result;
}
const getNumberFormat = number =>{
    return new Intl.NumberFormat('es-CO').format(number)
}
const getBillProductNumber = billProduct =>{return parseInt(billProduct.className[billProduct.className.length - 1]) - 1;}
const chooseProductToEdit = billProduct=>{
    editingPriceProduct = true;
    
    billProduct.children[2].contentEditable = true;
    
    billProduct.children[2].innerHTML = billProducts[getBillProductNumber(billProduct)].price;
    billProduct.children[2].focus();
}
const chooseBillProduct = product =>{
    if(chosenProduct[1]){
        document.querySelector(`.${chosenProduct[0].name}`).removeAttribute('id');
    }

    chosenProduct = [billProducts[getBillProductNumber(product)], product]
    chosenProduct[1].id = 'option-chosen';

}
const saveBillProductPrice = productChosen=>{
    const onlyInts = parseInt(productChosen.children[2].innerHTML.replace(/\D/g, ''));
    productChosen.children[2].innerHTML = `$ ${getNumberFormat(onlyInts)}`;
    productChosen.children[2].contentEditable = false;
    billProducts[getBillProductNumber(productChosen)].price = onlyInts;
    editingPriceProduct = false;
    updateTotalPrice();
    return onlyInts;
}

const updateTotalPrice = ()=>
    totalPriceText.innerHTML = `$ ${getNumberFormat(getTotalPrice())}`;

productSearcher.addEventListener('input', ()=>{
    productSelecter.innerHTML = '';
    chooseOption(null, null, -1, -1, -1);
    if(productSearcher.value.length >= 1){
            
        foundProducts = getPossibleProducts(productSearcher.value);
        if(foundProducts.length > 0)
            foundProducts.forEach(product=> addOption(productSelecter, product))
        else
            addOption(productSelecter, new Product(productSearcher.value, 0));
        
        if(productSelecter.childElementCount > 0)
            chooseOption(productSelecter.children[0], productSelecter, 0, 0);
    }

});
productSearcher.addEventListener('blur', ()=>clearSelector(productSearcher, productSelecter))

clientSearcher.addEventListener('input', ()=>{
    clientSelecter.innerHTML = '';
    chooseOption(null, null, -1, -1, -1);
    if(clientSearcher.value.length >= 1){
        foundClients = getPossibleClients(clientSearcher.value);
        foundClients.forEach(client=> addOption(clientSelecter, client));

        if(clientSelecter.childElementCount > 0)
            chooseOption(clientSelecter.children[0], clientSelecter, 0, 1);
    }
})
clientSearcher.addEventListener('blur', ()=>clearSelector(clientSearcher, clientSelecter))

productsContainer.addEventListener('click', e=>{
    const billProduct = e.target.closest('.product');
    if(billProduct && !modifingProductAmount){
        //console.log('clic en ' + billProduct);
        chooseBillProduct(billProduct);
    }
})
addEventListener('keydown', e =>{
    /*if(/^\d$/.test(e.key) && modifingProductAmount){
        if(chosenProduct[1]){

        }
    }else{*/
        switch(e.key){
            case 'ArrowDown':
                e.preventDefault();
                if(!editingPriceProduct && chosenOption[2] >= 0 && chosenOption[2] < (chosenOption[1].childElementCount - 1)){
                    
                    let nextOption = chosenOption[1].children[++chosenOption[2]];
                    chooseOption(nextOption, chosenOption[1], chosenOption[2], chosenOption[3]);
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if(!editingPriceProduct && chosenOption[2] >= 0 && chosenOption[2] > 0){
                    
                    let nextOption = chosenOption[1].children[--chosenOption[2]];
                    chooseOption(nextOption, chosenOption[1], chosenOption[2], chosenOption[3]);
                }
                break;
            case 'Enter':
                e.preventDefault();
                if(modifingProductAmount){
                    modifingProductAmount = false;
                    const amountText = chosenProduct[1].children[1];
                    const tempAmount = parseInt(amountText.innerHTML.trim());
                    const amount = (tempAmount >= 1 ? tempAmount : 1);
                    amountText.contentEditable = false;
                    amountText.innerHTML = amount;

                    chosenProduct[0].price *= amount;
                    chosenProduct[1].children[2].innerHTML = `$ ${getNumberFormat(chosenProduct[0].price)}`;

                    updateTotalPrice();

                    productSearcher.focus();

                }
                else if(editingPriceProduct){
                    let newPrice = saveBillProductPrice(chosenProduct[1]);
                    let answer = prompt('Como desea guardar este precio?\n1) Temporal\n2) Cambio definitivo' + (chosenClient ? '\n3) Precio especial para cliente' : '')).replace(/\s/g, '');
                    switch (answer){
                        case '1':
                            break;
                        case '2':
                            //Se guarda el precio nuevo, se establece en la variable productos y se guarda en el localStorage 
                            chosenProduct[0].price = newPrice;
                            //Aqui falta guardar el producto en el localStorage
                            break;
                        case '3':
                            //Se agrega una nueva excepcion al cliente
                            chosenClient.addException(chosenProduct[0].name, newPrice);
                            //Aqui falta guardar el cliente en el localStorage
                            break;
                        default:
                            //Cambio temporal
                            break;
                    }
                    //console.log(onlyInts);
                }else{
                    console.log(chosenOption)
                    if(chosenOption[3] == 0 || productSearcher.value.length > 0){
                        if(chosenOption[0]){
                            console.log('Esto es cuando se encontro un Producto');
                            let foundProduct = foundProducts.length > 0? foundProducts[chosenOption[2]] : new Product(productSearcher.value, 0);
                            
                            if(foundProducts.length == 0)
                                products.push(foundProduct);

                            const productCopy = {...foundProduct};
                            billProducts.push(productCopy);
                            addProduct(foundProduct);
                            
                            chooseBillProduct(document.querySelector(`.product${billProducts.length}`));

                            chooseOption(document.querySelector(`.product${billProducts.length}`),
                            productsContainer, billProducts.length - 1, 2);
                            
                            modifingProductAmount = true;
                            
                            chosenProduct[1].children[1].contentEditable = true;
                            chosenProduct[1].children[1].focus();

                            billItemsAmount.innerHTML = productsContainer.childElementCount;
                            updateTotalPrice();
                            clearSelector(productSearcher, productSelecter);
                        }else{
                            console.log('Esto es cuando NO se encontro un producto');
                            
                        }
                    }else if(chosenOption[3] == 1){
                        chosenClient = foundClients[chosenOption[2]];
                        billClient.innerHTML = chosenClient.name;
                        clearSelector(clientSearcher, clientSelecter);
                    }
                    
                }
                break;
            case 'F2':
                e.preventDefault();
                if(chosenProduct[1] && !modifingProductAmount){
                    chooseProductToEdit(chosenProduct[1]);
                }
                break;
        }
    //}
})

const startBill = ()=>{
    let hour = date.getHours();
    billTime.innerHTML = `${hour > 12? hour - 12 : hour}:${date.getMinutes()}:${date.getSeconds()} ${hour >= 12 ? 'pm' : 'am'}`;
    billId.innerHTML = ++billNumber;
}
billItemsAmount.innerHTML = 0;
startBill();
billDate.innerHTML = `${date.getDate()}/${monthNames[date.getMonth()]}/${date.getFullYear()}`;

