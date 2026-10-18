
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

//Buttons
const startBillButton = document.querySelector('.start-button');
const endBillButton = document.querySelector('.finish-button');
const editButton = document.querySelector('.edit-button');
const deleteButton = document.querySelector('.delete-button');

const cancelButton = document.querySelector('.cancel-button');
const copyBillButton = document.querySelector('.copy-button');

const billContainer = document.querySelector('.bill-container');


const productsContainer = document.querySelector(".products-container");

const totalPriceText = document.querySelector(".totalPrice-text");

const date = new Date();
const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

let products;
let clients;

const defaultProducts = [
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

const defaultClients = [
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

if(DataSaver.hasProductsData()){
    products = DataSaver.getProductsData();
}else
    products = defaultProducts;


if(DataSaver.hasClientsData()){
    clients = DataSaver.getClientsData();
}else
    clients = defaultClients;


const billProducts = [];

let foundProducts = [];
let foundClients = [];

let chosenOption = [/*option, fatherOption, index, i{0:product, 1:client, 2: billProduct}*/];

let chosenClient;
let chosenProduct = [/*producto, etiqueta*/];

let billNumber = 0;

let billStarted = false;
let modifingProductAmount = false;

let editingPriceProduct = false;

//Functions
const saveProductsData = ()=>{
    const dataToSave = [];
    products.forEach(product => dataToSave.push(product.toDict()));

    DataSaver.saveProductsData(dataToSave);
}
const saveClientsData = () =>{
    const dataToSave = [];
    clients.forEach(client => dataToSave.push(client.toDict()));

    DataSaver.saveClientsData(dataToSave);
}

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
const addOption =(container, product, word)=>{
    container.innerHTML += `<p class="possibleOption">${word ? `Crear ${word} "` : ''}${product.name}${word ?'"' : ''}</p>`;
}
const addProduct = product =>{
    let productCopy = {...product};
    let price = checkProductException(productCopy);
    productCopy.price = price;

    billProducts.push(productCopy);
    productsContainer.innerHTML += `
        <div class="product ${product.name} product${billProducts.length}">
            <p class="bill-text product-name">${product.name}</p>
            <p class="bill-text product-amount"></p>
            <p class="bill-text product-price">$ ${getNumberFormat(price)}</p>
        </div>`;
    
}
const checkProductException = product =>{
    console.log(product)
    if(chosenClient){
        let i = chosenClient.checkException(product.name);
        if(i > 0)
            return i;
        else
            product.price;
    }
    return product.price;
}
const getPossibleProducts = string =>{
    res = [];
    console.log(products);
    for(let i = 0; i < products.length; i ++){
        console.log(`{${products[i].name.toLowerCase()} == ${string.toLowerCase()}`);
        if(products[i].name.toLowerCase().startsWith(string.toLowerCase()))
            res.push(products[i])
    }
    return res;
}
const getPossibleClients = string =>{
    res = [];
    for(let i = 0; i < clients.length; i ++){
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
    
    let actAmount = parseInt(billProduct.children[1].innerHTML);
    let actPrice = billProducts[getBillProductNumber(billProduct)].price;
    billProduct.children[1].contentEditable = true;
    billProduct.children[2].contentEditable = true;
    
    billProduct.children[2].innerHTML = actPrice / actAmount;
    billProduct.children[2].focus();
}
const chooseBillProduct = product =>{
    if(chosenProduct[1]){
        chosenProduct[1].removeAttribute('id');
    }

    chosenProduct = [billProducts[getBillProductNumber(product)], product]
    chosenProduct[1].id = 'option-chosen';
    updateButtonStates();

}
const saveBillProductPrice = productChosen=>{
    const actPrice = parseInt(productChosen.children[2].innerHTML.replace(/\D/g, ''));
    const tempAmount = parseInt(productChosen.children[1].innerHTML.replace(/\D/g, ''));
    
    const actAmount = tempAmount > 0 ? tempAmount : 1;

    const billProduct = billProducts[getBillProductNumber(productChosen)];

    productChosen.children[2].innerHTML = `$ ${getNumberFormat(actPrice * actAmount)}`;
    productChosen.children[2].contentEditable = false;

    productChosen.children[1].innerHTML = actAmount;
    productChosen.children[1].contentEditable = false;
    
    billProduct.price = actPrice * actAmount;
    editingPriceProduct = false;
    updateTotalPrice();
    return actPrice;
}
const updateBillProductClasses = ()=>{
    for(let i = 0; i < billProducts.length; i ++){
        productsContainer.children[i].className = 
        `product ${billProducts[i].name} product${i + 1}`;
    }
}
const deleteChosenBillProduct = () =>{
    if(chosenProduct[1] && !modifingProductAmount){
        billProducts.splice(getBillProductNumber(chosenProduct[1]), 1);
        chosenProduct[1].remove();
        chooseOption(null, null, -1, -1);
        updateTotalPrice();
        updateBillProductClasses();
        console.log(billProducts);
        updateButtonStates();
    }
}

const updateTotalPrice = ()=>
    totalPriceText.innerHTML = `$ ${getNumberFormat(getTotalPrice())}`;

productSearcher.addEventListener('input', ()=>{
    productSelecter.innerHTML = '';
    chooseOption(null, null, -1, -1, -1);
    if(productSearcher.value.length >= 1){
            
        foundProducts = getPossibleProducts(productSearcher.value);
        console.log(foundProducts);
        if(foundProducts.length > 0)
            foundProducts.forEach(product=> addOption(productSelecter, product))
        else
            addOption(productSelecter, new Product(productSearcher.value, 0), 'producto');
        
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
        if(foundClients.length > 0)
            foundClients.forEach(client=> addOption(clientSelecter, client));
        else
            addOption(clientSelecter, new Client(clientSearcher.value), 'cliente');

        if(clientSelecter.childElementCount > 0)
            chooseOption(clientSelecter.children[0], clientSelecter, 0, 1);
    }
})
clientSearcher.addEventListener('blur', ()=>clearSelector(clientSearcher, clientSelecter))

productsContainer.addEventListener('click', e=>{
    const billProduct = e.target.closest('.product');
    if(billProduct && !modifingProductAmount){
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
                    
                    let price = checkProductException(chosenProduct[0]);
                    chosenProduct[0].price = price * amount;
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
                            //chosenProduct[0].price = newPrice;
                            products.forEach(e=>{
                                if(e.name == chosenProduct[0].name){
                                    e.price = newPrice;
                                }
                            })
                            saveProductsData();

                            //Aqui falta guardar el producto en el localStorage
                            break;
                        case '3':
                            //Se agrega una nueva excepcion al cliente
                            if(chosenClient){
                                chosenClient.addException(chosenProduct[0].name, newPrice);
                                saveClientsData();
                            }
                            //Aqui falta guardar el cliente en el localStorage
                            break;
                        default:
                            //Cambio temporal
                            break;
                    }
                }else{
                    if(chosenOption[3] == 0 || productSearcher.value.length > 0){
                        if(chosenOption[0]){
                            let foundProduct = foundProducts.length > 0? foundProducts[chosenOption[2]] : new Product(productSearcher.value, 0);
                            
                            if(foundProducts.length == 0){
                                products.push(foundProduct);
                                saveProductsData();
                            }

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
                        }
                    }else if(chosenOption[3] == 1){
                        if(foundClients.length > 0){
                            chosenClient = foundClients[chosenOption[2]];
                        }else{
                            chosenClient = new Client(clientSearcher.value, {});
                            clients.push(chosenClient);
                            saveClientsData();
                        }
                        
                        billClient.innerHTML = chosenClient.name;
                        clearSelector(clientSearcher, clientSelecter);

                        for(let i = 0; i < billProducts.length; i ++){
                            const container = productsContainer.children[i].children;
                            const amount = parseInt(container[1].innerHTML);
                            const price = checkProductException(billProducts[i]);

                            billProducts[i].price = price * amount;
                            container[2].innerHTML = `$ ${getNumberFormat(billProducts[i].price)}`;
                            updateTotalPrice();
                        }
                    }
                    
                }
                break;
            case 'F2':
                e.preventDefault();
                if(chosenProduct[1] && !modifingProductAmount){
                    chooseProductToEdit(chosenProduct[1]);
                }
                break;
            case 'F7':
                e.preventDefault();
                
                deleteChosenBillProduct();
                
                break;
            case 'F3':
                e.preventDefault();
                startBill();
                break;
            case 'F1':
                e.preventDefault();
                copyBill(billContainer);
                break;
        }
    //}
})

startBillButton.addEventListener('click', ()=> startBill())
deleteButton.addEventListener('click', ()=>deleteChosenBillProduct());
copyBillButton.addEventListener('click', ()=>copyBill(billContainer))
editButton.addEventListener('click', ()=>{
    
    if(chosenProduct[1] && !modifingProductAmount){
        chooseProductToEdit(chosenProduct[1]);
    }
})

async function copyBill(selectorOElemento) {
    chooseOption(null, null, -1, -1);
    const elemento = typeof selectorOElemento === 'string' 
        ? document.querySelector(selectorOElemento) 
        : selectorOElemento;

    if (!elemento) {
        console.error("El elemento a capturar no existe en el DOM.");
        return;
    }

    try {
        const blobPromise = html2canvas(elemento, {
            scale: 2,
            backgroundColor: null,
            useCORS: true,   // <--- ¡Crucial para permitir imágenes externas/locales!
            allowTaint: true // <--- Evita que falle si algún recurso cruza políticas de seguridad
        }).then(canvas => {
            return new Promise((resolve, reject) => {
                canvas.toBlob(blob => {
                    if (blob) resolve(blob);
                    else reject(new Error("El canvas generó un blob vacío."));
                }, "image/png");
            });
        });

        const item = new ClipboardItem({ "image/png": blobPromise });
        await navigator.clipboard.write([item]);
        
        console.log("¡Imagen del recibo copiada con éxito!");

    } catch (error) {
        console.error("Ocurrió un error al intentar copiar la imagen:", error);
    }
}

const updateBillTime =() =>{

    let hour = date.getHours();
    billTime.innerHTML = `${hour > 12? hour - 12 : hour}:${date.getMinutes()}:${date.getSeconds()} ${hour >= 12 ? 'pm' : 'am'}`;
    billDate.innerHTML = `${date.getDate()}/${monthNames[date.getMonth()]}/${date.getFullYear()}`;

}

const startBill = ()=>{
    if(!billStarted){
        updateBillTime();
        billId.innerHTML = ++billNumber;
        billStarted = true;
        billItemsAmount.innerHTML = 0;
        updateButtonStates();

        productSearcher.focus();
    }
}
const updateButtonStates = ()=>{
    startBillButton.disabled = billStarted;
    endBillButton.disabled = !billStarted;
    editButton.disabled = chosenProduct[0] == null;
    deleteButton.disabled = chosenProduct[0] == null;
    cancelButton.disabled = !billStarted;
    copyBillButton.disabled = billStarted || billNumber <= 0; 

    productSearcher.disabled = !billStarted;
    clientSearcher.disabled = !billStarted;
}
billItemsAmount.innerHTML = 0;
updateButtonStates();
updateBillTime();