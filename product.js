
class Product{
    constructor(name, price, options){
        this.name = name;//String
        this.price = price;//int
        this.options = options;//String[]
    }
    loadData(data){
        this.name = data.name;
        this.price = data.price;
        this.options = data.options;
    }
    toDict = ()=>{
        return {
            name: this.name,
            price: this.price,
            options:this.options
        }
    }
}