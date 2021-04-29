const { IDataSource } = require('../interfaces/interfaceDataSource');

class ContextDataSource extends IDataSource{
    constructor(dataSource){
        super();
        this._dataSource = dataSource;
    }

    async open(string){
        return this._dataSource.open(string);
    }
    
    async selectById(id){
        return await this._dataSource.selectById(id);
    }
    
    async select(filter, orderBy){
        return await this._dataSource.select(filter, orderBy);
    }
    
    async selectAndOrder(id, orderBy){
        return await this._dataSource.selectAndOrder(id, orderBy);
    }
    
    async insert(item){
        return await this._dataSource.insert(item);
    }
    
    async update(id, item){
        return await this._dataSource.update(id, item);
    }

    async delete(id){
        return await this._dataSource.delete(id);
    }
}

module.exports = {
    ContextDataSource
}