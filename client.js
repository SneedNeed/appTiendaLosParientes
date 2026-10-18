class Client{
    constructor(name, exceptions){
        this.name = name;
        this.exceptions = exceptions;
    }
    loadData(data){
        this.name = data.name;
        this.exceptions = data.exceptions;
    }
    addException = (product, price)=>{
        this.exceptions[product.toLowerCase()] = price;
    }
    checkException = productName=>{
        const name = productName.toLowerCase();
        return (name in this.exceptions) ?  
            this.exceptions[name] : -1; 
    }
    toDict = ()=>{
        return {
            name:this.name,
            exceptions:this.exceptions
        };
    }

}