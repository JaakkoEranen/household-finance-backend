require('dotenv/config');

const { ShoppingListRepository } = require('../../repositories/shopping-list.repository');
const { withStatusCode } = require('../../utils/response.util');
const { parseWith } = require('../../utils/request.util');
const { withProcessEnv } = require('../../dynamodb.factory');

const docClient = withProcessEnv(process.env)();
const repository = new ShoppingListRepository(docClient);
const created = withStatusCode(201);
const parseJson = parseWith(JSON.parse);

exports.handler = async (event) => {
  const { body } = event;
  const shoppingList = parseJson(body);

  await repository.putShoppingList(shoppingList);

  return created();
};