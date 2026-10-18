
class DataSaver{
    static contains = url =>{
        return localStorage.getItem(url) != null;
    }
    static hasProductsData = () =>{
        return this.contains('ProductsData');
    }
    static hasClientsData = ()=>{
        return this.contains('ClientsData');
    }
    static saveProductsData = products/*Product*/=>{
        localStorage.setItem('ProductsData', JSON.stringify(products));
    }
    static saveClientsData = clients /*Client*/=>
        localStorage.setItem('ClientsData', JSON.stringify(clients));
    static getProductsData = ()=>{
        const data = localStorage.getItem('ProductsData');
        let result = null;
        if(data){
            const arr = JSON.parse(data);
            result = [];
            for(let i = 0; i < arr.length; i ++){
                result.push(new Product());
                result[i].loadData(arr[i]);
            }
            return result;
        }
        return result;
    }
    static getClientsData = ()=>{
        const data = localStorage.getItem('ClientsData');
        let result = null;
        if(data){
            const arr = JSON.parse(data);
            result = [];
            for(let i = 0; i < arr.length; i ++){
                result.push(new Client());
                result[i].loadData(arr[i]);
            }
            return result;
        }
        return data ? JSON.parse(data) : null;
    }
}