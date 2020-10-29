require('dotenv/config');

const { ShoppingListRepository } = require('../../repositories/shopping-list.repository');
const { withStatusCode } = require('../../utils/response.util');
const { withProcessEnv } = require('../../dynamodb.factory');

const docClient = withProcessEnv(process.env)();
const repository = new ShoppingListRepository(docClient);
const noContent = withStatusCode(204);

exports.handler = async (event) => {
  let { id, date } = event.pathParameters;
  id = parseInt(id);

  await repository.deleteShoppingList(id, date);

  return noContent();
};