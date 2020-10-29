class ShoppingListRepository {
  get _baseParams() {
    return {
      TableName: 'household-finance-backend-shopping-list-dev'
    };
  }

  constructor(documentClient) {
    this._documentClient = documentClient;
  }

  async getShoppingList(id, date) {
    const params = this._createParamObject({ Key: { id, date } });
    const response = await this._documentClient.get(params).promise();

    return response.Item;
  }

  async getShoppingListMonth(id, month) {
    let dateList = [];
    let keys = [];

    for (let i = 1; i <= 31; i++) {
      let day = i;
      if (day < 10) {
        day = '0' + day;
      }
      keys.push({id: id, date: month + '-' + day })
    }

    const params = this._createParamObject({ 
      RequestItems: {
        'household-finance-backend-shopping-list-dev': {
            Keys: keys
          }
        }
    });

    const response = await this._documentClient.batchGet(params).promise();

    if (response.Responses['household-finance-backend-shopping-list-dev'].length === 0) {
      return;
    }

    for (const shoppingList of response.Responses['household-finance-backend-shopping-list-dev']) {
      dateList.push(shoppingList.date);
    }

    return {dateList};
  }

  async putShoppingList(list) {
    const params = this._createParamObject({ Item: list });
    await this._documentClient.put(params).promise();

    return list;
  }

  async deleteShoppingList(id, date) {

    const params = this._createParamObject({ Key: { id, date } });
    await this._documentClient.delete(params).promise();

    return id;
  }

  _createParamObject(additionalArgs = {}) {
    return Object.assign({}, this._baseParams, additionalArgs);
  }
}

exports.ShoppingListRepository = ShoppingListRepository;