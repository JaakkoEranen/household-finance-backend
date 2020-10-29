class FinanceRepository {
  get _baseParams() {
    return {
      TableName: 'household-finance-backend-finance-dev'
    };
  }

  constructor(documentClient) {
    this._documentClient = documentClient;
  }

  async getFinance(id, date) {
    const params = this._createParamObject({ Key: { id, date } });

    const response = await this._documentClient.get(params).promise();

    return response.Item;
  }

  async getFinanceMonth(id, month) {
    let dateList = [];
    let totalCosts = {};
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
        'household-finance-backend-finance-dev': {
            Keys: keys
          }
        }
    });

    const response = await this._documentClient.batchGet(params).promise();

    if (response.Responses['household-finance-backend-finance-dev'].length === 0 ) {
      return;
    }

    for (const finance of response.Responses['household-finance-backend-finance-dev']) {
      
      dateList.push(finance.date);
      
      for (const user in finance.finance) {
        
        if (!totalCosts[user]) {
          totalCosts[user] = 0;
        }

        if (finance.finance[user].length > 0 ) {
          for (const cost of finance.finance[user]) {
            totalCosts[user] += cost.cost;
          }
        } else {
          totalCosts[user] += cost.cost;
        }

      }

    }

    return {dateList, totalCosts};
  }

  async putFinance(list) {
    const params = this._createParamObject({ Item: list });
    await this._documentClient.put(params).promise();

    return list;
  }

  async deleteFinance(id, date) {

    const params = this._createParamObject({ Key: { id, date } });
    await this._documentClient.delete(params).promise();

    return id;
  }

  _createParamObject(additionalArgs = {}) {
    return Object.assign({}, this._baseParams, additionalArgs);
  }
}

exports.FinanceRepository = FinanceRepository;