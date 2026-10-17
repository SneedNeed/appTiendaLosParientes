
class Product{
    constructor(name, price, options){
        this.name = name;//String
        this.price = price;//int
        this.options = options;//String[]
    }
    toDict = ()=>{
        return {
            name: this.name,
            price: this.price,
            options:this.options
        }
    }
}