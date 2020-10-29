class GroupRepository {
  get _baseParams() {
    return {
      TableName: 'household-finance-backend-groups-dev'
    };
  }

  constructor(documentClient) {
    this._documentClient = documentClient;
  }

  async listGroups() {
    const params = this._createParamObject();
    const response = 
      await this._documentClient.scan(params).promise();

    return response.Items || [];
  }

  async getGroup(id) {
    const params = this._createParamObject({ Key: { id } });
    const response = await this._documentClient.get(params).promise();

    return response.Item;
  }

  async putGroup(group) {
    const params = this._createParamObject({ Item: group });
    await this._documentClient.put(params).promise();

    return group;
  }

  async deleteGroup(id) {

    const params = this._createParamObject({ Key: { id } });
    await this._documentClient.delete(params).promise();

    return id;
  }

  _createParamObject(additionalArgs = {}) {
    return Object.assign({}, this._baseParams, additionalArgs);
  }
}

exports.GroupRepository = GroupRepository;