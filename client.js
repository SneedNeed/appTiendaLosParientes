class Client{
    constructor(name, exceptions){
        this.name = name;
        this.exceptions = exceptions;
    }
    addException = (product, price)=>{
        this.exceptions[product] = price;
    }
    checkException = productName=>{
        return (productName in this.exceptions) ?  
            this.exceptions[productName] : -1; 
    }

}